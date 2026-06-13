# FAQ

## What is MovementSync?

It's a plugin for [xinbot](https://github.com/huangdihd/xinbot) that gives the
bot a "body": it simulates physics (gravity, velocity, ground detection),
keeps a local model of the loaded world, and provides pathfinding plus
commands so the bot can move around and interact with terrain.

## Does it work on its own?

No. MovementSync is a xinbot plugin and needs a running xinbot instance
(`2.0.0-RELEASE` or newer). Place the JAR in xinbot's plugin directory and
start xinbot.

## The bot won't move with `goto`. What's wrong?

A few common causes:

- **The target chunks aren't loaded.** Pathfinding only works over the part of
  the world the client has received. Make sure the bot is near, or has
  streamed, the area you're routing through.
- **No path exists within the search limit.** `goto` caps the search
  (see [Pathfinding](/reference/pathfinding)). Very long or blocked routes can
  exceed it; try an intermediate waypoint.
- **The bot is paused.** Run `movement resume`, or `stop` to clear state and
  try again.

Run `debug` to see the current position, velocity and the active movement.

## Why does the bot dig / place blocks while pathfinding?

The pathfinder can choose movement types beyond plain walking — `DIG` to clear
an obstacle, and `BRIDGE` / `PILLAR` to build across gaps or upward. Digging
auto-selects the best tool from the hotbar; bridging and pillaring need a
stack of placeable blocks in the hotbar. If no blocks are available, the bot
replans instead of walking into the gap.

## Can I control it from my own plugin?

Yes. MovementSync exposes its `MovementController`, world model and pathfinder.
You can also define custom movement types and strategies. See the
[**Developer Reference**](/reference/).

## Which Minecraft / xinbot versions are supported?

It targets the protocol that xinbot `2.0.0-RELEASE` supports. Keep xinbot and
MovementSync reasonably in sync; check the
[Releases](https://github.com/huangdihd/MovementSync/releases) notes for
version-specific details.

## How do I report a bug or request a feature?

Open an issue on [GitHub](https://github.com/huangdihd/MovementSync/issues).
Including a `debug` dump and the relevant log lines helps a lot.
