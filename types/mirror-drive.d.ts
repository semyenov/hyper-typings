declare module 'mirror-drive' {
  export interface Entry {
    key: string
    value: EntryValue
  }

  export interface EntryValue {
    linkname?: string
    executable?: boolean
    metadata?: any
    blob?: Blob
  }

  export interface MirrorDriveOptions {
    prefix?: string
    dryRun?: boolean
    prune?: boolean
    includeEquals?: boolean
    filter?: (key: string) => boolean
    metadataEquals?: (a: any, b: any) => boolean
    batch?: boolean
    entries?: AsyncIterableIterator<string>
  }

  export interface MirrorDriveListOptions {
    filter?: (key: string) => boolean
  }

  export interface MirrorDriveDiff {
    op: 'add' | 'change' | 'remove' | 'equal'
    key: string
    bytesRemoved: number
    bytesAdded: number
  }

  export interface MirrorDriveCount {
    files: number
    add: number
    remove: number
    change: number
  }

  export class MirrorDrive {
    constructor(src: any, dst: any, opts?: MirrorDriveOptions)

    [Symbol.asyncIterator](): AsyncIterator<MirrorDriveDiff>

    done(): Promise<void>

    readonly count: MirrorDriveCount
    readonly bytesRemoved: number
    readonly bytesAdded: number

    private _mirror(): AsyncIterableIterator<MirrorDriveDiff>

    private static _list(a: any, b: any, opts?: MirrorDriveListOptions): AsyncIterableIterator<[string, Entry | null, Entry | null]>

    private static blobLength(entry: Entry): number
    private static pipeline(rs: any, ws: any): Promise<void>
    private static same(m: MirrorDrive, srcEntry: Entry, dstEntry: Entry): Promise<boolean>
    private static sizeEquals(srcEntry: Entry, dstEntry: Entry): boolean
    private static metadataEquals(m: MirrorDrive, srcEntry: Entry, dstEntry: Entry): boolean
    private static noop(): void
  }

  export default MirrorDrive
}