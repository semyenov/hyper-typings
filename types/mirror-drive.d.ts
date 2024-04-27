declare module 'mirror-drive' {
	export type Entry = {
		key: string;
		value: EntryValue;
	};

	export type EntryValue = {
		linkname?: string;
		executable?: boolean;
		metadata?: any;
		blob?: Blob;
	};

	export type MirrorDriveOptions = {
		prefix?: string;
		dryRun?: boolean;
		prune?: boolean;
		includeEquals?: boolean;
		filter?: (key: string) => boolean;
		metadataEquals?: (a: any, b: any) => boolean;
		batch?: boolean;
		entries?: AsyncIterableIterator<string>;
	};

	export type MirrorDriveListOptions = {
		filter?: (key: string) => boolean;
	};

	export type MirrorDriveDiff = {
		op: 'add' | 'change' | 'remove' | 'equal';
		key: string;
		bytesRemoved: number;
		bytesAdded: number;
	};

	export type MirrorDriveCount = {
		files: number;
		add: number;
		remove: number;
		change: number;
	};

	export default class MirrorDrive {
		constructor(src: any, dst: any, opts?: MirrorDriveOptions);
		[Symbol.asyncIterator](): AsyncIterator<MirrorDriveDiff>;

		readonly count: MirrorDriveCount;
		readonly bytesRemoved: number;
		readonly bytesAdded: number;

		done(): Promise<void>;

		private _mirror(): AsyncIterableIterator<MirrorDriveDiff>;

		private static _list(a: any, b: any, opts?: MirrorDriveListOptions): AsyncIterableIterator<[string, Entry | undefined, Entry | undefined]>;
		private static blobLength(entry: Entry): number;
		private static pipeline(rs: any, ws: any): Promise<void>;
		private static same(m: MirrorDrive, srcEntry: Entry, dstEntry: Entry): Promise<boolean>;
		private static sizeEquals(srcEntry: Entry, dstEntry: Entry): boolean;
		private static metadataEquals(m: MirrorDrive, srcEntry: Entry, dstEntry: Entry): boolean;
		private static noop(): void;
	}
}