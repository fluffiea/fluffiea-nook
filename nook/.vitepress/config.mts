import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/fluffiea-nook/',
  title: "Fluffiea Nook",
  description: "A nook for Fluffiea",
  themeConfig: {
    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/notes/git-commit-lint' }
    ],

    // 侧边栏
    sidebar: {
      // 笔记界面
      '/notes/': [
        {
          text: 'Notes',
          items: [
            { text: 'Git 提交规范配置指南', link: '/notes/git-commit-lint'},
            { text: '一些工具的使用记录', link: '/notes/tools-use'},
          ],
        },
      ],
    },

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
