declare module 'localdrive' {
  import { ReadStream, WriteStream } from 'fs'

  export interface ReadStreamOptions {
    start?: number
    end?: number
  }

	export type FileWriteStreamOptions = {
		atomic?: boolean;
	} & ReadStreamOptions;

	export type MetadataHooks = {
		get?: (key: string) => any | Promise<any>;
		put?: (key: string, value: any) => void | Promise<void>;
		del?: (key: string) => void | Promise<void>;
	};

	export type LocalDriveOptions = {
		roots?: Record<string, string>;
		metadata?: MetadataHooks;
		followLinks?: boolean;
		atomic?: boolean;
	};

	export type LocalDriveEntry = {
		key: string;
		value: {
			executable: boolean;
			linkname: string | undefined;
			blob:
			| {
				byteOffset: number;
				blockOffset: number;
				blockLength: number;
				byteLength: number;
			}
			| undefined;
			metadata: any | undefined;
		};
		mtime: number;
	};

  export class FileReadStream extends ReadStream {
    constructor(filename: string, opts?: ReadStreamOptions)
  }

  export class FileWriteStream extends WriteStream {
    constructor(filename: string, key: string, drive: LocalDrive, opts?: FileWriteStreamOptions)
  }

	export default class LocalDrive {
		constructor(root: string, opts?: LocalDriveOptions);

		readonly root: string;
		readonly metadata: MetadataHooks;
		readonly supportsMetadata: boolean;

		ready(): Promise<void>;
		close(): Promise<void>;
		flush(): Promise<void>;
		batch(): LocalDrive;
		checkout(): LocalDrive;
		toPath(key: string | {key: string}): string;
		entry(
			name: string,
			opts?: {follow?: boolean}
		): Promise<LocalDriveEntry | undefined>;
		get(
			key: string | {key: string},
			opts?: ReadStreamOptions
		): Promise<Buffer | undefined>;
		put(
			key: string,
			buffer: Buffer,
			opts?: FileWriteStreamOptions
		): Promise<void>;
		del(key: string | {key: string}): Promise<void>;
		symlink(key: string, linkname: string): Promise<void>;
		compare(a: LocalDriveEntry, b: LocalDriveEntry): -1 | 0 | 1;
		list(folder?: string): AsyncIterableIterator<LocalDriveEntry>;
		readdir(folder?: string): AsyncIterableIterator<string>;
		mirror(out: any, opts?: any): any;
		createReadStream(
			key: string | {key: string},
			opts?: ReadStreamOptions
		): FileReadStream;
		createWriteStream(
			key: string,
			opts?: FileWriteStreamOptions
		): FileWriteStream;
	}
}
