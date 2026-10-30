import { fass } from '@fortawesome/sharp-solid-svg-icons'

export interface CtaIconPath {
  viewBox: string
  path: string
}

const definitionFor = (value: unknown) => {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return undefined
  const key = `fa${value.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}` as keyof typeof fass
  return fass[key]
}

/** Resolves any installed Font Awesome Sharp Solid kebab-case name, including its aliases. */
export const ctaIconPaths = (value: unknown): CtaIconPath | undefined => {
  const definition = definitionFor(value)
  return definition
    ? { viewBox: `0 0 ${definition.icon[0]} ${definition.icon[1]}`, path: definition.icon[4] as string }
    : undefined
}

export const isCtaIcon = (value: unknown): value is string => Boolean(definitionFor(value))
