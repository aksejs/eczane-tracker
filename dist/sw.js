if (!self.define) {
  let e,
    s = {}
  const i = (i, n) => (
    (i = new URL(i + '.js', n).href),
    s[i] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = i), (e.onload = s), document.head.appendChild(e)
        } else (e = i), importScripts(i), s()
      }).then(() => {
        let e = s[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (n, r) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[t]) return
    let o = {}
    const l = (e) => i(e, t),
      c = { module: { uri: t }, exports: o, require: l }
    s[t] = Promise.all(n.map((e) => c[e] || l(e))).then((e) => (r(...e), o))
  }
}
define(['./workbox-3625d7b0'], function (e) {
  'use strict'
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: 'assets/index-a0e6f6ca.css', revision: null },
        { url: 'assets/index-ba3591a8.js', revision: null },
        { url: 'index.html', revision: '7f56820cb5734120a305fe045f842454' },
        { url: 'registerSW.js', revision: '1872c500de691dce40960bb85481de07' },
        {
          url: 'manifest.webmanifest',
          revision: '5c55f282eb99ac7d89d3652973a125f8',
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL('index.html'))
    )
})
