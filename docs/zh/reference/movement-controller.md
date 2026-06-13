# MovementController

`xin.bbtt.movement.MovementController` 是从队列中逐个执行 `Movement` 的调度器。通过 `MovementSync.INSTANCE.getMovementController()` 获取共享实例。

## Movement 生命周期

每个动作都是抽象类 `xin.bbtt.movement.Movement` 的子类：

```java
public abstract class Movement {
    protected boolean finished = false;

    public abstract void init();      // 首次 tick 前调用一次
    public abstract void onTick();    // 激活期间每 50 ms 调用一次
    public abstract long getTime();   // 时间上限（ms）；负值表示改用 isFinished()
    public abstract void onStop();    // 停止 / 结束时的清理

    public void onPause()  {}         // 可选
    public void onResume() {}         // 可选
}
```

控制器把当前 movement 包装进 `MovementTask`，以 **20 TPS**（每 50 ms）调度。movement 在以下任一情况下结束：

- 其 `getTime()` 上限耗尽，或
- 它将 `finished` 置为 `true`（通过继承的 `isFinished()` 检查）。

当一个 movement 结束时，控制器从队列中取出下一个。

### 内置 Movement

`WalkMovement`、`JumpMovement`、`LookAtMovement`、`DigBlockMovement`、`PlaceBlockMovement`、`InteractEntityMovement`、`ActionMovement` 以及 `PathMovement`（路径跟随器）都位于 `xin.bbtt.movements` 包中。

## 队列 API

```java
MovementController mc = MovementSync.INSTANCE.getMovementController();

mc.addMovement(movement);     // 追加到队列尾部
mc.insertMovement(movement);  // 立即中断；之后恢复原来的 movement
mc.finishCurrentMovement();   // 停止当前并前进到下一个
mc.cancelAll();               // 清空队列并停止当前 movement
```

| 方法 | 行为 |
|------|------|
| `addMovement(Movement)` | 加入**队尾**。若空闲则开始执行。 |
| `insertMovement(Movement)` | **立即**取消正在运行的任务，将被中断的 movement 压回**队首**以便之后恢复，然后先执行插入的那个。 |
| `finishCurrentMovement()` | 停止当前 movement 并前进。 |
| `removeMovement(int index)` | 按索引移除一个排队中的 movement。 |
| `cancelAll()` | 清空一切并停止。 |
| `getCurrentMovement()` | 当前正在执行的 movement（或 `null`）。 |
| `getMovements()` | 排队中 movement 的 `List` 快照。 |

::: tip add vs. insert
`addMovement` 是协作式的——它会等待队列。`insertMovement` 是抢占式的——它会**立刻**取消正在运行任务的线程（`Future.cancel(true)`），先执行你的 movement，再恢复被中断的那个。例如 `PILLAR` 就是这样在 `JumpMovement` 之前插入一个 `PlaceBlockMovement` 的。
:::

## 暂停 / 恢复

```java
mc.pause();   // 在当前 movement 上调用 onPause()；停止派发
mc.resume();  // 调用 onResume()；恢复派发
boolean paused = mc.isPaused();
```

暂停会阻止派发新的 movement 并通知当前 movement，同时不丢弃队列。这正是 `movement pause|resume|cancel` 命令的底层实现。

## 线程说明

- 状态切换由内部 `stateLock` 保护；`isExecuting` 与 `isPaused` 是 `AtomicBoolean`，用于无锁快速路径。
- Movement 在专用的单线程 `ScheduledExecutorService`（`MovementSync.INSTANCE.movementService`）上运行，与物理循环相互独立。
- 由于 `insertMovement` 会以中断方式取消任务，耗时较长的 `onTick` 逻辑应当能响应中断。
