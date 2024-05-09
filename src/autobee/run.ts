import b4a from 'b4a'
import readline from 'readline'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import Hyperbee from 'hyperbee'
import Autobase from 'autobase'
import Autobee from './index'

const args = process.argv.slice(2)
const storageDir = args[1] ?? './storage'

async function addWriter(db: Autobee, key: string) {
  await db.append({
    type: 'add',
    key,
  })

  await db.update({ wait: false })
}

// Setup terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const store = new Corestore(storageDir)
await store.ready()

const bootstrap = args[0]
console.log('bootstrap', bootstrap)

const db = new Autobee(store.session(), bootstrap, {
  apply: async (batch: any[], view: Hyperbee, base: Autobase<Hyperbee>) => {
    for (const node of batch) {
      const { type, key, value, opts } = node.value

      switch (type) {
        case 'add': {
          console.log('\rAdding writer', key)
          await base.addWriter(b4a.from(key, 'hex'), {
            indexer: true,
          })
        }
      }
    }

    await Autobee.apply(batch, view, base)
  },
})
await db.ready()

db.view.core.on('append', async () => {
  // Skip append event for hyperbee's header block
  if (db.view.version === 1) return
  rl.pause()

  console.log('\nCurrent db key/value pairs')
  for await (const node of db.createReadStream<{
    key: Buffer
    value: any
  }>()) {
    console.log(`\r${node.key}`, JSON.stringify(node.value))
  }

  rl.prompt()
})

if (!bootstrap) {
  console.log('db.key', b4a.toString(db.local.key, 'hex'))
}

const swarm = new Hyperswarm()
swarm.on('connection', (connection, peerInfo) => {
  rl.pause()
  db.replicate(connection)
  console.log('\nPeer joined', b4a.toString(peerInfo.publicKey, 'hex'))

  rl.prompt()
})

const discovery = swarm.join(b4a.toBuffer(db.discoveryKey))
await discovery.flushed()

if (db.writable) {
  await db.put('init/' + b4a.toString(db.key, 'hex'), {
    writer: b4a.toString(db.local.key, 'hex'),
  })
} else {
  console.log('\nDB isnt writable yet')
  console.log('have another writer add the following key')
  console.log('key', b4a.toString(db.local.key, 'hex'))
}

console.log(`\nEnter "add <key>" to add a hypercore writer.
Otherwise enter 'exit' to exit.`)

rl.on('line', async (line) => {
  rl.pause()

  if (!line) {
    rl.prompt()
    return
  }

  const [type, key, value, opts]: string[] = line.split(' ')
  switch (type) {
    case 'put':
      await db.put(key || 'test/default', value || 'hello', opts)
      break
    case 'del':
      await db.del(key || 'test/default', opts)
      break
    case 'add':
      await addWriter(db, key)
      break
    case 'exit':
      rl.close()
      await db.close()
      await store.close()
      return process.exit(0)
  }

  rl.prompt()
})

rl.prompt()
