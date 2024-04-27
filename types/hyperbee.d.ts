declare module 'hyperbee' {
	import {type Buffer} from 'buffer';
	import {type Readable} from 'stream';
	import {Codec} from 'codecs';

	import {type Mutex} from 'mutexify/promise';
	import type Hypercore from 'hypercore';

  type TKey = string | Buffer;
  type TKeyEncoding = 'ascii' | 'utf-8' | 'binary';
  type TValueEncoding = 'json' | 'utf-8' | 'binary';
  type HyperbeeCAS<K extends TKey, V = unknown> = (
  	prev: HyperbeeEntry<K, V>,
  	next: HyperbeeEntry<K, V>
  ) => boolean;

  export type HyperbeeOptions<K extends TKey, V = unknown> = {
  	keyEncoding?: TKeyEncoding;
  	valueEncoding?: TValueEncoding;
  	extension?: boolean | any;
  	metadata?: Record<string, any>;
  	lock?: () => Promise<Mutex>;
  	sep?: TKey;
  	readonly?: boolean;
  	prefix?: TKey;
  	alwaysDuplicate?: boolean;
  	checkout?: number;
  	sessions?: boolean;
  };

  export type HyperbeeEntry<K extends TKey, V = unknown> = {
  	seq: number;
  	key: K;
  	value: V | undefined;
  };

  export type HyperbeeHistoryEntry<K extends TKey, V = unknown> = {
  	type: 'put' | 'del';
  } & HyperbeeEntry<K, V>;

  export type HyperbeeRange = {
  	gt?: K;
  	gte?: K;
  	lt?: K;
  	lte?: K;
  	reverse?: boolean;
  	limit?: number;
  };

  export type HyperbeeWatcherOptions = {
  	live?: boolean;
  	reverse?: boolean;
  	start?: number;
  	startSeq?: number;
  	end?: number;
  	limit?: number;
  };

  export type HyperbeeWriteBatch = {
  	put<T>(
  		key: string,
  		value?: any,
  		options?: {cas?: HyperbeeCAS<T>}
  	): Promise<void>;
  	get<T>(
  		key: string,
  		options?: {
  			wait?: boolean;
  			update?: boolean;
  			keyEncoding?: string;
  			valueEncoding?: string;
  		}
  	): Promise<HyperbeeEntry<T> | undefined>;
  	del<T>(
  		key: string,
  		options?: {cas?(prev: HyperbeeEntry<T>): boolean}
  	): Promise<void>;

  	flush(): Promise<void>;
  	close(): Promise<void>;
  	lock(): Promise<void>;
  };

  export class HyperbeeEntryWatcher<K extends TKey, V = unknown> {
  	constructor(
  		bee: Hyperbee<K, V>,
  		key: string,
  		options?: HyperbeeOptions<K, V>
  	);

  	keyEncoding: 'ascii' | 'utf-8' | 'binary';
  	valueEncoding: 'json' | 'utf-8' | 'binary';
  	index: number;
  	bee: Hyperbee<K, V>;
  	key: string;
  	node: HyperbeeEntry<K, V> | undefined;

  	on(event: 'update', listener: () => void): this;
  	close(): Promise<void>;
  }

  export default class Hyperbee<K extends TKey, V = unknown> {
  	constructor(core: Hypercore, opts?: HyperbeeOptions<K, V>);

  	core: Hypercore;
  	feed: Hypercore;
  	tree: Hyperbee<K, V>;
  	keyEncoding?: TKeyEncoding;
  	valueEncoding?: TValueEncoding;
  	extension: any; // Consider specifying a more precise type if possible
  	metadata: any; // Consider specifying a more precise type if possible
  	lock: Mutex;
  	sep: Buffer;
  	readonly: boolean;
  	prefix: TKey | undefined;
  	version: number;
  	id: Buffer;
  	key: Buffer;
  	discoveryKey: Buffer;
  	writable: boolean;
  	readable: boolean;

  	ready(): Promise<void>;
  	close(): Promise<void>;
  	put<V = unknown>(
  		key: TKey,
  		value?: V,
  		options?: {cas?: HyperbeeCAS<V>}
  	): Promise<void>;
  	get<V = unknown>(
  		key: TKey,
  		options?: {
  			wait?: boolean;
  			update?: boolean;
  			keyEncoding?: TKeyEncoding;
  			valueEncoding?: TValueEncoding;
  		}
  	): Promise<HyperbeeEntry<K, V> | undefined>;
  	del<V = unknown>(
  		key: TKey,
  		options?: {cas?(prev: HyperbeeEntry<K, V>): boolean}
  	): Promise<void>;
  	getBySeq<V = unknown>(
  		seq: number,
  		options?: {keyEncoding?: TKeyEncoding; valueEncoding?: TValueEncoding}
  	): Promise<HyperbeeEntry<K, V> | undefined>;
  	replicate(isInitiatorOrStream: boolean): any;
  	batch(): HyperbeeWriteBatch;
  	peek<V = unknown>(
  		range?: HyperbeeRange,
  		options?: {keyEncoding?: TKeyEncoding; valueEncoding?: TValueEncoding}
  	): Promise<HyperbeeEntry<K, V> | undefined>;
  	createReadStream<V = unknown>(
  		range?: HyperbeeRange,
  		options?: {reverse?: boolean; limit?: number}
  	): Readable<HyperbeeEntry<K, V>>;
  	createDiffStream<V = unknown>(
  		otherVersion: number,
  		options?: HyperbeeRange & {reverse?: boolean; limit?: number}
  	): Readable<{
  		current: HyperbeeEntry<K, V>;
  		previous: HyperbeeEntry<K, V> | undefined;
  	}>;
  	createHistoryStream<V = unknown>(
  		options?: HyperbeeWatcherOptions
  	): Readable<HyperbeeHistoryEntry<K, V>>;
  	getAndWatch<V = unknown>(
  		key: TKey,
  		options?: HyperbeeWatcherOptions
  	): Promise<HyperbeeEntryWatcher<K, V>>;
  	watch<V = unknown>(range?: HyperbeeRange): Readable<HyperbeeEntry<K, V>>;
  	checkout(version: number): Hyperbee;
  	snapshot(): Hyperbee;
  	sub(
  		prefix: TKey,
  		options?: {
  			separator?: Buffer;
  			keyEncoding?: TKeyEncoding;
  			valueEncoding?: TValueEncoding;
  		}
  	): Hyperbee;
  	getHeader(options?: any): Promise<any>;
  }
}

