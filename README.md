# Bonk Brawl

A wobbly ragdoll fighting game that runs in the browser, built with Three.js and cannon.js.

Live: https://bonk-brawl.bonkbrawl.workers.dev

## Controls

| Key | Action |
| --- | --- |
| W / S | Walk forward / back |
| Q / E | Swing left / right arm |
| A / D | Kick left / right leg |
| X | Tap to grab and keep hold; tap again to let go |
| Z | While holding a fighter, hold to pull them down; while holding junk, throw it |
| Q / E / A / D (tap) or S (hold) | Break free when grabbed |
| ← / → | Turn |
| ↑ / ↓ | Tilt the camera |

## Modes

- **Classic**: win by knockout or by knocking your rival off the mat. Knockback grows with damage taken.
- **Knockout only**: a roped ring, so the only way to win is a K.O.
- Solo against a CPU, 2v2 or 3v3 with CPU partners, a 6- or 10-fighter free-for-all against CPUs, or against a training dummy.

## Arenas

- **Classic mat**: an open mat with no hazards.
- **Junkyard**: a grinder pit in the middle chews up anyone who falls in (heavy damage every second) and spits them back out. Crates and barrels lie around the mat: walk up and tap X to pick one up, Z to throw it, X to drop it. Thrown junk hurts whoever it hits.

**Bomb vest**: in about half of rounds a vest drops in once, in any arena. Whoever steps on it wears it, and 3.5 seconds later it explodes, knocking out the wearer and blasting everyone within about 6 m away.

## Online formats

The host picks a format and shares a 4-letter room code. Friends take seats in the order they join; CPUs fill empty seats, and anyone who joins a full match watches until a seat opens.

- **1v1**: you against one friend.
- **2v2 teams** and **3v3 teams**: up to 4 or 6 players.
- **Co-op vs CPU**: you and a friend on red against two CPUs.
- **Free-for-all** and **Mega free-for-all**: up to 6 or 10 players, everyone for themselves; the last fighter standing wins the round. Each fighter gets their own color.

In team matches there is no friendly fire: teammates can bump each other, but hits and grabs only work on the other team. A fighter who is knocked out or rung out sits out the rest of the round, and a team wins the round when the whole other team is down.

## Customization

Open **Customize** from the menu to change your fighter. Your look is saved in your browser and sent to your opponent online.

- **Race**: Human, Alien (same stats as Human), or Beast (hits about 30% harder and grabs harder, but walks about 22% slower).
- **Body**: slim, average, heavy, or stickman (looks only). Stickmen pick a drawn face instead of hair and skin: smile, grin, angry, shocked, cool, sleepy, or X-eyes.
- **Hair**: bald, buzz, short, spiky, mohawk, afro, or long, in seven colors.
- **Facial hair**: none, stubble, mustache, goatee, or full beard.
- **Skin or fur**: five tones per race.

Shirts and gloves keep the red and blue team colors so the two fighters are always easy to tell apart.

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
