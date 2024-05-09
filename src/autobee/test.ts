import Corestore from 'corestore'
import Hyperswarm from 'hyperswarm'
import Autobee from './index'
import readline from 'readline'
import b4a from 'b4a'
import Hyperbee from 'hyperbee'
import Autobase from 'autobase'

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

const db = new Autobee(store, bootstrap, {
  apply: async (batch: any[], view: Hyperbee, base: Autobase<Hyperbee>) => {
    for (const node of batch) {
      const { type, key } = node.value
      if (type === 'add') {
        console.log('\rAdding writer', key)
        await base.addWriter(b4a.from(key, 'hex'), { indexer: true })
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

  console.log('\rcurrent db key/value pairs')
  for await (const node of db.createReadStream<{
    key: Buffer
    value: any
  }>()) {
    console.log(`\r${node.key}: ${JSON.stringify(node.value)}`)
  }

  rl.prompt()
})

if (!bootstrap) {
  console.log('db.key', b4a.toString(db.local.key, 'hex'))
}

const swarm = new Hyperswarm()
swarm.on('connection', (connection, peerInfo) => {
  console.log('\rpeer joined', b4a.toString(peerInfo.publicKey, 'hex'))

  rl.prompt()
  db.store.replicate(connection)
})

const discovery = swarm.join(b4a.toBuffer(db.discoveryKey), {})
await discovery.flushed()

rl.pause()
console.log('putting a key')

const simplePut = async (db: Autobee, key: string = 'test/default') => {
  console.log('writer', b4a.toString(db.local.key, 'hex'))
  await db.put(key, {
    message: 'was here',
    timestamp: new Date().toISOString(),
  })
}
if (db.writable) {
  await simplePut(db)
} else {
  console.log('db isnt writable yet')
  console.log('have another writer add the following key')
  console.log('key', b4a.toString(db.local.key, 'hex'))
}

console.log(`\rEnter db.keys to add as a writer.
Otherwise enter 'exit' to exit.`)
rl.on('line', async (line) => {
  if (!line) {
    rl.prompt()
    return
  }

  const [command, key] = line.split(' ')
  switch (command) {
    case 'exit':
      rl.close()
      await db.close()
      await store.close()
      return process.exit(0)
    case 'put':
      await simplePut(db, key)
      break
    case 'del':
      await db.del(key)
      break
    case 'add':
      await addWriter(db, key)
      break
  }

  rl.prompt()
})

rl.prompt()
