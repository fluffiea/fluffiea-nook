import type MarkdownIt from 'markdown-it'
import type { PluginSimple } from 'markdown-it'
import { stripOrderPrefix } from '../utils/stripOrderPrefix'

export interface InlineTitleOptions {
  /** 与 sidebarOptions.prefixSeparator 保持一致 */
  prefixSeparator?: string
}

function titleFromPath(relativePath?: string, prefixSeparator = '-'): string | undefined {
  if (!relativePath?.endsWith('.md')) return undefined
  if (relativePath.endsWith('/index.md') || relativePath === 'index.md') return undefined

  const filename = relativePath.split('/').pop() ?? ''
  const name = filename.slice(0, -3)
  if (!name) return undefined

  return stripOrderPrefix(name, prefixSeparator)
}

function createH1Tokens(state: MarkdownIt.State.Core, title: string) {
  const h1Open = new state.Token('heading_open', 'h1', 1)
  const h1Inline = new state.Token('inline', '', 0)
  h1Inline.content = title
  const textToken = new state.Token('text', '', 0)
  textToken.content = title
  h1Inline.children = [textToken]
  const h1Close = new state.Token('heading_close', 'h1', -1)
  return [h1Open, h1Inline, h1Close]
}

/**
 * Obsidian「Show inline title」：无 # h1 时，按 frontmatter title → 文件名注入页面顶部标题。
 */
export const inlineTitlePlugin: PluginSimple = (md, options: InlineTitleOptions = {}) => {
  const prefixSeparator = options.prefixSeparator ?? '-'

  md.core.ruler.after('inline', 'inline-title', (state) => {
    const hasH1 = state.tokens.some(
      (token) => token.type === 'heading_open' && token.tag === 'h1',
    )
    if (hasH1) return

    const frontmatterTitle = state.env.frontmatter?.title as string | undefined
    const title =
      frontmatterTitle ??
      titleFromPath(state.env.relativePath as string | undefined, prefixSeparator)
    if (!title) return

    state.tokens.unshift(...createH1Tokens(state, title))
  })
}
