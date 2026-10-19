import EmblaCarousel from 'embla-carousel'

interface PagefindData {
  url: string
  excerpt?: string
  plain_excerpt?: string
  meta?: Record<string, string>
}

interface PagefindResult {
  data: () => Promise<PagefindData>
}

interface PagefindModule {
  init: () => Promise<void> | void
  search: (query: string | null, options?: { filters?: Record<string, unknown> }) => Promise<{ results: PagefindResult[] }>
}

const pagefindModules = new Map<string, Promise<PagefindModule>>()

function once(element: Element, name: string) {
  const attribute = `data-kinekt-${name}-initialized`
  if (element.hasAttribute(attribute)) return false
  element.setAttribute(attribute, '')
  return true
}

function initializeDisclosureGroup(group: Element) {
  if (!once(group, 'disclosure-group')) return
  group.addEventListener('toggle', (event) => {
    const target = event.target
    if (!(target instanceof HTMLDetailsElement) || !target.open) return
    group.querySelectorAll<HTMLDetailsElement>('details[data-kinekt-disclosure][open]').forEach((details) => {
      if (details !== target) details.open = false
    })
  }, true)
}

function initializeTabs(tabsRoot: Element) {
  if (!once(tabsRoot, 'tabs')) return
  const tabs = Array.from(tabsRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
  const panels = Array.from(tabsRoot.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
  if (!tabs.length || tabs.length !== panels.length) return

  const activate = (index: number, focus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index
      tab.setAttribute('aria-selected', String(active))
      tab.tabIndex = active ? 0 : -1
      panels[tabIndex].hidden = !active
    })
    if (focus) tabs[index].focus()
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index))
    tab.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1
          : 0
      if (event.key === 'Home') {
        event.preventDefault()
        activate(0, true)
      } else if (event.key === 'End') {
        event.preventDefault()
        activate(tabs.length - 1, true)
      } else if (direction) {
        event.preventDefault()
        activate((index + direction + tabs.length) % tabs.length, true)
      }
    })
  })
}

async function initializeCarousel(carousel: Element) {
  if (!once(carousel, 'carousel')) return
  const viewport = carousel.querySelector<HTMLElement>('[data-kinekt-carousel-viewport]')
  const previous = carousel.querySelector<HTMLButtonElement>('[data-kinekt-carousel-previous]')
  const next = carousel.querySelector<HTMLButtonElement>('[data-kinekt-carousel-next]')
  const current = carousel.querySelector<HTMLElement>('[data-kinekt-carousel-current]')
  const total = carousel.querySelector<HTMLElement>('[data-kinekt-carousel-total]')
  const status = carousel.querySelector<HTMLElement>('[data-kinekt-carousel-status]')
  const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-kinekt-carousel-dot]'))
  if (!viewport || !next || !current || !total || !status) return

  const listeners = new AbortController()
  const loop = carousel.getAttribute('data-kinekt-carousel-loop') === 'true'
  const api = EmblaCarousel(viewport, loop ? { align: 'start', loop: true } : { align: 'start', containScroll: 'trimSnaps' })
  const update = () => {
    const selected = api.selectedScrollSnap()
    const count = api.scrollSnapList().length
    if (previous) previous.disabled = !api.canScrollPrev()
    next.disabled = !api.canScrollNext()
    current.textContent = String(selected + 1)
    total.textContent = String(count)
    dots.forEach((dot, index) => {
      if (index === selected) dot.setAttribute('aria-current', 'true')
      else dot.removeAttribute('aria-current')
    })
    status.textContent = `Slide ${selected + 1} of ${count}`
  }

  previous?.addEventListener('click', () => api.scrollPrev(), { signal: listeners.signal })
  next.addEventListener('click', () => api.scrollNext(), { signal: listeners.signal })
  dots.forEach((dot, index) => dot.addEventListener('click', () => api.scrollTo(index), { signal: listeners.signal }))
  carousel.addEventListener('kinekt:carousel-reinitialize', () => {
    listeners.abort()
    api.destroy()
    carousel.removeAttribute('data-kinekt-carousel-initialized')
    void initializeCarousel(carousel)
  }, { once: true, signal: listeners.signal })
  api.on('select', update).on('reInit', update)
  update()
}

function selectedFacets(grid: Element) {
  return Array.from(grid.querySelectorAll<HTMLSelectElement>('[data-kinekt-search-facet]'))
    .map((control) => ({ name: control.dataset.kinektSearchFacet, value: control.value }))
    .filter((facet): facet is { name: string; value: string } => Boolean(facet.name && facet.value))
}

