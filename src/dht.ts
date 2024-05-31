import { inspect } from "node:util";
import { createWriteStream } from "node:fs";

import DHT from "hyperdht";
import { setTraceFunction } from "hypertrace";

const logFile = createWriteStream("dht.log");
setTraceFunction((obj: any) => {
  logFile.write(inspect(obj, false, 1, false) + "\n");
});

const config = {
  bootstrap: {
    host: "127.0.0.1",
    port: 49737,
  },
  keys: {
    server: DHT.keyPair(),
    client: DHT.keyPair(),
  },
};
console.log("\n--- " + new Date().toISOString());
console.log("Server public key", config.keys.server.publicKey.toString("hex"));
console.log("Client public key", config.keys.client.publicKey.toString("hex"));

const bootstrapper = DHT.bootstrapper(
  config.bootstrap.port,
  config.bootstrap.host,
);
await bootstrapper.ready();

bootstrapper.on("connection", function (socket) {
  console.log("\n--- " + new Date().toISOString());
  console.log("Remote public key", socket.remotePublicKey);
  console.log("Local public key", socket.publicKey);
});

const node1 = new DHT({
  bootstrap: [`${config.bootstrap.host}:${config.bootstrap.port}`],
  keyPair: config.keys.server,
});
await node1.ready();
await node1.mutablePut(
  config.keys.server,
  Buffer.from("hellohhhhh"),
  { valueEncoding: "binary" },
);

const server = node1.createServer();
server.on("connection", function (socket) {
  console.log("\n--- " + new Date().toISOString());
  console.log("Local public key " + socket.publicKey.toString("hex"));
  console.log("Remote public key" + socket.remotePublicKey.toString("hex"));
});

await server.listen(config.keys.server);
const { port, host, publicKey } = server.address();
console.log("\n--- " + new Date().toISOString());
console.log("Listening on ", {
  port,
  host,
  publicKey: publicKey.toString("hex"),
});

const node2 = new DHT({
  bootstrap: [`${config.bootstrap.host}:${config.bootstrap.port}`],
  keyPair: config.keys.client,
});
await node2.ready();

const socket = node2.connect(config.keys.server.publicKey);
console.log("\n--- " + new Date().toISOString());
console.log("Connected to " + socket.remotePublicKey.toString("hex"));

const { value, from, seq, signature } = await node2.mutableGet(
  config.keys.server.publicKey,
  { latest: true },
);

console.log("\n--- " + new Date().toISOString());
console.log("Call mutableGet", {
  value: value.toString(),
  seq,
  from: {
    id: from.id.toString("hex"),
    host: from.host,
    port: from.port,
    signature: signature.toString("hex"),
  },
});
