// corestore.d.ts

declare module 'corestore' {
  import { EventEmitter } from 'events';
  import Hypercore from 'hypercore';

  export default class Corestore extends EventEmitter {
    constructor(storage: Storage, opts?: CorestoreOptions);
    ready(): Promise<void>;
    get(opts?: GetOptions): Hypercore;
    replicate(isInitiator: boolean | Stream, opts?: ReplicateOptions): Stream;
    namespace(name: string, opts?: NamespaceOptions): Corestore;
    session(opts?: SessionOptions): Corestore;
    close(): Promise<void>;
  }

  export interface CorestoreOptions {
    cache?: boolean;
    primaryKey?: Buffer;
    passive?: boolean;
    manifestVersion?: number;
    compat?: boolean;
    inflightRange?: number;
  }

  export interface GetOptions {
    key?: Buffer;
    name?: string;
    secretKey?: Buffer;
    publicKey?: Buffer;
    manifest?: any;
    preload?: () => Promise<any>;
    cache?: boolean;
    writable?: boolean;
    exclusive?: boolean;
    isBlockKey?: boolean;
    createIfMissing?: boolean;
  }

  export interface ReplicateOptions {
    live?: boolean;
    download?: boolean;
    upload?: boolean;
    encrypt?: boolean;
    ondiscoverykey?: (discoveryKey: Buffer) => void;
  }

  export interface NamespaceOptions {
    namespace?: Buffer;
    cache?: boolean;
    writable?: boolean;
    inflightRange?: number;
  }

  export interface SessionOptions extends NamespaceOptions {
    detach?: boolean;
  }

  export type Storage = ((path: string) => any) | string | Hypercore;
  export type Stream = any; // This should be replaced with the actual type of the stream
}