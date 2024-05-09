import Autobase, { AutobaseHandlers } from "autobase"
import b4a from "b4a"
import Corestore from "corestore"
import Hyperbee, { HyperbeeRange } from "hyperbee"

type Op = {
  type: "del" | "put" | "add" | "exit"
  key: string
  value?: any
  opts?: any
}

export default class Autobee extends Autobase<Hyperbee, Op> {
  constructor(...[store, bootstrap, handlers]: [
    Corestore,
    string | Buffer | null,
    AutobaseHandlers<Hyperbee>,
  ]) {
    handlers = {
      apply: Autobee.apply,

      ...handlers,
      valueEncoding: "json",
      open: (store: Corestore) => {
        const core = store.get("autobee")
        return new Hyperbee(core, {
          extension: false,
          valueEncoding: "json",
          keyEncoding: "utf-8",
        })
      },
    }

    super(store, bootstrap, handlers)
  }

  static async apply(
    batch: { value: Op }[],
    view: Hyperbee,
    base: Autobase<Hyperbee, Op>,
  ) {
    await base.ready()
    const b = view.batch({ update: false })

    for (const node of batch) {
      const { type, key, value, opts } = node.value
      console.log(
        "\nCurrent operation\n",
        JSON.stringify(
          {
            type,
            key,
            value,
            opts,
          },
          null,
          2,
        ),
      )

      switch (type) {
        case "put":
          await b.put(key, value, opts)
          break
        case "del":
          await b.del(key, opts)
          break
      }
    }

    await b.flush()
  }

  async put<T = any>(key: string, value: T, opts: any = {}) {
    return this.append({
      type: "put",
      key,
      value,
      opts,
    })
  }

  async del(key: string, opts: any = {}) {
    return this.append({
      type: "del",
      key,
      value: null,
      opts,
    })
  }

  async get<T = any>(key: string, opts: any = {}) {
    return this.view.get<T>(b4a.from(key, "hex"), opts)
  }

  async peek<T = any>(range?: HyperbeeRange, opts: any = {}) {
    return this.view.peek<T>(range, opts)
  }

  createReadStream<T = any>(range?: HyperbeeRange, opts: any = {}) {
    return this.view.createReadStream<T>(range, opts)
  }
}
