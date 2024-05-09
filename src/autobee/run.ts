import path from 'node:path/posix'
import readline from 'readline'
import chalk from 'chalk'
import b4a from 'b4a'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import Hyperbee from 'hyperbee'
import Autobase from 'autobase'
import Autobee from './index'

const args = process.argv.slice(2)

const bootstrap = args[0]
const storageDir = args[1] ?? './storage'

// Setup terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => {
    const completions = ['put', 'del', 'add', 'exit']
    const hits = completions.filter((c) => c.startsWith(line))
    return [hits.length ? hits : completions, line]
  },
})

const store = new Corestore(storageDir)
await store.ready()

const db = new Autobee(store.session(), bootstrap, {
  apply: async (batch: any[], view: Hyperbee, base: Autobase<Hyperbee>) => {    
    for (const node of batch) {
      const { type, key, value, opts } = node.value

      console.log(
        chalk.red('\nWriter key'),
        chalk.green(b4a.toString(node.from.key, 'hex')),
        chalk.cyan(JSON.stringify({ type, key, value, opts })),
      )

      switch (type) {
        case 'add': {
          console.log(chalk.green('\rAdding writer'), chalk.blue(key))
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
  if (db.view.version === 1) return
  
  console.log(chalk.red('\nCurrent db'))
  for await (const node of db.createReadStream<{
    key: string
    value: any
  }>()) {
    console.log(
      chalk.green(`\r${node.key}`),
      chalk.cyan(JSON.stringify(node.value)),
    )
  }
})

console.log(
  chalk.magenta('Bootstrap key'),
  bootstrap 
    ? chalk.green(bootstrap) 
    : chalk.green(b4a.toString(db.key, 'hex')),
)

const swarm = new Hyperswarm()
swarm.on('connection', async (connection, peerInfo) => {
  await db.replicate(connection)
  console.log(
    chalk.red('\nPeer joined'),
    chalk.green(b4a.toString(peerInfo.publicKey, 'hex')),
  )
})

const discovery = swarm.join(b4a.toBuffer(db.discoveryKey))
await discovery.flushed()

if (db.writable) {
  await db.put(path.join('init', storageDir), {
    writer: b4a.toString(db.local.key, 'hex'),
  })
} else {
  console.log(chalk.red('\nAdd a writer with "add <key>"'))
  console.log(chalk.magenta('key'), chalk.yellow(b4a.toString(db.local.key, 'hex')))
}

rl.on('line', async (line) => {
  if (!line) {
    rl.prompt()
    return
  }

  const [type, key, value, opts] = line.split(' ')

  switch (type) {
    case 'put':
      await db.put(key || 'default', value || 'Hello, world!', opts)
      break
    case 'del':
      await db.del(key || 'default', opts)
      break
    case 'add':
      await db.add(key, opts)
      break
    case 'exit':
      rl.close()
      await db.close()
      return process.exit(0)
  }

  rl.prompt()
})

rl.emit('line')
