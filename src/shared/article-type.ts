/** Formats stored article-type values for public-facing labels without changing CMS data. */
export const articleTypeLabel = (value?: string | null): string | undefined => {
  const normalized = value?.trim().replace(/[-_]+/g, ' ')
  return normalized ? `${normalized[0].toUpperCase()}${normalized.slice(1)}` : undefined
}
