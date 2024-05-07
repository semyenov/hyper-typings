declare module 'hyperblobs' {
  import { Readable, Writable } from 'stream'
  import Hypercore from 'hypercore'

  export const DEFAULT_BLOCK_SIZE = 2 ** 16

  export interface HyperblobsOptions {
    blockSize?: number
  }

  export interface BlobId {
    blockOffset: number
    blockLength: number
  }

  export default class Hyperblobs {
    constructor(core: Hypercore, opts?: HyperblobsOptions)

    public readonly core: Hypercore

    get feed(): Hypercore
    get locked(): boolean

    put(blob: Buffer, opts?: { blockSize?: number }): Promise<number>
    get(id: BlobId, opts?: { core?: Hypercore }): Promise<Buffer | null>
    clear(id: BlobId, opts?: { core?: Hypercore }): Promise<void>
    createReadStream(id: BlobId, opts?: { core?: Hypercore }): Readable
    createWriteStream(opts?: { core?: Hypercore }): Writable
  }
}
