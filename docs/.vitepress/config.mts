import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "MovementSync",
  description: "A xinbot plugin for bot movement, pathfinding and terrain interaction",
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  // Multi-language configuration
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API Reference', link: '/reference/' }
        ],
        langMenuLabel: 'Change Language',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Commands', link: '/guide/commands' },
                { text: 'FAQ', link: '/guide/faq' }
              ]
            }
          ],
          '/reference/': [
            {
              text: 'Developer Reference',
              items: [
                { text: 'Overview', link: '/reference/' },
                { text: 'MovementController', link: '/reference/movement-controller' },
                { text: 'Pathfinding', link: '/reference/pathfinding' },
                { text: 'World Model', link: '/reference/world' }
              ]
            }
          ]
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: 'API 参考', link: '/zh/reference/' }
        ],
        langMenuLabel: '切换语言',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        sidebar: {
          '/zh/guide/': [
            {
              text: '指南',
              items: [
                { text: '快速开始', link: '/zh/guide/getting-started' },
                { text: '命令列表', link: '/zh/guide/commands' },
                { text: '常见问题', link: '/zh/guide/faq' }
              ]
            }
          ],
          '/zh/reference/': [
            {
              text: '开发者参考',
              items: [
                { text: '总览', link: '/zh/reference/' },
                { text: 'MovementController', link: '/zh/reference/movement-controller' },
                { text: '寻路系统', link: '/zh/reference/pathfinding' },
                { text: '世界模型', link: '/zh/reference/world' }
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/huangdihd/MovementSync' }
    ],
    footer: {
      message: 'Released under the GPL-3.0-or-later License.',
      copyright: 'Copyright © 2024-present huangdihd'
    },
    search: {
      provider: 'local'
    }
  }
})
