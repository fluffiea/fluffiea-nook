/**
 * 与 vitepress-sidebar 的 removePrefixAfterOrdering + prefixSeparator 行为一致。
 * 例如 `1002-husky` → `husky`，`1001-Git 提交规范` → `Git 提交规范`
 */
export function stripOrderPrefix(title: string, separator = '-'): string {
  const parts = title.split(separator)
  if (parts.length <= 1) return title
  parts.shift()
  return parts.join(separator)
}
