# Getting Started

MovementSync is a [xinbot](https://github.com/huangdihd/xinbot) plugin that handles bot **movement**, **pathfinding** and **terrain interaction**. It runs a physics simulation loop, maintains a local view of the world, and exposes commands and an API so your bot can walk, jump, pathfind, dig, place blocks and interact with the world.

## 1. Requirements

- A running [**xinbot**](https://github.com/huangdihd/xinbot) instance (**2.0.0-RELEASE** or newer).
- **Java 17** or newer (same requirement as xinbot).

## 2. Download

Get the latest build from the [**Releases**](https://github.com/huangdihd/MovementSync/releases) page:

- Download <LatestVersion type="jar" fallback="MovementSync-[VERSION].jar" />.

::: tip Build from source
You can also build it yourself with Maven:

```bash
git clone https://github.com/huangdihd/MovementSync.git
cd MovementSync
mvn clean package
```

The shaded JAR will be produced in the `target/` directory.
:::

## 3. Install

1. Copy the downloaded `MovementSync-[VERSION].jar` into your xinbot **plugin** directory (the folder set by `plugin.directory` in xinbot's `config.conf`, `plugin` by default).
2. **Launch** xinbot. MovementSync loads automatically.

When it loads correctly you will see a log line like:

```
[MovementSync] MovementSync is loading...
```

## 4. First Steps

Once your bot has connected to a server, try these in-game/console commands:

```text
whereami          # print current position and rotation
goto 100 64 -200  # pathfind to a coordinate
debug             # inspect the current movement state
stop              # cancel everything
```

See the [**Commands**](./commands) page for the full list, and the
[**Developer Reference**](/reference/) if you want to drive MovementSync from
your own plugin's code.

## 5. As a Dependency (JitPack)

MovementSync is published on [JitPack](https://jitpack.io/#huangdihd/MovementSync), so other plugins can depend on its API:

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
  <version>[VERSION]</version>
</dependency>
```
