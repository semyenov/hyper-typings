declare module "autobase" {
  import { EventEmitter } from "events";
  import { Duplex } from "streamx";
  import ReadyResource from "ready-resource";
  import Corestore from "corestore";
  import Hypercore from "hypercore";

  interface KeyPair {
    publicKey: Buffer;
    secretKey: Buffer;
  }

  type SignerType = {
    signature: string;
    length: number;
    signer: number;
  };

  type Checkpoint = {
    length: number;
    signature: string;
  };

  class Signer {
    base: Autobase;
    core: Hypercore;
    opened: boolean;
    checkpoints: Map<string, Checkpoint[]>;

    constructor(base: Base, core: Core);

    sign(indexers: Array<any>, length: number): Promise<any>;
    _verify(
      length: number,
      signature: string,
      key: Uint8Array,
    ): Promise<boolean>;
    open(): boolean;
    addCheckpoint(key: Uint8Array, checkpoint: Checkpoint): void;
    bestCheckpoint(idx: any, gc: boolean): Checkpoint | null;
    getSignableLength(indexers: Array<any>): Promise<number>;
    getSignatures(
      indexers: Array<any>,
      length: number,
    ): Promise<SignerType[] | null>;
  }

  function findBestCheckpoint(checkpoints: Checkpoint[], len: number): number;
  function descendingOrder(a: number, b: number): number;

  class WakeupExtension {
    constructor(base: Autobase, core: Hypercore);

    requestWakeup(): void;
    broadcastWakeup(): void;
    private _encodeWakeup(): Buffer | null;
    private _onmessage(buf: Buffer, from: any): void;
  }

  const BULK_SHIFT: number;

  class Snapshot {
    index: number;
    fork: number;
    length: number;
    byteLength: number;
    tipLength: number;
    tip: any; // Should specify actual type
    source: any; // Should specify actual type
    constructor(source: any, update: boolean);
    clone(): Snapshot;
    getIndexedLength(): number;
    getSignedLength(): number;
    getIndexedByteLength(): number;
    update(): void;
    clear(): void;
    detach(tip: any, length: number): void; // Should specify actual type for `tip`
  }

  class AutocoreSession extends EventEmitter {
    isAutobase: boolean;
    closing: boolean;
    closed: any; // Should specify actual type
    opened: boolean;
    indexed: boolean;
    writable: boolean;
    activeRequests: Array<any>; // Should specify actual type
    valueEncoding: any; // Should specify actual type
    private _source: any; // Should specify actual type
    private _index: number;
    private _snapshot: Snapshot | null;
    constructor(
      source: any,
      snapshot: Snapshot | null,
      indexed: boolean,
      valueEncoding: any,
    );
    base: unknown; // Should specify actual type
    id: unknown; // Should specify actual type
    key: unknown; // Should specify actual type
    snapshotted: boolean;
    discoveryKey: unknown; // Should specify actual type
    fork: number;
    byteLength: number;
    length: number;
    indexedByteLength: number;
    indexedLength: number;
    signedLength: number;
    getBackingCore(): any; // Should specify actual type
    ready(): Promise<void>;
    getUserData(name: string): Promise<any>;
    setUserData(name: string, value: any, opts: any): Promise<any>;
    snapshot(options?: { valueEncoding?: any }): any;
    session(
      options?: { valueEncoding?: any; snapshot?: boolean; indexed?: boolean },
    ): any;
    update(opts: any): Promise<boolean>;
    seek(byteOffset: number, opts: any): Promise<[number, number] | null>;
    get(index: number, opts: any): Promise<any>;
    truncate(newLength: number): Promise<void>;
    append(block: any): Promise<any>; // Specify actual type for block
    close(): Promise<void>;
    private _getNodes(): Array<any>; // Should specify actual type
  }

  class Autocore extends ReadyResource {
    indexedLength: number;
    indexedByteLength: number;
    length: number;
    byteLength: number;
    fork: number;
    base: Autobase; // Should specify actual type
    name: string;
    originalCore: Hypercore; // Should specify actual type
    core: Hypercore; // Should specify actual type
    wakeupExtension: WakeupExtension | null;
    migrated: any; // Should specify actual type
    appending: number;
    truncating: number;
    indexing: number;
    systemIndex: number;
    checkpointer: number;
    sessions: Array<AutocoreSession>;
    nodes: Array<any>; // Should specify actual type
    signer: Signer;
    private _shifted: number;
    private _pendingSnapshots: Array<Snapshot>;
    private _lastCheckpoint: any; // Should specify actual type
    constructor(base: Autobase, core: Hypercore, name: string, opts?: any);
    private _isSystem(): boolean;
    id: unknown; // Should specify actual type
    key: unknown; // Should specify actual type
    discoveryKey: unknown; // Should specify actual type
    latestKey: string;
    pendingIndexedLength: number;
    private _registerWakeupExtension(): void;
    private _ensureCore(key: any, length: number): Promise<void>;
    reset(length: number): Promise<void>;
    private _updateBatch(core: Hypercore): Promise<void>;
    private _updateCoreState(): void;
    private _open(): Promise<void>;
    private _ensureUserData(core: Hypercore, force: boolean): Promise<void>;
    createSession(valueEncoding: any, indexed: boolean): AutocoreSession;
    createSnapshot(valueEncoding: any): AutocoreSession;
    private _createSession(
      snapshot: Snapshot | null,
      valueEncoding: any,
      indexed: boolean,
    ): AutocoreSession;
    seek(bytes: number, opts: any): Promise<any>;
    get(index: number, opts: any): Promise<any>;
    setUserData(name: string, val: any, opts: any): Promise<any>;
    getUserData(name: string): Promise<any>;
    truncate(newLength: number): void;
    checkpoint(): Promise<{ checkpointer: number; checkpoint: any }>;
    private _checkpoint(): Promise<any>;
    private _updateCheckpoint(migrated: any): Promise<void>;
    update(opts: any): any; // Should specify actual type
    indexBatch(start: number, end: number): Array<any>; // Specify actual type
    private _onindex(added: number): void;
    private _onundo(removed: number): void;
    private _append(batch: Array<any>): void; // Specify actual type
    private _emitAppend(): void;
    private _emitIndexedAppend(): void;
    isBootstrapped(): boolean;
    bootstrap(): Promise<boolean>;
    private _shouldFlush(): boolean;
    flush(): Promise<boolean>;
    private _flush(): Promise<boolean>;
  }

  function debugWarn(...msg: any[]): void;

  const MANIFEST_VERSION: number;
  const INDEX_VERSION: number;

  const EMPTY: Buffer;

  function staticManifest(hash: Buffer): Object;
  function getBlockKey(
    bootstrap: string,
    encryptionKey: Buffer,
    name: string,
  ): Buffer;
  function indexersWithManifest(indexers: Array<any>): Array<any>;

  class AutoStore {
    constructor(base: Autobase);
    ready(): Promise<void>;
    migrate(): Promise<void>;
    get(opts: any, moreOpts?: any): Autocore;
    getSystemCore(): any;
    getWriters(keys: Array<any>): Promise<Array<any>>;
    getCore(
      ac: Autocore,
      indexers: Array<any>,
      length: number,
      opts?: any,
    ): Promise<any>;
    getIndexedCores(): Array<any>;
    flush(): Promise<boolean>;
    deriveNamespace(name: string, entropy: Buffer): Buffer;
    getByKey(key: Buffer, indexers?: Array<any>): any;
    getByIndex(index: number): any;
    deriveKey(
      name: string,
      indexers?: Array<any>,
      prologue?: Buffer | null,
    ): Buffer | null;
  }

  export const AUTOBASE_VERSION: number;
  export const DEFAULT_ACK_INTERVAL: number;
  export const DEFAULT_ACK_THRESHOLD: number;
  export const FF_THRESHOLD: number;
  export const DEFAULT_FF_TIMEOUT: number;
  export const REMOTE_ADD_BATCH: number;

  export default class Autobase<T = Autocore, H = any> extends ReadyResource {
    private _draining: boolean;
    private _appending: Promise<void> | null;
    private _updatingCores: boolean;
    private _advancing: Promise<void> | null;
    private _advanced: Promise<void> | null;
    private _waiting: SignalPromise<void>;
    private _lock: ReturnType<typeof mutexify>;
    private _ackTimer: NodeJS.Timeout | null;
    private _acking: boolean;
    public store: Corestore;
    public core: Autocore;
    public local: Hypercore<H>;
    public view: T;

    constructor(
      store: Corestore,
      bootstrap: string | Buffer | null,
      handlers?: AutobaseHandlers<T>,
    );

    static getLocalCore(
      store: Corestore<T>,
      handlers?: AutobaseHandlers<T>,
      encryptionKey?: Buffer,
    ): Hypercore;

    [Symbol.for("nodejs.util.inspect.custom")](
      depth: number,
      opts?: { indentationLvl: number },
    ): string;
    bootstraps: string[];
    writable: boolean;
    key: Buffer;
    discoveryKey: Buffer;
    replicate(socket: any): NodeJS.Stream;
    replicate(init: boolean, opts?: any): NodeJS.Stream;
    heads(): any[];
    hasPendingIndexers(): boolean;
    hasUnflushedIndexers(): boolean;
    hintWakeup(keys: string | string[]): void;
    flush(): Promise<void>;
    getSystemKey(): string | null;

    update({ wait }?: { wait: boolean }): Promise<void>;
    addWriter(key: Buffer, opts?: { indexer?: boolean }): Promise<void>;
    append(block: any): Promise<void>;
    close(): Promise<void>;
  }

  export interface AutobaseHandlers {
    valueEncoding?: "utf-8" | "json" | "binary";
    encrypted?: boolean;
    encryptionKey?: Buffer;
    keyPair?: KeyPair;
    fastForward?: boolean | Object;
    ackInterval?: number;
    ackThreshold?: number;
    onindex?: (...args: any[]) => void;
    apply?: (...args: any[]) => void;
    open?: (...args: any[]) => void;
    close?: (...args: any[]) => void;
  }

  function noop(): void;
  function emitWarning(this: Autobase, message: string): void;
  function compareNodes(a: any, b: any): number;
  function toKey(input: string | Buffer): string;

  function isObject(value: any): boolean;
}
