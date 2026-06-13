# MovementController

`xin.bbtt.movement.MovementController` is the scheduler that runs `Movement`s
one at a time off a queue. Access the shared instance via
`MovementSync.INSTANCE.getMovementController()`.

## The Movement lifecycle

Every action is a subclass of the abstract `xin.bbtt.movement.Movement`:

```java
public abstract class Movement {
    protected boolean finished = false;

    public abstract void init();      // called once before the first tick
    public abstract void onTick();    // called every 50 ms while active
    public abstract long getTime();   // time limit in ms; negative = use isFinished()
    public abstract void onStop();    // cleanup when stopped/finished

    public void onPause()  {}         // optional
    public void onResume() {}         // optional
}
```

The controller wraps the current movement in a `MovementTask` scheduled at
**20 TPS** (every 50 ms). A movement ends when either:

- its `getTime()` limit elapses, or
- it sets `finished = true` (checked via the inherited `isFinished()`).

When a movement finishes the controller pulls the next one off the queue.

### Built-in Movements

`WalkMovement`, `JumpMovement`, `LookAtMovement`, `DigBlockMovement`,
`PlaceBlockMovement`, `InteractEntityMovement`, `ActionMovement` and
`PathMovement` (the path follower) all live in `xin.bbtt.movements`.

## Queue API

```java
MovementController mc = MovementSync.INSTANCE.getMovementController();

mc.addMovement(movement);     // append to the back of the queue
mc.insertMovement(movement);  // interrupt now; resume the old one afterwards
mc.finishCurrentMovement();   // stop the current one, advance to the next
mc.cancelAll();               // clear the queue and stop the current movement
```

| Method | Behaviour |
|--------|-----------|
| `addMovement(Movement)` | Adds to the **tail**. Starts execution if idle. |
| `insertMovement(Movement)` | Cancels the running task **immediately**, pushes the interrupted movement back to the **head** so it resumes afterward, then runs the inserted one first. |
| `finishCurrentMovement()` | Stops the current movement and advances. |
| `removeMovement(int index)` | Removes a queued movement by index. |
| `cancelAll()` | Clears everything and stops. |
| `getCurrentMovement()` | The movement currently executing (or `null`). |
| `getMovements()` | A snapshot `List` of queued movements. |

::: tip add vs. insert
`addMovement` is cooperative — it waits for the queue. `insertMovement` is
pre-emptive — it cancels the running task's thread *now* (`Future.cancel(true)`)
and runs your movement before resuming what was interrupted. `PILLAR`, for
example, inserts a `PlaceBlockMovement` ahead of a `JumpMovement` this way.
:::

## Pause / Resume

```java
mc.pause();   // calls onPause() on the current movement; halts dispatch
mc.resume();  // calls onResume(); resumes dispatch
boolean paused = mc.isPaused();
```

Pausing stops new movements from being dispatched and notifies the current
movement, without discarding the queue. This backs the
`movement pause|resume|cancel` command.

## Threading notes

- State transitions are guarded by an internal `stateLock`; `isExecuting` and
  `isPaused` are `AtomicBoolean`s for lock-free fast paths.
- Movements run on a dedicated single-thread `ScheduledExecutorService`
  (`MovementSync.INSTANCE.movementService`), separate from the physics loop.
- Because `insertMovement` cancels with interruption, long-running `onTick`
  work should be interrupt-aware.
