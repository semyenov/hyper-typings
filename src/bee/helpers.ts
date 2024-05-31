import ram from 'random-access-memory';
import Corestore from 'corestore';
import * as helpers from './utils';
import same from 'same-data';
import b4a from 'b4a';

declare const global: any;

import Autobase from 'autobase';
const argv: string[] = typeof global.Bare !== 'undefined' ? global.Bare.argv : process.argv;
const encryptionKey: Buffer | undefined = argv.includes('--encrypt-all') ? b4a.alloc(32).fill('autobase-encryption-test') : undefined;

export default {
  createStores,
  createBase,
  create,
  addWriter,
  addWriterAndSync,
  apply,
  confirm,
  printTip,
  compare,
  compareViews,
  encryptionKey,
  ...helpers
};

interface StorageOpts {
  storage?: () => any;
  offset?: number;
}

async function createStores(n: number, opts: StorageOpts = {}): Promise<Corestore[]> {
  const storage = opts.storage || (() => ram.reusable());
  const offset = opts.offset || 0;

  const stores: Corestore[] = [];
  for (let i = offset; i < n + offset; i++) {
    const primaryKey = Buffer.alloc(32, i);
    stores.push(new Corestore(await storage(), { primaryKey, encryptionKey }));
  }


  return stores;
}

async function create(n: number, opts = {}) {
  const stores = await createStores(n, opts);
  const bases = [await createBase(stores[0], null, opts)];

  if (n === 1) return { stores, bases };

  for (let i = 1; i < n; i++) {
    bases.push(await createBase(stores[i], bases[0].local.key, opts));
  }

  return {
    stores,
    bases
  };
}

async function createBase(store: Corestore, key: Buffer | null, opts = {}) {
  const moreOpts = {
    apply,
    open,
    close: undefined,
    valueEncoding: 'binary',
    ackInterval: 0,
    ackThreshold: 0,
    encryptionKey,
    fastForward: false,
    ...opts
  };

  const base = new Autobase(store.session(), key, moreOpts);
  await base.ready();

  return base;
}

function open(store: Corestore) {
  return store.get('view', { valueEncoding: 'binary' });
}

async function addWriter(base: Autobase, add: any, indexer: boolean = true) {
  return base.append({ add: add.local.key.toString('hex'), indexer });
}

function printTip(tip: any[], indexers: any[]): string {
  let string = '```mermaid\n';
  string += 'graph TD;\n';

  for (const node of tip) {
    for (const dep of node.dependencies) {
      if (!tip.includes(dep)) continue;

      let label = node.ref;
      let depLabel = dep.ref;

      if (indexers) {
        const index = indexers.indexOf(node.writer);
        const depIndex = indexers.indexOf(dep.writer);

        if (index !== -1) {
          const char = String.fromCharCode(0x41 + index);
          label = char + ':' + node.length;
        }

        if (depIndex !== -1) {
          const char = String.fromCharCode(0x41 + depIndex);
          depLabel = char + ':' + dep.length;
        }
      }

      string += `  ${labelNonNull(label, node)}-->${labelNonNull(depLabel, dep)};\n`
    }
  }

  string += '```';
  return string;

  function labelNonNull(label: string, node: any): string {
    return label + (node.value !== null ? '*' : '');
  }
}

async function addWriterAndSync(base: Autobase, add: any, indexer: boolean = true, bases: Autobase[] = [base, add]) {
  await addWriter(base, add, indexer);
  await helpers.replicateAndSync(bases);
  await base.ack();
  await helpers.replicateAndSync(bases);
}

async function confirm(bases: Autobase[], options: { majority?: number } = {}) {
  await helpers.replicateAndSync(bases);

  for (let i = 0; i < 2; i++) {
    const writers = bases.filter(b => !!b.localWriter);
    const maj = options.majority || (Math.floor(writers.length / 2) + 1);
    for (let j = 0; j < maj; j++) {
      if (!writers[j].writable) continue;

      await writers[j].append(null);
      await helpers.replicateAndSync(bases);
    }
  }

  await helpers.replicateAndSync(bases);
}

async function compare(a: Autobase, b: Autobase, full: boolean = false) {
  const alen = full ? a.view.length : a.view.indexedLength;
  const blen = full ? b.view.length : b.view.indexedLength;

  if (alen !== blen) throw new Error('Views are different lengths');

  for (let i = 0; i < alen; i++) {
    const left = await a.view.get(i);
    const right = await b.view.get(i);

    if (!same(left, right)) throw new Error('Views differ at block ' + i);
  }
}

async function apply(batch: any[], view: any, base: Autobase) {
  for (const { value } of batch) {
    if (value.add) {
      const key = Buffer.from(value.add, 'hex');
      await base.addWriter(key, { indexer: value.indexer });
      continue;
    }

    if (view) await view.append(value);
  }
}

function compareViews(bases: Autobase[]) {
  const missing = bases.slice() as Autobase[];

  const a = missing.shift();

  for (const b of missing) {
    for (const [name, left] of a?._viewStore.opened) {
      const right = b._viewStore.opened.get(name);
      if (!right) {
        continue;
      }

      if (!b4a.equals(left.key, right.key)) {
        continue;
      }

      if (left.core.indexedLength !== right.core.indexedLength) {
        continue;
      }

      if (!b4a.equals(left.core.treeHash(), right.core.treeHash())) {
        continue;
      }
    }
  }
}