function updateFallbackGrid(grid: Element) {
  const query = grid.querySelector<HTMLInputElement>('[data-kinekt-search-query]')?.value.trim().toLowerCase() ?? ''
  const facets = selectedFacets(grid)
  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-kinekt-search-item]'))
  let count = 0
  items.forEach((item) => {
    const queryMatches = !query || (item.dataset.kinektSearchText ?? '').includes(query)
    const facetMatches = !facets.length || facets.some(({ name, value }) => {
      const key = `kinektSearch${name[0].toUpperCase()}${name.slice(1)}s`
      const values = (item.dataset[key] ?? item.dataset[`kinektSearch${name[0].toUpperCase()}${name.slice(1)}`] ?? '').split('|')
      return values.includes(value)
    })
    const visible = queryMatches && facetMatches
    item.hidden = !visible
    if (visible) count += 1
  })
  const status = grid.querySelector<HTMLElement>('[data-kinekt-search-status]')
  if (status) status.textContent = `${count} ${count === 1 ? 'result' : 'results'}`
}

function pagefindFilters(grid: Element) {
  const selected = selectedFacets(grid)
  const grouped = selected.reduce<Record<string, string[]>>((filters, { name, value }) => {
    filters[name] = [...(filters[name] ?? []), value]
    return filters
  }, {})
  const selectedFilter = Object.keys(grouped).length ? { any: grouped } : undefined
  const rawBase = grid.getAttribute('data-kinekt-pagefind-filters')
  let base: Record<string, unknown> | undefined
  try {
    base = rawBase ? JSON.parse(rawBase) as Record<string, unknown> : undefined
  } catch {
    base = undefined
  }
  if (!base) return selectedFilter
  if (!selectedFilter) return base
  return { all: [base, selectedFilter] }
}

async function loadPagefind(url: string) {
  let loaded = pagefindModules.get(url)
  if (!loaded) {
    // The Pagefind bundle location is a consumer runtime setting, not a package import.
    loaded = import(/* @vite-ignore */ url) as Promise<PagefindModule>
    pagefindModules.set(url, loaded)
  }
  const pagefind = await loaded
  await pagefind.init()
  return pagefind
}

function renderPagefindResults(grid: Element, results: PagefindData[]) {
  const list = grid.querySelector<HTMLElement>('[data-kinekt-search-results]')
  const status = grid.querySelector<HTMLElement>('[data-kinekt-search-status]')
  if (!list || !status) return
  const cards = results.map((result) => {
    const item = document.createElement('li')
    const article = document.createElement('article')
    const heading = document.createElement('h3')
    const link = document.createElement('a')
    const excerpt = document.createElement('p')
    link.href = result.url
    link.textContent = result.meta?.title || result.url
    heading.append(link)
    excerpt.textContent = result.plain_excerpt ?? result.excerpt?.replace(/<[^>]+>/g, '') ?? ''
    article.append(heading, excerpt)
    item.append(article)
    return item
  })
  list.replaceChildren(...cards)
  status.textContent = `${results.length} ${results.length === 1 ? 'result' : 'results'}`
}

function initializeSearchGrid(grid: Element) {
  if (!once(grid, 'search-grid')) return
  const form = grid.querySelector<HTMLFormElement>('[data-kinekt-search-form]')
  const query = grid.querySelector<HTMLInputElement>('[data-kinekt-search-query]')
  if (!form || !query) return
  const runSearch = async () => {
    try {
      const pagefind = await loadPagefind(grid.getAttribute('data-kinekt-pagefind-url') || '/pagefind/pagefind.js')
      const result = await pagefind.search(query.value.trim() || null, { filters: pagefindFilters(grid) })
      const data = await Promise.all(result.results.slice(0, 4).map((item) => item.data()))
      renderPagefindResults(grid, data)
    } catch {
      updateFallbackGrid(grid)
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    void runSearch()
  })
  query.addEventListener('input', () => updateFallbackGrid(grid))
  grid.querySelectorAll<HTMLSelectElement>('[data-kinekt-search-facet]').forEach((control) => {
    control.addEventListener('change', () => {
      updateFallbackGrid(grid)
      void runSearch()
    })
  })
  query.addEventListener('focus', () => {
    void loadPagefind(grid.getAttribute('data-kinekt-pagefind-url') || '/pagefind/pagefind.js').catch(() => undefined)
  }, { once: true })
  updateFallbackGrid(grid)
}

export function initializeKinektInteractions(root: ParentNode = document) {
  root.querySelectorAll('[data-kinekt-disclosure-group]').forEach(initializeDisclosureGroup)
  root.querySelectorAll('[data-kinekt-tabs]').forEach(initializeTabs)
  root.querySelectorAll('[data-kinekt-carousel]').forEach((carousel) => { void initializeCarousel(carousel) })
  root.querySelectorAll('[data-kinekt-search-grid]').forEach(initializeSearchGrid)
}
