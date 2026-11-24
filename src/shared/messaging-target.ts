export type MessagingPlatform = 'whatsapp' | 'signal'

const platformByHost: Record<string, MessagingPlatform> = {
  'wa.me': 'whatsapp',
  'api.whatsapp.com': 'whatsapp',
  'web.whatsapp.com': 'whatsapp',
  'chat.whatsapp.com': 'whatsapp',
  'signal.me': 'signal',
  'signal.link': 'signal',
  'signal.group': 'signal',
}
/** Identifies official WhatsApp and Signal URL targets without inferring intent from labels or paths. */
export const messagingPlatform = (href: string | undefined): MessagingPlatform | undefined => {
  if (href == null || href === '') return undefined

  let url: URL
  try {
    url = new URL(href)
  } catch {
    return undefined
  }

  if (url.protocol === 'whatsapp:') return 'whatsapp'
  if (url.protocol === 'sgnl:') return 'signal'
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined

  const hostname = url.hostname.startsWith('www.') ? url.hostname.slice(4) : url.hostname
  return Object.hasOwn(platformByHost, hostname) ? platformByHost[hostname] : undefined
}
