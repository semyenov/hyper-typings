import Hypercore from "hypercore";
import Hyperbee from "hyperbee";
import consola from "consola";

const logger = consola.withTag("bee");

const hypercore = new Hypercore('./.out/hypercore');
await hypercore.ready();

logger.info('info', await hypercore.info());

const hyperbee = new Hyperbee(hypercore, {
  keyEncoding: "utf-8", valueEncoding: "json"
});

const v1 = hyperbee.version;

// Put values with CAS (if you want to update the value)
await hyperbee.put("key1", { value: "value777" }, {
  cas: (curr, prev) => curr.value !== prev.value,
});

await hyperbee.del("key1");
await hyperbee.put("key3", { value: "valuesss2" });
await hyperbee.put("some-key", { value: `some-value-${Math.floor(Math.random() * 100)}` });

// If you want to insert/delete batched values
const batch = hyperbee.batch();
await batch.put("key2", { value: "values" });
await batch.flush(); // Execute the batch

// Query the core
const entry = await hyperbee.get<{ value: string }>("key3"); // => null or { key, value }
logger.info("Query the key", entry);

const watcher = await hyperbee.getAndWatch<{ value: string }>("key3");
logger.info("watcher", watcher.on("update", () => {
  if (!watcher.node) return;

  logger.info("watcher update", watcher.node);
  logger.info("watcher value", watcher.node.value);
  logger.info("watcher key", watcher.node.key);
}));

// Read diffs
for await (const diff of hyperbee.createDiffStream<{ value: string }>(v1)) {
  logger.info("diffStream:", diff);
}

// Read entries
for await (const entry of hyperbee.createReadStream<{ value: string }>()) {
  logger.info("readStream", entry);
}

for (let i = 0; i < 1000000; i++) {
  logger.info("readStreamRange", entry);
  hyperbee.put("key" + 3, { value: "values" + Math.floor(Math.random() * 100) });
}

// Read entries by range
for await (const entry of hyperbee.createReadStream<{ value: string }>({ gte: "a", lt: "key3" })) {
  logger.info("readStreamRange", entry);
}

// Get history entries
for await (const entry of hyperbee.createHistoryStream<{ value: string }>({
  reverse: true,
  limit: 10,
})) {
  logger.info("historyStream", entry);
}
