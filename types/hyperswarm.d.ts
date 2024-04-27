
declare module 'hyperswarm' {
	import {type Buffer} from 'buffer';
	import {EventEmitter} from 'events';
	import {ReadableStream} from 'stream';

	import {type NoiseSecretStream} from '@hyperswarm/secret-stream';
	import type DHT from 'dht-rpc';

  type KeyPair = {
  	publicKey: Buffer;
  	privateKey: Buffer;
  };

  type Connection = {
  	remotePublicKey: Buffer | string;
  };

  type Firewall = (remotePublicKey: Buffer, payload: Buffer | undefined) => boolean;

  export type HyperswarmOptions = {
  	seed?: Buffer;
  	relayThrough?: (force: boolean) => (string | undefined);
  	keyPair?: KeyPair;
  	maxPeers?: number;
  	maxClientConnections?: number;
  	maxServerConnections?: number;
  	maxParallel?: number;
  	backoffs?: number[];
  	jitter?: number;
  	bootstrap?: string[];
  	debug?: boolean;
  	dht?: DHT;
  };

  export type JoinOptions = {
  	timeout?: number;
  	announce?: boolean;
  	lookup?: boolean;
  	server?: boolean;
  	client?: boolean;
  };

  export type PeerInfo = {
  	publicKey: Buffer;
  	relayAddresses: string[];
  	client: boolean;
  	server: boolean;
  };

  export type PeerDiscovery = {
  	on: (event: string, listener: (...args: any[]) => void) => void;
  	session: (opts: JoinOptions) => any;
  	flushed: () => Promise<void>;
  	destroyed: () => Promise<void>;
  	refresh: () => Promise<void>;
  	suspend: () => Promise<void>;
  	resume: () => Promise<void>;
  };

  export type ConnectionSet = {
  	[Symbol.iterator](): IterableIterator<Connection>;

  	size: number;

  	has: (publicKey: Buffer | string) => boolean;
  	get: (publicKey: Buffer | string) => Connection | undefined;
  	add: (connection: Connection) => void;
  	delete: (connection: Connection) => void;
  };

  export default class Hyperswarm extends EventEmitter {
  	constructor(opts?: HyperswarmOptions);

  	readonly dht: DHT;
  	readonly destroyed: boolean;
  	readonly suspended: boolean;
  	readonly maxPeers: number;
  	readonly maxClientConnections: number;
  	readonly maxServerConnections: number;
  	readonly maxParallel: number;
  	readonly relayThrough: HyperswarmOptions['relayThrough'] | undefined;
  	readonly connecting: number;
  	readonly connections: Set;
  	readonly peers: Map;
  	readonly explicitPeers: Set;
  	readonly listening: undefined;

  	connect(topic: Buffer, options?: JoinOptions): PeerDiscovery;
  	join(topic: Buffer, opts?: JoinOptions): PeerDiscovery;
  	leave(topic: Buffer): Promise<void>;
  	joinPeer(publicKey: Buffer): void;
  	leavePeer(publicKey: Buffer): void;
  	listen(): Promise<void>;
  	flush(): Promise<boolean>;
  	clear(): Promise<void>;
  	destroy(opts?: {force: boolean}): Promise<void>;
  	suspend(): Promise<void>;
  	resume(): Promise<void>;
  	topics(): IterableIterator<PeerDiscovery>;
  	on(event: 'connection', listener: (conn: NoiseSecretStream, info: PeerInfo) => void): this;
  }
}

