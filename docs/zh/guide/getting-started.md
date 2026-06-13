# 快速开始

MovementSync 是一个 [xinbot](https://github.com/huangdihd/xinbot) 插件，负责机器人的**移动**、**寻路**与**地形交互**。它运行一套物理模拟循环，维护一份本地世界视图，并提供命令与 API，让你的机器人能够行走、跳跃、寻路、挖掘、放置方块以及与世界交互。

## 1. 环境要求

- 一个运行中的 [**xinbot**](https://github.com/huangdihd/xinbot) 实例（**2.0.0-RELEASE** 或更新版本）。
- **Java 17** 或更新版本（与 xinbot 要求一致）。

## 2. 下载

从 [**Releases**](https://github.com/huangdihd/MovementSync/releases) 页面获取最新构建：

- 下载 <LatestVersion type="jar" fallback="MovementSync-[版本号].jar" />。

::: tip 从源码构建
你也可以使用 Maven 自行构建：

```bash
git clone https://github.com/huangdihd/MovementSync.git
cd MovementSync
mvn clean package
```

打包后的 shaded JAR 会生成在 `target/` 目录中。
:::

## 3. 安装

1. 将下载好的 `MovementSync-[版本号].jar` 复制到 xinbot 的**插件目录**（即 xinbot `config.conf` 中 `plugin.directory` 设置的文件夹，默认为 `plugin`）。
2. **启动** xinbot，MovementSync 会自动加载。

加载成功时你会看到类似的日志：

```
[MovementSync] MovementSync is loading...
```

## 4. 第一步

当机器人连接到服务器后，试试这些命令：

```text
whereami          # 打印当前位置和朝向
goto 100 64 -200  # 寻路至指定坐标
debug             # 查看当前移动状态
stop              # 取消一切
```

完整列表见 [**命令列表**](./commands) 页面；如果你想从自己的插件代码中驱动 MovementSync，请阅读 [**开发者参考**](/zh/reference/)。

## 5. 作为依赖引入（JitPack）

MovementSync 已发布到 [JitPack](https://jitpack.io/#huangdihd/MovementSync)，其他插件可以依赖它的 API：

```xml
<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependency>
  <groupId>com.github.huangdihd</groupId>
  <artifactId>MovementSync</artifactId>
  <version>[版本号]</version>
</dependency>
```
