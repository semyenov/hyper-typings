declare module 'hyperdrive' {
	import type {EventEmitter} from 'events';
	import type {Readable, Writable} from 'stream';
	import type ReadyResource from 'ready-resource';
	import type Corestore from 'corestore';
	import type Hyperblobs from 'hyperblobs';
	import type Hyperbee from 'hyperbee';
	import type Hypercore from 'hypercore';

  type HyperdriveOptions = {
  	onwait?: (event: HyperdriveWatchEvent) => void;
  	encryptionKey?: string;
  	compat?: boolean;
  };

  type HyperdriveEntry = {
  	seq: number;
  	key: string;
  	value: {
  		executable: boolean;
  		linkname: string | undefined;
  		blob: {
  			blockOffset: number;
  			blockLength: number;
  			byteOffset: number;
  			byteLength: number;
  		};
  		metadata: any | undefined;
  	};
  };

  type HyperdriveGetOptions = {
  	follow?: boolean;
  	wait?: boolean;
  	timeout?: number;
  };

  type HyperdriveEntryOptions = Record<string, unknown> & HyperdriveGetOptions;

  type HyperdriveComparisonResult = {
  	0: 0;
  	1: 1;
  	'-1': -1;
  };

  type HyperdriveWatchEvent = {
  	current: HyperdriveEntry;
  	previous: HyperdriveEntry;
  };

  type HyperdriveWatchOptions = {
  	folder?: string;
  };

  type HyperdriveCreateReadStreamOptions = {
  	start?: number;
  	end?: number;
  	length?: number;
  	wait?: boolean;
  	timeout?: number;
  };

  type HyperdriveCreateWriteStreamOptions = {
  	executable?: boolean;
  	metadata?: any;
  };

  type HyperdriveDownloadOptions = {
  	folder: string;
  } & HyperdriveGetOptions;

  type HyperdriveDownloadDiffOptions = {
  	folder: string;
  } & HyperdriveGetOptions;

  type HyperdriveDownloadRangeOptions = {
  	dbRanges: any[];
  	blobRanges: any[];
  };

  type HyperdriveUpdateOptions = {
  	wait?: boolean;
  };

  export default class Hyperdrive extends ReadyResource {
  	constructor(corestore: Corestore, options?: HyperdriveOptions);
  	constructor(
  		corestore: Corestore,
  		key?: string,
  		options?: HyperdriveOptions
  	);

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
  	put(
  		path: string,
  		buffer: Buffer,
  		options?: HyperdriveCreateWriteStreamOptions
  	): Promise<void>;
  	get(
  		path: string,
  		options?: HyperdriveGetOptions
  	): Promise<Buffer | undefined>;
  	entry(
  		path: string,
  		options?: HyperdriveEntryOptions
  	): Promise<HyperdriveEntry | undefined>;
  	exists(path: string): Promise<boolean>;
  	del(path: string): Promise<void>;
  	compare(
  		entryA: HyperdriveEntry,
  		entryB: HyperdriveEntry
  	): HyperdriveComparisonResult;
  	clear(path: string, options?: {recursive?: boolean}): Promise<boolean>;
  	clearAll(options?: {recursive?: boolean}): Promise<boolean>;
  	purge(): Promise<void>;
  	symlink(path: string, linkname: string): Promise<void>;
  	batch(): {flush(): Promise<void>};
  	list(
  		folder: string,
  		options?: HyperdriveGetOptions
  	): AsyncIterable<HyperdriveEntry>;
  	readdir(folder: string): AsyncIterable<string>;
  	entries(range?: any, options?: any): AsyncIterable<HyperdriveEntry>;
  	mirror(out: Hyperdrive, options?: any): {done(): Promise<void>};
  	watch(folder?: string): AsyncIterable<HyperdriveWatchEvent>;
  	createReadStream(
  		path: string,
  		options?: HyperdriveCreateReadStreamOptions
  	): Readable;
  	createWriteStream(
  		path: string,
  		options?: HyperdriveCreateWriteStreamOptions
  	): Writable;
  	download(
  		folder: string,
  		options?: HyperdriveDownloadOptions
  	): Promise<void>;
  	checkout(version: number): Hyperdrive;
  	diff(
  		version: number,
  		folder: string,
  		options?: HyperdriveGetOptions
  	): AsyncIterable<{
  		left: HyperdriveEntry | undefined;
  		right: HyperdriveEntry | undefined;
  	}>;
  	downloadDiff(
  		version: number,
  		folder: string,
  		options?: HyperdriveDownloadDiffOptions
  	): Promise<void>;
  	downloadRange(options: HyperdriveDownloadRangeOptions): Promise<void>;
  	findingPeers(): () => void;
  	replicate(
  		isInitiatorOrStream: boolean | NodeJS.ReadWriteStream
  	): NodeJS.ReadWriteStream;
  	update(options?: HyperdriveUpdateOptions): Promise<boolean>;
  	getBlobs(): Promise<Hyperblobs>;
  }
}
