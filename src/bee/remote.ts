import Corestore from "corestore";
import Hyperbee from "hyperbee";
import Autobase from "autobase";

import consola from "consola";
import { apply, open } from "./utils";
const logger = consola.withTag("bee");

type Entry<T = any> = {
  value: T;
}

const corestore = new Corestore('./.out/remote-corestore');


const hypercore = corestore.get({
  name: 'hypercore',
});

await hypercore.ready();
// logger.info('info', await hypercore.info());

const hyperbee = new Hyperbee(hypercore, {
  keyEncoding: "utf-8", valueEncoding: "json"
});


// If you own the core
await hyperbee.put<Entry<string>>("key1", { value: "value777" }, {
  cas: (prev, next) => prev.value !== next.value,
});
await hyperbee.del("key1");
await hyperbee.put<Entry<string>>("key3", { value: "valuesss2" });
await hyperbee.put<Entry<string>>("some-key", { value: `some-value-${Math.floor(Math.random() * 100)}` });

// If you want to insert/delete batched values
const batch = hyperbee.batch();
await batch.put<Entry<string>>("key2", { value: "values" });
await batch.flush(); // Execute the batch

// Query the core
const entry = await hyperbee.get<Entry<string>>("key"); // => null or { key, value }


const remoteAutobase = new Autobase(corestore, null, {
  valueEncoding: 'json',
  open,
  apply
});

await remoteAutobase.ready();

export default remoteAutobase

// const localAutobase = new Autobase(corestore, remoteAutobase.key, {
//   valueEncoding: 'json',
//   open,
//   apply
// })


// logger.info("Query the core", entry);

// // Read diffs
// for await (const diff of hyperbee.createDiffStream<Entry<string>>(1)) {
//   logger.info("diffStream:", diff);
// }

// // Read entries
// for await (const entry of hyperbee.createReadStream<Entry<string>>()) {
//   logger.info("readStream", entry);
// }

// // Read entries by range
// for await (const entry of hyperbee.createReadStream<Entry<string>>({ gte: "a", lt: "key3" })) {
//   logger.info("readStreamRange", entry);
// }

// // Get history entries
// for await (const entry of hyperbee.createHistoryStream<Entry<string>>({
//   reverse: true,
//   limit: 10,
// })) {
//   logger.info("historyStream", entry);
// }


// async function sync (a: Hyperbee, b: Hyperbee) {
//   const s1 = a.replicate(true)
//   const s2 = b.replicate(false)

//   s1.on('error', () => {})
//   s2.on('error', () => {})

//   s1.pipe(s2).pipe(s1)

//   await new Promise(r => setImmediate(r))

//   await a.update()
//   await b.update()

//   s1.destroy()
//   s2.destroy()
// }
