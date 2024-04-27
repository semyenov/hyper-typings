declare module 'hypercore' {
  import { Buffer } from 'buffer';
  import { ReadableStream } from 'streamx';
  import Hypercore from 'hypercore';

  type Storage = string | ((filename: string) => any);

  export interface ReadStreamOptions {
    start?: number;
    end?: number;
    snapshot?: boolean;
    live?: boolean;
  }

  export interface HypercoreOptions {
    createIfMissing?: boolean;
    overwrite?: boolean;
    sparse?: boolean;
    valueEncoding?: 'json' | 'utf-8' | 'binary';
    encodeBatch?: (batch: any) => any;
    keyPair?: { publicKey: Buffer, secretKey: Buffer };
    encryptionKey?: string;
    onDownloadWait?: () => void;
    timeout?: number;
    disableAppendOnly?: boolean;
    valueEncoding?: any; // abstract-encoding or compact-encoding instance
  }

  export class ReadStream<T = any> extends ReadableStream<T> {
    constructor(core: Hypercore, opts?: ReadStreamOptions);

    readonly core: Hypercore;
    readonly start: number;
    readonly end: number;
    readonly snapshot: boolean;
    readonly live: boolean;
  }

  export default class Hypercore {
    constructor(storage: Storage, key?: Buffer | string, options?: HypercoreOptions);

    readonly id: string;
    readonly key: Buffer;
    readonly keyPair: { publicKey: Buffer, secretKey: Buffer };
    readonly discoveryKey: Buffer;
    readonly encryptionKey: Buffer | null;
    readonly readable: boolean;
    readonly writable: boolean;
    readonly length: number;
    readonly contiguousLength: number;
    readonly fork: number;
    readonly padding: number;

    append(block: Buffer | Buffer[]): Promise<{ length: number, byteLength: number }>;
    get(index: number, options?: { timeout?: number, wait?: boolean }): Promise<Buffer>;
    has(start: number, end?: number): Promise<boolean>;
    update(options?: { wait?: boolean }): Promise<boolean>;
    seek(byteOffset: number, options?: { wait?: boolean, timeout?: number }): Promise<[number, number]>;
    createReadStream(options?: { start?: number, end?: number, realtime?: boolean, autoEnd?: boolean }): ReadableStream; // Readable Stream
    createByteStream(options?: { byteOffset?: number, byteLength?: number, blocks?: number, linear?: boolean }): ReadableStream; // Readable Stream
    clear(start: number, end?: number, options?: { returned?: boolean }): Promise<void>;
    truncate(newLength: number, forkId?: number): Promise<void>;
    purge(): Promise<void>;
    treeHash(length?: number): Promise<Buffer>;
    download(range?: { start?: number, end?: number, blocks?: number[], linear?: boolean }): { done: () => Promise<void> };
    session(options?: HypercoreOptions): Hypercore;
    info(options?: { getStorageEstimates?: boolean }): Promise<any>;
    close(): Promise<void>;
    ready(): Promise<void>;
    replicate(isInitiator: boolean | any, options?: any): any; // Replication Stream
    findingPeers(): () => void;
  }
}