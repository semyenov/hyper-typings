import { Buffer } from 'node:buffer'

import Hyperswarm from 'hyperswarm'

import consola from 'consola';
const logger = consola.withTag("swarm");

const swarm1 = new Hyperswarm()
const swarm2 = new Hyperswarm()

swarm1.on('connection', (conn, info) => {
  // logger.log('server got connection:', conn)
  // swarm1 will receive server connections
  conn.write('this is a server connection')
  conn.end()
})

swarm2.on('connection', (conn, info) => {
  conn.on('data', (data: any) => logger.log('client got message:', data.toString()))
})

const topic = Buffer.alloc(32).fill('hello world') // A topic must be 32 bytes
const discovery = swarm1.join(topic, { server: true, client: false })
await discovery.flushed() // Waits for the topic to be fully announced on the DHT

swarm2.join(topic, { server: false, client: true })
await swarm2.flush() // Waits for the swarm to connect to pending peers.