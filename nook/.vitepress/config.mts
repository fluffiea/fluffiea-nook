import { defineConfig, type UserConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { obsidianMarkdownPlugin } from 'vitepress-plugin-obsidian'
import { inlineTitlePlugin } from './plugins/inlineTitle'

/** 与 sidebar 编号前缀剥离规则保持一致 */
const orderPrefixSeparator = '-'

// https://vitepress.dev/reference/site-config
const vitePressConfigs = {
  base: '/nook/',
  title: 'Fluffiea Nook',
  description: 'A nook for Fluffiea',
  head: [['link', { rel: 'icon', href: '/nook/logo.svg' }]] as const,
  themeConfig: {
    // 网站 Logo
    logo: '/logo.svg',

    // 站点标题
    siteTitle: 'Fluffiea Nook',

    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/1000-零碎/' },
    ],

    // 搜索
    search: {
      provider: 'local',
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fluffiea' },
    ],
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(obsidianMarkdownPlugin, {
        wikiLink: true,
        embedLink: true,
        callout: true,
        comment: true,
      })
      md.use(inlineTitlePlugin, { prefixSeparator: orderPrefixSeparator })
    },
  },
} satisfies UserConfig

// 侧边栏（由 vitepress-sidebar 自动生成）
const sidebarOptions = {
  documentRootPath: '/nook/',
  excludeByGlobPattern: ['index.md', 'description.md', '.obsidian/**'],
  useTitleFromFrontmatter: true,
  useTitleFromFileHeading: false,
  collapsed: true,
  capitalizeFirst: false,
  hyphenToSpace: false,
  sortMenusOrderNumericallyFromTitle: true,
  removePrefixAfterOrdering: true,
  prefixSeparator: orderPrefixSeparator,
}

export default defineConfig(withSidebar(vitePressConfigs, sidebarOptions))
