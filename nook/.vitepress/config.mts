import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/fluffiea-nook/',
  title: "Fluffiea Nook",
  description: "A nook for Fluffiea",
  head: [['link', { rel: 'icon', href: '/fluffiea-nook/logo.svg' }]],
  themeConfig: {
    // 网站 Logo
    logo: '/logo.svg',

    // 站点标题
    siteTitle: 'Fluffiea Nook',

    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/notes/git-commit-lint' }
    ],

    // 侧边栏
    sidebar: [
      {
        text: '笔记',
        collapsed: false,
        link: '/notes',
        items: [
          { text: 'Git 提交规范配置指南', link: '/notes/git-commit-lint'},
          { text: 'husky', link: '/notes/husky' },
          { text: 'lint-staged', link: '/notes/lint-staged' },
        ],
      },
      {
        text: '工具使用',
        collapsed: false,
        link: '/tools',
        items: [
          { text: 'scoop', link: '/tools/scoop' },
          { text: 'nvm', link: '/tools/nvm' },
          { text: 'uv', link: '/tools/uv' },
        ],
      },
    ],

    // 搜索
    search: {
      provider: 'local'
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fluffiea' }
    ]
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  }
})
