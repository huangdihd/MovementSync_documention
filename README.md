# MovementSync Documentation

The official documentation for **[MovementSync](https://github.com/huangdihd/MovementSync)** — a [xinbot](https://github.com/huangdihd/xinbot) plugin for bot movement, pathfinding and terrain interaction.

Built with [VitePress](https://vitepress.dev/).

## 📖 Live Site

The live documentation is available at: **[https://sync.shouldbe.top](https://sync.shouldbe.top)**

## 🛠 Project Structure

- `docs/` — documentation source.
  - `guide/` — user guide (getting started, commands, FAQ).
  - `reference/` — developer/API reference.
  - `zh/` — Simplified Chinese translation.
  - `.vitepress/` — VitePress config and theme.
  - `public/data/version.json` — latest release info used by the `LatestVersion` component.

## 🚀 Local Development

Requires [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/huangdihd/MovementSync_documention.git
cd MovementSync_documention
npm install
npm run docs:dev      # http://localhost:5173
npm run docs:build    # production build -> docs/.vitepress/dist
```

## ☁️ Deployment (Cloudflare Pages)

This site is deployed on Cloudflare Pages connected to this GitHub repository.

| Setting | Value |
|---------|-------|
| Build command | `npm run docs:build` |
| Build output directory | `docs/.vitepress/dist` |
| Node version | 18 or newer |

The custom domain `sync.shouldbe.top` is configured in the Cloudflare Pages dashboard.

## 🤝 Contributing

Found a typo or want to improve a guide? Fork the repo and open a Pull Request. For larger changes, open an issue first.

## 📄 License

Released under the **GPL-3.0-or-later** License.

---
Maintained by [huangdihd](https://github.com/huangdihd).
