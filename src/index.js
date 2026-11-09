import { DurableObject } from "cloudflare:workers";

const ROOM = /^\/ws\/([a-z0-9][a-z0-9_.-]{0,47})$/;
const MAX_PEERS = 16;
const MAX_MESSAGE = 4096;

export default {
  async fetch(request, env, ctx) {
    const match = new URL(request.url).pathname.match(ROOM);
    if (!match) return new Response("Not found", { status: 404 });
    if (request.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket upgrade", { status: 426 });
    const relay = ctx.exports.Relay;
    return relay.get(relay.idFromName(match[1])).fetch(request);
  },
};

// One instance per match code. It only forwards each player's latest presence to the others; the host's browser runs the game.
export class Relay extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    // Presence lives in memory rather than socket attachments, which cap at 2 KB; an active match never hibernates, so nothing is lost.
    this.presence = new Map();
  }

  async fetch() {
    const sockets = this.ctx.getWebSockets();
    if (sockets.length >= MAX_PEERS) return new Response("Room is full", { status: 429 });
    const [client, server] = Object.values(new WebSocketPair());
    const peer = crypto.randomUUID().slice(0, 12);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ peer });
    const peers = sockets
      .map((ws) => ws.deserializeAttachment()?.peer)
      .filter(Boolean)
      .map((id) => ({ peer: id, presence: this.presence.get(id) ?? {} }));
    server.send(JSON.stringify({ t: "hello", peer, peers }));
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, message) {
    if (typeof message !== "string" || message.length > MAX_MESSAGE) return;
    let data;
    try { data = JSON.parse(message); } catch { return; }
    if (data?.t !== "p" || typeof data.presence !== "object" || data.presence === null || Array.isArray(data.presence)) return;
    const peer = ws.deserializeAttachment()?.peer;
    if (!peer) return;
    this.presence.set(peer, data.presence);
    this.broadcast(ws, JSON.stringify({ t: "p", peer, presence: data.presence }));
  }

  webSocketClose(ws) { this.drop(ws); }
  webSocketError(ws) { this.drop(ws); }

  drop(ws) {
    const peer = ws.deserializeAttachment()?.peer;
    if (!peer) return;
    this.presence.delete(peer);
    this.broadcast(ws, JSON.stringify({ t: "leave", peer }));
  }

  broadcast(from, text) {
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === from) continue;
      try { ws.send(text); } catch {}
    }
  }
}
