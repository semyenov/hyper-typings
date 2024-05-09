import path from "node:path/posix";
import readline from "readline";
import chalk from "chalk";
import b4a from "b4a";

import Hyperswarm from "hyperswarm";
import Corestore from "corestore";
import Hyperbee from "hyperbee";
import Autobase from "autobase";
import Autobee from "./index";
import mutexify from "mutexify/promise";

import consola from "consola";
const logger = consola.withTag("autobee");

const args = process.argv.slice(2);
const storageDir = path.join(".out", args[0] ?? "db");
const bootstrap = args[1];

const lock = mutexify();
const rl = readline.createInterface({
  // terminal: true,
  input: process.stdin,
  output: process.stdout,
  completer: (line: string) => {
    const completions = ["put", "del", "add", "exit"];
    const hits = completions.filter((c) => c.startsWith(line));
    return [hits.length ? hits : completions, line];
  },
});

const store = new Corestore(storageDir);
await store.ready();

const db = new Autobee(store.session(), bootstrap, {
  apply: async (batch: any[], view: Hyperbee, base: Autobase<Hyperbee>) => {
    for (const node of batch) {
      const { type, key, value, opts } = node.value;

      const release = await lock();
      logger.log(chalk.red("Operation"));
      logger.log(chalk.green(b4a.toString(node.from.key, "hex")));
      logger.log(chalk.cyan(JSON.stringify({ type, key, value, opts })));
      logger.log(chalk.gray("-----\n"));
      release();

      switch (type) {
        case "add": {
          const release = await lock();
          logger.log(chalk.green("Adding writer"));
          logger.log(chalk.cyan(key));
          logger.log(chalk.gray("-----\n"));
          release();

          await base.addWriter(b4a.from(key, "hex"), {
            indexer: true,
          });
        }
      }
    }

    await Autobee.apply(batch, view, base);
  },
});
await db.ready();

db.view.core.on(
  "append",
  async () => {
    if (db.view.version === 1) return;

    const release = await lock();
    logger.log(chalk.red("State"));
    for await (
      const node of db.createReadStream<{ key: string; value: any }>()
    ) {
      logger.log(chalk.green(`${node.key}`));
      logger.log(chalk.cyan(JSON.stringify(node.value)));
    }

    logger.log(chalk.gray("-----\n"));
    release();
  },
);

const release = await lock();
logger.log(chalk.magenta("Bootstrap key"));
logger.log(
  bootstrap ? chalk.green(bootstrap) : chalk.green(b4a.toString(db.key, "hex")),
);
logger.log(chalk.gray("-----\n"));
release();

const swarm = new Hyperswarm();
swarm.on("connection", async (connection, peerInfo) => {
  await db.replicate(connection);
  const release = await lock();
  logger.log(chalk.red("Peer"));
  logger.log(chalk.green(b4a.toString(peerInfo.publicKey, "hex")));
  logger.log(chalk.cyan(JSON.stringify(peerInfo)));
  logger.log(chalk.gray("-----\n"));
  release();
});

const discovery = swarm.join(b4a.toBuffer(db.discoveryKey));
await discovery.flushed();

if (db.writable) {
  await db.put(path.join("init", storageDir), {
    writer: b4a.toString(db.local.key, "hex"),
  });
} else {
  const release = await lock();
  logger.log(chalk.red("Add writer"));
  logger.log(chalk.yellow("add " + b4a.toString(db.local.key, "hex")));
  logger.log(chalk.gray("-----\n"));
  release();
}

rl.on("line", async (line) => {
  if (!line) {
    rl.prompt();
    return;
  }

  const [type, key, value, opts] = line.split(" ");

  switch (type) {
    case "put":
      await db.put(key || "default", value || "Hello, world!", opts);
      break;
    case "del":
      await db.del(key || "default", opts);
      break;
    case "add":
      await db.add(key, opts);
      break;
    case "exit":
      rl.close();
      await db.close();
      return process.exit(0);
  }

  rl.prompt(true);
});

rl.prompt(true);