// export interface HyperbeeOptions {
//   keyEncoding?: 'ascii' | 'utf-8' | 'binary';
//   valueEncoding?: 'json' | 'utf-8' | 'binary';
//   extension?: boolean | Extension;
//   metadata?: Record<string, any>;
//   lock?: () => Promise<() => void>;
//   sep?: Buffer | string;
//   readonly?: boolean;
//   prefix?: Buffer | string;
//   alwaysDuplicate?: boolean;
//   checkout?: number;
//   _view?: boolean;
//   _sub?: boolean;
//   sessions?: boolean;
// }

// export interface HyperbeeEntry<T = unknown> {
//   seq: number;
//   key: string;
//   value: T;
// }

// export interface HyperbeeHistoryEntry<T = unknown> extends HyperbeeEntry<T> {
//   type: 'put' | 'del';
// }

// export interface HyperbeeRange {
//   gt?: string;
//   gte?: string;
//   lt?: string;
//   lte?: string;
//   reverse?: boolean;
//   limit?: number;
// }

// export interface HyperbeeWatcherOptions extends HyperbeeRange {
//   keyEncoding?: 'ascii' | 'utf-8' | 'binary';
//   valueEncoding?: 'json' | 'utf-8' | 'binary';
// }

// export class HyperbeeWatcher<T = unknown> {
//   node: HyperbeeEntry<T>;
//   on(event: 'update', listener: () => void): this;
//   close(): Promise<void>;
// }

// export interface HyperbeeWriteBatch {
//   put<T>(key: string, value?: any, options?: { cas?: HyperbeeCAS<T> }): Promise<void>;
//   get<T>(key: string, options?: { wait?: boolean; update?: boolean; keyEncoding?: string; valueEncoding?: string }): Promise<HyperbeeEntry<T> | null>;
//   del<T>(key: string, options?: { cas?(prev: HyperbeeEntry<T>): boolean }): Promise<void>;
//   flush(): Promise<void>;
//   close(): Promise<void>;
//   lock(): Promise<void>;
// }

// export interface TreeNodeOptions {
//   block?: any; // Consider replacing 'any' with a more specific type if possible
//   keys?: Key[];
//   children?: Child[];
//   offset?: number;
// }

// export class TreeNode {
//   constructor(options: TreeNodeOptions);

//   block: any; // Consider replacing 'any' with a more specific type if possible
//   keys: Key[];
//   children: Child[];
//   offset: number;
//   changed: boolean;

//   preload(): void;
//   insertKey<T>(key: Key, value: T, child: any, node: any, encoding: any, cas: any): Promise<boolean>;
//   removeKey(index: number): void;
//   siblings(parent: TreeNode): Promise<{ left: TreeNode | null; index: number; right: TreeNode | null }>;
//   merge(node: TreeNode, median: Key): void;
//   split(): Promise<{ left: TreeNode; median: Key; right: TreeNode }>;
//   getKeyNode(index: number): Promise<any>; // Consider replacing 'any' with a more specific type if possible
//   setKey(index: number, key: Key): void;
//   getChildNode(index: number): Promise<TreeNode>;
// }
