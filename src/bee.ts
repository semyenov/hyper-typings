import Hypercore from "hypercore";
import Hyperbee from "hyperbee";

import consola from "consola";
const logger = consola.withTag("bee");

const hypercore = new Hypercore('./.out/hypercore');
await hypercore.ready();
// logger.info('info', await hypercore.info());

const hyperbee = new Hyperbee(hypercore, {
  keyEncoding: "utf-8", valueEncoding: "json"
});

const v1 = hyperbee.version;

// If you own the core
await hyperbee.put("key1", { value: "value777" }, {
  cas: (prev, next) => prev.value !== next.value,
});
await hyperbee.del("key1");
await hyperbee.put("key3", { value: "valuesss2" });
await hyperbee.put("some-key", { value: `some-value-${Math.floor(Math.random() * 100)}` });

// If you want to insert/delete batched values
const batch = hyperbee.batch();
await batch.put("key2", { value: "values" });
await batch.flush(); // Execute the batch

// Query the core
const entry = await hyperbee.get("key"); // => null or { key, value }
logger.info("Query the core", entry);

// Read diffs
for await (const diff of hyperbee.createDiffStream(v1)) {
  logger.info("diffStream:", diff);
}

// Read entries
for await (const entry of hyperbee.createReadStream()) {
  logger.info("readStream", entry);
}

// Read entries by range
for await (const entry of hyperbee.createReadStream({ gte: "a", lt: "key3" })) {
  logger.info("readStreamRange", entry);
}

// Get history entries
for await (const entry of hyperbee.createHistoryStream({
  reverse: true,
  limit: 10,
})) {
  logger.info("historyStream", entry);
}
