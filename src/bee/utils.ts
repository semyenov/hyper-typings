import Corestore from "corestore"
import Autobase from "autobase"
import Hypercore from "hypercore"
import b4a from 'b4a'

// // create the view
// export async function open (store: Corestore) {
//   return store.get('view', { valueEncoding: 'binary' })
// }

// // use apply to handle to updates
// export async function apply (batch: any, view: Hypercore, base: Autobase) {
//   for (const { value } of batch) {
//     if (value.add) {
//       const key = Buffer.from(value.add, 'hex')
//       await base.addWriter(key, { indexer: value.indexer })
//       continue
//     }

//     if (view) await view.append(value)
//   }
// }

export function eventFlush () {
  return new Promise(resolve => setImmediate(resolve))
}

export async function replicateAndSync (bases: Autobase[]) {
  const done = replicate(bases)
  await sync(bases)
  await done()
}

export async function sync (bases: Autobase[]) {
  for (const base of bases) {
    await base.update()
  }

  if (bases.length === 1) return

  return new Promise((resolve, reject) => {
    for (const base of bases) {
      base.on('update', check)
      base.on('error', shutdown)
    }

    check()

    async function check () {
      if (!synced(bases)) return
      for (const base of bases) {
        await base.update()
        // TODO: HACk!! remove when autobase is fixed
        base.system.requestWakeup()
      }
      if (!synced(bases)) return
      shutdown()
    }

    function shutdown (err) {
      for (const base of bases) {
        base.off('update', check)
        base.off('error', shutdown)
      }

      if (err) reject(err)
      else resolve()
    }
  })
}

export function synced (bases: Autobase[]) {
  const first = bases[0]
  for (let i = 1; i < bases.length; i++) {
    if (!same(first, bases[i])) return false
  }
  return true
}

export function same (a: Autobase, b: Autobase) {
  if (a.updating || b.updating) return false

  const h1 = a.heads()
  const h2 = b.heads()

  if (h1.length !== h2.length) return false

  for (let i = 0; i < h1.length; i++) {
    const h1i = h1[i]
    const h2i = h2[i]

    if (!b4a.equals(h1i.key, h2i.key)) return false
    if (h1i.length !== h2i.length) return false
  }

  return true
}

export function replicate (bases: Autobase[]) {
  const streams: any[] = []
  const missing = bases.slice()

  while (missing.length) {
    const a = missing.pop() as Autobase

    for (const b of missing) {
      const s1 = a.replicate(true)
      const s2 = b.replicate(false)

      s1.on('error', (err) => {
        if (err.code) console.log('autobase replicate error:', err.stack)
      })
      s2.on('error', (err) => {
        if (err.code) console.log('autobase replicate error:', err.stack)
      })

      s1.pipe(s2).pipe(s1)

      streams.push(s1)
      streams.push(s2)
    }
  }

  return close

  function close () {
    return Promise.all(streams.map(s => {
      s.destroy()
      return new Promise(resolve => s.on('close', resolve))
    }))
  }
}
