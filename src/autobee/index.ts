import b4a from "b4a";
import Hypercore from "hypercore";
import Corestore from "corestore";
import Hyperbee, { HyperbeeRange } from "hyperbee";
import Autobase, { AutobaseHandlers } from "autobase";
import codecs, { Codec } from "codecs";

type AutobeeOp = {
  type: "del" | "put" | "add" | "exit";
  key: string | Buffer;
  value?: any;
  opts?: any;
};

export default class Autobee extends Autobase<Hyperbee, AutobeeOp> {
  private readonly _valueEncoder: Codec;
  private readonly _indexCore: Hypercore<AutobeeOp>;
  constructor(
    store: Corestore,
    bootstrap: Buffer | string | null,
    handlers: AutobaseHandlers = {},
  ) {
    handlers.valueEncoding = handlers.valueEncoding! || "binary";
    const indexCore = store.get<AutobeeOp>({ name: "autobee-index" });
    const open = (store: Corestore) => {
      const core = store.get({ name: "autobase" });
      return new Hyperbee(core, {
        extension: false,
        keyEncoding: "utf-8",
        valueEncoding: handlers.valueEncoding,
      });
    };

    const apply = async (
      nodes: { value: AutobeeOp; from: Hypercore }[],
      view: Hyperbee,
      base: Autobase<Hyperbee, AutobeeOp>,
    ) => {
      const batch = view.batch({ update: false });
      for (const node of nodes) {
        const op = node.value;
        console.log("put", op.key, op.value, op.opts);

        const type = op.type;
        const key = op.key;
        const value = op.value ? b4a.from(op.value, "binary") : undefined;

        switch (type) {
          case "put":
            await batch.put(key, value);
            break;
          case "del":
            await batch.del(key);
            break;
          case "add": {
            await base.addWriter(b4a.from(key), {
              indexer: true,
            });
          }
        }
      }

      await batch.flush();
    };

    super(store, bootstrap, { ...handlers, apply, open });

    this._valueEncoder = codecs[handlers.valueEncoding];
    this._indexCore = indexCore;
  }

  async ready() {
    await super.ready();
    await this._indexCore.ready();
  }

  async add(key: string, opts: any = {}) {
    await this._indexCore.append({
      type: "add",
      key,
      value: null,
      opts,
    });
  }
  async put<T = any>(key: string, value: T, opts: any = {}) {
    return this.append({
      type: "put",
      key,
      value,
      opts,
    });
  }
  async del(key: string, opts: any = {}) {
    return this.append({
      type: "del",
      key,
      opts,
    });
  }
  async get<T = any>(key: string, opts: any = {}) {
    return this.view.get<T>(key, opts);
  }
  async peek<T = any>(range?: HyperbeeRange, opts: any = {}) {
    return this.view.peek<T>(range, opts);
  }

  createReadStream<T = any>(range?: HyperbeeRange, opts: any = {}) {
    return this.view.createReadStream<T>(range, opts);
  }
}
