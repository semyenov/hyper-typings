
declare module 'hyperswarm' {
  import { NoiseSecretStream } from 'secret-stream';
  import { Buffer } from 'node:buffer';
  import { EventEmitter } from 'node:events';
  import { Readable } from 'streamx';
  import DHT from 'dht-rpc';

  interface KeyPair {
    publicKey: Buffer;
    privateKey: Buffer;
  }

  export interface HyperswarmOptions {
    seed?: Buffer,
    relayThrough?: (force: boolean) => (string | null),
    keyPair?: KeyPair,
    maxPeers?: number,
    maxClientConnections?: number,
    maxServerConnections?: number,
    maxParallel?: number,
    backoffs?: number[],
    jitter?: number,
    bootstrap?: string[],
    debug?: boolean,
    dht?: DHT
  }

  export interface JoinOptions {
    timeout?: number,
    announce?: boolean,
    lookup?: boolean,
    server?: boolean,
    client?: boolean
  }

  export interface PeerInfo {
    publicKey: Buffer,
    relayAddresses: string[],
    client: boolean,
    server: boolean
  }

  export interface PeerDiscovery {
    on: (event: string, listener: (...args: any[]) => void) => void,
    session: (opts: JoinOptions) => any,
    flushed: () => Promise<void>,
    destroyed: () => Promise<void>,
    refresh: () => Promise<void>,
    suspend: () => Promise<void>,
    resume: () => Promise<void>
  }

  export interface Firewall {
    (remotePublicKey: Buffer, payload: Buffer | null): boolean
  }

  export class Hyperswarm extends EventEmitter {
    readonly dht: DHT;
    readonly destroyed: boolean
    readonly suspended: boolean
    readonly maxPeers: number
    readonly maxClientConnections: number
    readonly maxServerConnections: number
    readonly maxParallel: number
    readonly relayThrough: HyperswarmOptions['relayThrough'] | null
    readonly connecting: number
    readonly connections: Set
    readonly peers: Map
    readonly explicitPeers: Set
    readonly listening: null

    constructor(opts?: HyperswarmOptions)

    connect(topic: Buffer, options?: JoinOptions): PeerDiscovery
    join(topic: Buffer, opts?: JoinOptions): PeerDiscovery
    leave(topic: Buffer): Promise<void>
    joinPeer(publicKey: Buffer): void
    leavePeer(publicKey: Buffer): void
    listen(): Promise<void>
    flush(): Promise<boolean>
    clear(): Promise<void>
    destroy(opts?: { force: boolean }): Promise<void>
    suspend(): Promise<void>
    resume(): Promise<void>
    topics(): IterableIterator<PeerDiscovery>
    on(event: 'connection', listener: (conn: NoiseSecretStream, info: PeerInfo) => void): this
  }

  export class ConnectionSet {
    readonly size: number;

    constructor();

    [Symbol.iterator](): IterableIterator<Connection>;

    has(publicKey: Buffer | string): boolean;
    get(publicKey: Buffer | string): Connection | undefined;
    add(connection: Connection): void;
    delete(connection: Connection): void;
  }

  export interface Connection {
    remotePublicKey: Buffer | string;
  }

  export default Hyperswarm;
}

