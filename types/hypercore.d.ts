


declare module 'hypercore' {
  import { EventEmitter } from 'node:events';
  import { Readable, Writable, Duplex } from 'streamx';
  import RandomAccessStorage from 'random-access-storage';
  import ReadyResource from 'ready-resource'

  export interface HypercoreOptions {
    createIfMissing?: boolean;
    overwrite?: boolean;
    valueEncoding?: 'json' | 'utf-8' | 'binary';
    sparse?: boolean;
    secretKey?: Buffer;
    storeSecretKey?: boolean;
    storageCacheSize?: number;
    onwrite?(index: number, data: Buffer, peer: string, cb: () => void): void;
  }

  export interface HypercoreGetOptions {
    wait?: boolean;
    timeout?: number;
    valueEncoding?: 'json' | 'utf-8' | 'binary';
  }

  export interface HypercoreDownloadRange {
    start: number;
    end?: number;
    linear?: boolean;
  }

  export interface HypercoreSignatureIndex {
    index?: number,
    signature?: Buffer
  }

  export interface HypercoreNode {
    index: number;
    size: number;
    hash: Buffer;
  }

  export interface HypercoreStreamOptions {
    start?: number;
    end?: number;
    snapshot?: boolean;
    tail?: boolean;
    live?: boolean;
    timeout?: number;
    wait?: boolean;
  }

  export interface HypercoreReplicateOptions {
    live?: boolean;
    download?: boolean;
    encrypt?: boolean;
  }

  export default class Hypercore<T = any> extends ReadyResource {
    constructor(storage: ((filename: string) => RandomAccessStorage) | string, key?: Buffer | string, options?: HypercoreOptions);

    writable: boolean;
    readable: boolean;
    key: Buffer;
    discoveryKey: Buffer | null;
    length: number;

    get(index: number, options: HypercoreGetOptions): Promise<T>;
    get(index: number): Promise<T>;
    head(options: HypercoreGetOptions): Promise<T>;
    head(): Promise<T>;
    download(range: HypercoreDownloadRange): Download;
    undownload(range: HypercoreDownloadRange): void;
    signature(index: number): Promise<HypercoreSignatureIndex>;
    verify(index: number, signature: Buffer): Promise<boolean>;
    rootHashes(index: number): Promise<HypercoreNode[]>;
    downloaded(start: number, end: number): number;
    has(start: number, end: number): boolean;
    append(data: T): Promise<number>;
    clear(start: number, end: number): Promise<void>;
    seek(byteOffset: number): Promise<[number, number]>;
    update(opts?: { minLength?: number }): Promise<void>;
    createReadStream(options?: HypercoreStreamOptions): Readable;
    createWriteStream(): Writable;
    replicate(options?: HypercoreReplicateOptions): Duplex;
    close(): Promise<void>;

    on(event: "peer-add" | "peer-remove" | "manifest" | "truncate" | "verification-error", listener: () => void): this;
    once(event: "peer-add" | "peer-remove" | "manifest" | "truncate" | "verification-error", listener: () => void): this;
  }
}
