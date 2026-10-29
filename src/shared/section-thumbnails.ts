const sectionThumbnailBaseURL = 'https://kinekt-io.github.io/kinekt-sections/thumbnails/sections'

/**
 * Resolves the published static 16:10 catalogue thumbnail for a section
 * block. Section slugs are stable editor data, so the resulting URL is
 * stable across consuming projects.
 */
export const sectionThumbnailURL = (slug: string): string | undefined => {
  const section = slug.replace(/^beta-/, '')
  if (section === 'steps-stage') return `${sectionThumbnailBaseURL}/steps/stage.jpeg`

  const match = section.match(/^(.*)-(allentown|trinity|todos-santos)$/)
  return match ? `${sectionThumbnailBaseURL}/${match[1]}/${match[2]}.jpeg` : undefined
}
