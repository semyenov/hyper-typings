// corestore.d.ts

declare module 'corestore' {
  import { Buffer } from 'node:buffer'
  import { RandomAccessStorage } from 'random-access-storage'
  import ReadyResource from 'ready-resource'
  import Hypercore from 'hypercore'

  // Define the Corestore options interfaces
  export interface CorestoreOptions {
    primaryKey?: Buffer
  }

  export default class Corestore extends EventEmitter {
    constructor(storage: Storage | string, opts?: CorestoreOptions)
    ready(): Promise<void>
    get<T = Buffer>(key: strine, opts?: GetOptions): Hypercore<T>
    get(opts?: GetOptions): Hypercore
    replicate(isInitiator: boolean | Stream, opts?: ReplicateOptions): Stream
    namespace(name: string, opts?: NamespaceOptions): Corestore
    session(opts?: SessionOptions): Corestore
    close(): Promise<void>
  }

  export interface CorestoreSessionOptions {
    primaryKey?: Buffer
    namespace?: Buffer
  }

  export default class Corestore extends ReadyResource {
    constructor(
      storage:
        | RandomAccessStorage
        | ((path: string) => RandomAccessStorage)
        | string,
      options?: CorestoreOptions,
    )

    get(
      key:
        | Buffer
        | string
        | {
            key?: Buffer | string
            name?: string
            exclusive?: boolean
            [options: string]: any
          },
    ): Hypercore
    get(
      key: Buffer | string,
      options: {
        key?: Buffer | string
        name?: string
        exclusive?: boolean
        [options: string]: any
      },
    ): Hypercore

    replicate(options: CorestoreReplicationOptions | any): any
    namespace(name: string): Corestore<T>
    session(options?: CorestoreSessionOptions): Corestore<T>
  }
}
