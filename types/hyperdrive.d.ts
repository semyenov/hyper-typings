declare module 'hyperdrive' {
  import Corestore from 'corestore';
  import Hyperblobs from 'hyperblobs';
  import Hyperbee from 'hyperbee';
  import Hypercore from 'hypercore';
  import ReadyResource from 'ready-resource';

  interface HyperdriveOptions {
    onwait?: (event: HyperdriveWatchEvent) => void;
    encryptionKey?: string;
    compat?: boolean;
  }

  interface HyperdriveEntry {
    seq: number;
    key: string;
    value: {
      executable: boolean;
      linkname: string | null;
      blob: {
        blockOffset: number;
        blockLength: number;
        byteOffset: number;
        byteLength: number;
      };
      metadata: any | null;
    };
  }

  interface HyperdriveGetOptions {
    follow?: boolean;
    wait?: boolean;
    timeout?: number;
  }

  interface HyperdriveEntryOptions extends HyperdriveGetOptions { }

  interface HyperdriveComparisonResult {
    0: 0;
    1: 1;
    '-1': -1;
  }

  interface HyperdriveWatchEvent {
    current: HyperdriveEntry;
    previous: HyperdriveEntry;
  }

  interface HyperdriveWatchOptions {
    folder?: string;
  }

  interface HyperdriveCreateReadStreamOptions {
    start?: number;
    end?: number;
    length?: number;
    wait?: boolean;
    timeout?: number;
  }

  interface HyperdriveCreateWriteStreamOptions {
    executable?: boolean;
    metadata?: any;
  }

  interface HyperdriveDownloadOptions extends HyperdriveGetOptions {
    folder: string;
  }

  interface HyperdriveDownloadDiffOptions extends HyperdriveGetOptions {
    folder: string;
  }

  interface HyperdriveDownloadRangeOptions {
    dbRanges: any[];
    blobRanges: any[];
  }

  interface HyperdriveUpdateOptions {
    wait?: boolean;
  }

  export default class Hyperdrive extends ReadyResource {
    constructor(corestore: Corestore, options?: HyperdriveOptions);
    constructor(corestore: Corestore, key?: string, options?: HyperdriveOptions);

    readonly corestore: Corestore;
    readonly db: Hyperbee;
    readonly core: Hypercore;
    readonly id: string;
    readonly key: string;
    readonly writable: boolean;
    readonly readable: boolean;
    readonly discoveryKey: string;
    readonly contentKey: string;
    readonly version: number;
    readonly supportsMetadata: boolean;

    ready(): Promise<void>;
    close(): Promise<void>;
    put(path: string, buffer: Buffer, options?: HyperdriveCreateWriteStreamOptions): Promise<void>;
    get(path: string, options?: HyperdriveGetOptions): Promise<Buffer | null>;
    entry(path: string, options?: HyperdriveEntryOptions): Promise<HyperdriveEntry | null>;
    exists(path: string): Promise<boolean>;
    del(path: string): Promise<void>;
    compare(entryA: HyperdriveEntry, entryB: HyperdriveEntry): HyperdriveComparisonResult;
    clear(path: string, options?: { recursive?: boolean }): Promise<boolean>;
    clearAll(options?: { recursive?: boolean }): Promise<boolean>;
    purge(): Promise<void>;
    symlink(path: string, linkname: string): Promise<void>;
    batch(): { flush(): Promise<void> };
    list(folder: string, options?: HyperdriveGetOptions): AsyncIterable<HyperdriveEntry>;
    readdir(folder: string): AsyncIterable<string>;
    entries(range?: any, options?: any): AsyncIterable<HyperdriveEntry>;
    mirror(out: Hyperdrive, options?: any): { done(): Promise<void> };
    watch(folder?: string): AsyncIterable<HyperdriveWatchEvent>;
    createReadStream(path: string, options?: HyperdriveCreateReadStreamOptions): NodeJS.ReadableStream;
    createWriteStream(path: string, options?: HyperdriveCreateWriteStreamOptions): NodeJS.WritableStream;
    download(folder: string, options?: HyperdriveDownloadOptions): Promise<void>;
    checkout(version: number): Hyperdrive;
    diff(version: number, folder: string, options?: HyperdriveGetOptions): AsyncIterable<{ left: HyperdriveEntry | null, right: HyperdriveEntry | null }>;
    downloadDiff(version: number, folder: string, options?: HyperdriveDownloadDiffOptions): Promise<void>;
    downloadRange(options: HyperdriveDownloadRangeOptions): Promise<void>;
    findingPeers(): () => void;
    replicate(isInitiatorOrStream: boolean | NodeJS.ReadWriteStream): NodeJS.ReadWriteStream;
    update(options?: HyperdriveUpdateOptions): Promise<boolean>;
    getBlobs(): Promise<Hyperblobs>;
  }
}
