# Bonk Brawl

A wobbly ragdoll fighting game that runs in the browser, built with Three.js and cannon.js.

Live: https://bonk-brawl.bonkbrawl.workers.dev

## Controls

| Key | Action |
| --- | --- |
| W / S | Walk forward / back |
| Q / E | Swing left / right arm |
| A / D | Kick left / right leg |
| T | Hold to grab and keep hold; let go to release |
| R | While holding on, hold to pull them down |
| Q / E / A / D (tap) or S (hold) | Break free when grabbed |
| ← / → | Turn |
| ↑ / ↓ | Tilt the camera |

## Modes

- **Classic**: win by knockout or by knocking your rival off the mat. Knockback grows with damage taken.
- **Knockout only**: a roped ring, so the only way to win is a K.O.
- Solo against a CPU or a training dummy, or 1v1 online with a 4-letter room code.

## How it's built

- `public/index.html` is the whole game: rendering, physics, CPU and netcode.
- `src/index.js` is a Cloudflare Worker with one Durable Object per room code that relays each player's state over WebSockets. The host's browser runs the fight; the guest sends inputs and draws the host's state.
- The same page also runs on claude.ai, where it uses the artifact live-room capability instead of the relay.

## Develop and deploy

```bash
npm install
npx cf dev
```

```bash
npx cf deploy
```
