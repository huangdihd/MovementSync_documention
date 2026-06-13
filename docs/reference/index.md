# Developer Reference

This section is for plugin developers who want to drive MovementSync from
code or extend its behaviour. For end-user commands, see the
[Commands](/guide/commands) page.

## Architecture at a glance

MovementSync implements xinbot's `Plugin` interface. The entry point,
`xin.bbtt.MovementSync`, wires up packet listeners and starts the timing
loops, and exposes the main subsystems as singletons:

```java
MovementSync ms = MovementSync.INSTANCE;

ms.getWorld();              // local world model (blocks + entities)
ms.getMovementController(); // queue/executor for Movements
ms.getInventoryManager();   // hotbar, tool selection, block finding
```

### The two timing loops

| Loop | Period | Responsibility |
|------|--------|----------------|
| **Physics simulation** | 50 ms (20 TPS) | `updateMotionTask` integrates velocity, applies gravity (`-0.08`/tick, terminal `-3.92`), resolves ground collisions, and sends movement packets. |
| **Movement execution** | 50 ms (20 TPS) | The `MovementController` ticks the current `Movement` via a `MovementTask`. |

Keeping bot state (`position`, `velocity`, `pitch`, `yaw`, `onGround`) in
`AtomicReference`/`AtomicBoolean` fields lets the packet-listener threads and
the loops share state safely.

### Core building blocks

- **[MovementController](./movement-controller)** — an ordered queue of
  `Movement` objects with one executing at a time. Supports append, immediate
  insert, pause/resume and cancel.
- **`Movement`** — the unit of action (walk, jump, dig, place, look, follow a
  path…). An abstract class with an `init` / `onTick` / `onStop` lifecycle.
- **[Pathfinding](./pathfinding)** — a D* Lite search over a graph built from
  pluggable `MovementStrategy` objects, producing `PathStep`s that the
  `PathMovement` follows.
- **[World model](./world)** — a chunk-backed view of blocks and a registry of
  entities, fed by packet listeners.

## Quick example: walk somewhere

```java
import xin.bbtt.MovementSync;
import org.joml.Vector3i;

MovementSync ms = MovementSync.INSTANCE;

// Set a goal and let the pathfinder plan + execute a route to it.
ms.setActiveGoal(new Vector3i(100, 64, -200));
ms.triggerAutoRepath();
```

`triggerAutoRepath()` runs D* Lite from the current position to the active
goal (or the followed entity), then replaces the controller's queue with a
fresh `PathMovement`. Call `requestRepath()` to ask the in-flight
`PathMovement` to recompute mid-route.

## Helper methods on `MovementSync`

| Method | What it does |
|--------|--------------|
| `jump()` | Apply an upward impulse (`+0.42`) if on the ground. |
| `lookAt(Vector3d)` | Queue a `LookAtMovement` that smoothly turns toward a point. |
| `directLookAt(Vector3d)` | Set `pitch`/`yaw` instantly toward a point. |
| `getHeadPosition()` | Eye position (`position + 1.62` on Y). |
| `isRiding()` / `getVehicleId()` | Vehicle state when mounted. |
| `triggerAutoRepath([keepDistance])` | Plan and dispatch a path to the active goal / follow target. |
| `requestRepath()` | Ask the current `PathMovement` to replan. |

Continue with [MovementController](./movement-controller) for the execution
model.
