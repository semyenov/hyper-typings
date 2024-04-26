
declare module 'hyperblobs' {
  import type Hypercore from 'hypercore'
  import { Readable, Writable } from 'streamx'

  export interface HyperblobsOptions {
    blockSize?: number
  }

  export interface BlobId {
    blockOffset: number
    blockLength: number
  }

  export const DEFAULT_BLOCK_SIZE = 2 ** 16

  export default class Hyperblobs {
    constructor(public readonly core: Hypercore, opts?: HyperblobsOptions)
    get feed(): Hypercore
    get locked(): boolean
    put(blob: Buffer, opts?: PutOptions): Promise<number>
    get(id: BlobId, opts?: GetOptions): Promise<Buffer | null>
    clear(id: BlobId, opts?: { core?: CoreApi }): Promise<void>
    createReadStream(id: BlobId, opts?: CreateReadStreamOptions): Readable
    createWriteStream(opts?: CreateWriteStreamOptions): Writable
  }

  export interface PutOptions {
    blockSize?: number
  }

  export interface GetOptions {
    core?: Hypercore
  }

  export interface CreateReadStreamOptions {
    core?: Hypercore
  }

  export interface CreateWriteStreamOptions {
    core?: Hypercore
  }
}

