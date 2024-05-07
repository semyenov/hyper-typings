import crypto from 'hypercore-crypto'
import { Workspace } from './hsfw/index'
import Corestore from 'corestore'

import consola from 'consola'
const logger = consola.withTag('hsfw')

const corestore = new Corestore('./.out/hsfw-corestore')
const mySwarmKeypair = crypto.keyPair()
logger.info(mySwarmKeypair.publicKey.toString('hex'))

const ws = await Workspace.createNew(corestore, mySwarmKeypair)
logger.info(ws.key) // the key that identifies this HSFW
await ws.ready()
// basic file ops
// =

await ws.writeFile('/file.txt', 'Hello, world!')
await ws.statFile('/file.txt') /* => {
  path: '/file.txt',
  timestamp: Date(January 1, 1969),
  bytes: 13,
  writer: Buffer<...>,
  change: 'b3c316fdc136bde5',
  conflict: false,
  noMerge: false
  otherChanges: []
} */
await ws.listFiles() // => [{...}]
logger.info(await ws.readFile('/file.txt', 'utf-8')) // => 'Hello, world!'

await ws.copyFile('/file.txt', '/file2.txt')
await ws.moveFile('/file2.txt', '/file3.txt')
await ws.deleteFile('/file3.txt')

// history
// =

await ws.listHistory()
await ws.listHistory({path: '/directory/*'})
await ws.listHistory({path: '/file.txt'})

// writer management
// =

await ws.listWriters() // fetch and list the current writers
// ws.getWriter(pubkey) 
/* get one of the writers (from the current cache)
=> WorkspaceWriter {
  core: Hypercore
  publicKey: Buffer
  secretKey?: Buffer
  isOwner: boolean
  name: string
  isAdmin: boolean
  isFrozen: boolean
}*/
ws.getOwner() // get the "owner" writer of this HSFW
ws.isOwner // am I the "owner" of this HSFW?
ws.getMyWriter() // get my writer instance, if I am one
ws.writable // am I a writer?
ws.isAdmin // am I an admin writer? (able to change other writers)
// await ws.putWriter(key, {name: 'Bob', admin: false}) // create/update a writer

const invite = await ws.createInvite('Bob') // create a writer invite
await ws.useInvite(invite) // use the invite to become a writer

