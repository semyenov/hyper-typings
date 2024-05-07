import DHT from 'hyperdht'

const node = new DHT()

// create a server to listen for secure connections
const server = node.createServer()

server.on('connection', function (socket) {
  // socket is E2E encrypted between you and the other peer
  console.log('Remote public key', socket.remotePublicKey)

  // pipe it somewhere like any duplex stream
  process.stdin.pipe(socket).pipe(process.stdout)
})

// make a ed25519 keypair to listen on
const keyPair = DHT.keyPair()

// this makes the server accept connections on this keypair
await server.listen(keyPair)
