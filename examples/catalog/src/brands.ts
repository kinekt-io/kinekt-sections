// Catalogue preview brands. Every `src/brands/*.css` file is a customer token
// stylesheet (`:root { … }`) and becomes a brand option named after its file.
const files = import.meta.glob('./brands/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export interface CatalogueBrand {
  id: string
  label: string
  css: string
}

export const brands: CatalogueBrand[] = Object.entries(files)
  .map(([path, css]) => {
    const id = path.split('/').pop()!.replace(/\.css$/, '')
    const label = id.split(/[-_]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    return { id, label, css }
  })
  .sort((a, b) => a.label.localeCompare(b.label))
