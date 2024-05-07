
declare module 'hyperbee' {
  import { Duplex, Readable } from 'streamx';
  import ReadyResource from 'ready-resource'

  import Hypercore from 'hypercore';

  export interface HyperbeeOptions {
    keyEncoding?: 'ascii' | 'utf-8' | 'binary';
    valueEncoding?: 'json' | 'utf-8' | 'binary';
  }

  export interface HyperbeeEntry<T = unknown> {
    seq: number;
    key: string;
    value: T;
  }

  export interface HyperbeeRange {
    gt?: string;
    gte?: string;
    lt?: string;
    lte?: string;
  }

  export interface HyperbeeWatcherOptions extends HyperbeeRange {
    keyEncoding?: 'ascii' | 'utf-8' | 'binary';
    valueEncoding?: 'json' | 'utf-8' | 'binary';
  }

  export interface HyperbeeWatcher<T = any> {
    node: HyperbeeEntry<T>;
    on(event: 'update', listener: () => void): this;
    close(): Promise<void>;
  }

  export interface HyperbeeWriteBatch {
    put<T = any>(key: string, value?: any, options?: { cas?(prev: HyperbeeEntry<T>, next: HyperbeeEntry<T>): boolean }): Promise<void>;
    get<T = any>(key: string, options?: { keyEncoding?: string; valueEncoding?: string }): Promise<HyperbeeEntry<T> | null>;
    del<T = any>(key: string, options?: { cas?(prev: HyperbeeEntry<T>): boolean }): Promise<void>;
    flush(): Promise<void>;
    close(): Promise<void>;
    lock(): Promise<void>;
  }

  export default class Hyperbee extends ReadyResource {
    constructor(core: Hypercore, options?: HyperbeeOptions);

    static isHyperbee(core: any, options?: any): Promise<boolean>;

    readonly core: Hypercore;
    readonly version: number;
    readonly id: string;
    readonly key: Buffer;
    readonly discoveryKey: Buffer;
    readonly writable: boolean;
    readonly readable: boolean;

    put<T = any>(key: string, value?: T, options?: { cas?(prev: HyperbeeEntry<T>, next: HyperbeeEntry<T>): boolean }): Promise<void>;
    get<T = any>(key: string, options?: { wait?: boolean; update?: boolean; keyEncoding?: string; valueEncoding?: string }): Promise<HyperbeeEntry<T> | null>;
    del<T = any>(key: string, options?: { cas?(prev: HyperbeeEntry<T>): boolean }): Promise<void>;
    getBySeq<T = any>(seq: number, options?: { keyEncoding?: string; valueEncoding?: string }): Promise<HyperbeeEntry<T> | null>;
    replicate(isInitiatorOrStream: boolean): Duplex;
    batch(): HyperbeeWriteBatch;
    createReadStream<T = any>(range?: HyperbeeRange, options?: { reverse?: boolean; limit?: number }): Readable<HyperbeeEntry<T>>;
    peek<T = any>(range?: HyperbeeRange, options?: { keyEncoding?: string; valueEncoding?: string }): Promise<HyperbeeEntry<T> | null>;
    createHistoryStream<T = any>(options?: { live?: boolean; reverse?: boolean; start?: number; startSeq?: number; end?: number; limit?: number }): Readable<HyperbeeEntry<T>>;
    createDiffStream<T = any>(otherVersion: number, options?: HyperbeeRange & { reverse?: boolean; limit?: number }): Readable<{ left: HyperbeeEntry<T> | null; right: HyperbeeEntry<T> | null }>;
    getAndWatch(key: string, options?: HyperbeeWatcherOptions): Promise<HyperbeeWatcher>;
    watch<T = any>(range?: HyperbeeRange): AsyncIterableIterator<{ current: HyperbeeEntry<T>; previous: HyperbeeEntry<T> | null }>;
    checkout(version: number): Hyperbee;
    snapshot(): Hyperbee;
    sub(prefix: string, options?: { separator?: Buffer; keyEncoding?: string; valueEncoding?: string }): Hyperbee;
    getHeader(options?: any): Promise<any>;
  }
}
