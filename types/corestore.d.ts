// corestore.d.ts

declare module 'corestore' {
	import {EventEmitter} from 'events';
	import {type Stream} from 'stream';

	import type Hypercore from 'hypercore';

	export default class Corestore extends EventEmitter {
		constructor(storage: Storage, opts?: CorestoreOptions);
		ready(): Promise<void>;
		get(opts?: GetOptions): Hypercore;
		replicate(isInitiator: boolean | Stream, opts?: ReplicateOptions): Stream;
		namespace(name: string, opts?: NamespaceOptions): Corestore;
		session(opts?: SessionOptions): Corestore;
		close(): Promise<void>;
	}

	export type CorestoreOptions = {
		cache?: boolean;
		primaryKey?: Buffer;
		passive?: boolean;
		manifestVersion?: number;
		compat?: boolean;
		inflightRange?: number;
	};

	export type GetOptions = {
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
	};

	export type ReplicateOptions = {
		live?: boolean;
		download?: boolean;
		upload?: boolean;
		encrypt?: boolean;
		ondiscoverykey?: (discoveryKey: Buffer) => void;
	};

	export type NamespaceOptions = {
		namespace?: Buffer;
		cache?: boolean;
		writable?: boolean;
		inflightRange?: number;
	};

	export type SessionOptions = {
		detach?: boolean;
	} & NamespaceOptions;

	export type Storage = ((path: string) => any) | string | Hypercore;
}