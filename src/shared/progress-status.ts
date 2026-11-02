export const progressStatuses = ['delayed', 'done', 'in-progress', 'todo', 'custom', 'canceled'] as const
export type ProgressStatus = (typeof progressStatuses)[number]

export const progressStatusDefinitions = {
  delayed: { label: 'Delayed', icon: 'clock', tone: 'warning' },
  done: { label: 'Done', icon: 'circle-check', tone: 'success' },
  'in-progress': { label: 'In progress', icon: 'arrows-rotate', tone: 'info' },
  todo: { label: 'To do', icon: 'circle', tone: 'neutral' },
  custom: { label: 'Custom', icon: 'circle-question', tone: 'neutral' },
  canceled: { label: 'Canceled', icon: 'ban', tone: 'error' },
} as const satisfies Readonly<Record<ProgressStatus, { label: string; icon: string; tone: string }>>

export const progressCustomTones = ['neutral', 'info', 'success', 'warning', 'error'] as const
export type ProgressCustomTone = (typeof progressCustomTones)[number]
