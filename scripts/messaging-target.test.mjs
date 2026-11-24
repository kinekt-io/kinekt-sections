import assert from 'node:assert/strict'
import test from 'node:test'
import { messagingPlatform } from '../dist/shared/messaging-target.js'

test('messaging targets identify official WhatsApp and Signal URLs with queries and fragments', () => {
  const targets = {
    'https://wa.me/31612345678?text=Hello%20there#contact': 'whatsapp',
    'https://www.api.whatsapp.com/send?phone=31612345678#message': 'whatsapp',
    'https://web.whatsapp.com/send?text=Hello#conversation': 'whatsapp',
    'https://chat.whatsapp.com/ExampleInvite?ref=site#join': 'whatsapp',
    'whatsapp://send?phone=31612345678&text=Hello': 'whatsapp',
    'whatsapp:send?phone=31612345678': 'whatsapp',
    'https://signal.me/#eu/Example?source=site': 'signal',
    'https://www.signal.link/example?ref=site#message': 'signal',
    'https://signal.group/#Example?source=site': 'signal',
    'sgnl://signal.me/#p/Example': 'signal',
    'sgnl:signal.me/#p/Example': 'signal',
  }

  for (const [href, platform] of Object.entries(targets)) {
    assert.equal(messagingPlatform(href), platform, href)
  }
})

test('messaging targets reject lookalikes, unsupported schemes, and host names mentioned only in paths', () => {
  for (const href of [
    undefined,
    '',
    '/contact/wa.me',
    'https://example.com/wa.me?next=signal.me',
    'https://wa.me.example.com/send',
    'https://notwa.me/send',
    'https://www.notwa.me/send',
    'https://signal.me.example.com/invite',
    'https://signal-messenger.example.com/',
    'https://constructor/',
    'https://www.constructor/',
    'https://__proto__/',
    'mailto:wa.me@example.com',
    'ftp://signal.me/invite',
    'whatsappish://send?phone=31612345678',
    'sgnl-app://signal.me/#p/Example',
  ]) {
    assert.equal(messagingPlatform(href), undefined, href)
  }
})
