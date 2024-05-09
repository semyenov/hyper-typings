declare module 'streamx' {
  export { EventEmitter } from 'events'

  export interface ReadableOptions {
    highWaterMark?: number
    encoding?: string
    objectMode?: boolean
    read?: (this: Readable, size: number) => void
    destroy?: (
      this: Readable,
      err: Error | null,
      callback: (error: Error | null) => void,
    ) => void
    signal?: AbortSignal
  }

  export interface WritableOptions<T = any> {
    highWaterMark?: number
    decodeStrings?: boolean
    objectMode?: boolean
    write?: (
      this: Writable,
      chunk: T,
      encoding: string,
      callback: (error?: Error | null) => void,
    ) => void
    writev?: (
      this: Writable,
      chunks: Array<{ chunk: T; encoding: string }>,
      callback: (error?: Error | null) => void,
    ) => void
    final?: (this: Writable, callback: (error?: Error | null) => void) => void
    destroy?: (
      this: Writable,
      err: Error | null,
      callback: (error: Error | null) => void,
    ) => void
    signal?: AbortSignal
  }

  export interface DuplexOptions extends ReadableOptions, WritableOptions {}

  export class Stream extends EventEmitter {
    constructor(opts?: any)
    destroy(err?: Error): void
  }

  export class Readable<T = any> extends Stream {
    constructor(opts?: ReadableOptions)
    read(size?: number): T
    setEncoding(encoding: string): this
    pause(): this
    resume(): this
    isPaused(): boolean
    pipe<T extends Writable>(destination: T, options?: { end?: boolean }): T
    unpipe(destination?: Writable): this
    unshift(chunk: T, encoding?: string): void
    wrap(stream: Readable): this
    [Symbol.asyncIterator](): AsyncIterableIterator<T>
  }

  export class Writable<T = any> extends Stream {
    constructor(opts?: WritableOptions)
    write(
      chunk: T,
      encoding?: string,
      callback?: (error: Error | null | undefined) => void,
    ): boolean
    write(
      chunk: T,
      callback?: (error: Error | null | undefined) => void,
    ): boolean
    setDefaultEncoding(encoding: string): this
    end(cb?: () => void): this
    end(chunk: T, cb?: () => void): this
    end(chunk: T, encoding?: string, cb?: () => void): this
    cork(): void
    uncork(): void
  }

  export class Duplex<T = any> extends Readable<T> implements Writable<T> {
    constructor(opts?: DuplexOptions)
    write(
      chunk: T,
      encoding?: string,
      callback?: (error: Error | null | undefined) => void,
    ): boolean
    write(
      chunk: T,
      callback?: (error: Error | null | undefined) => void,
    ): boolean
    setDefaultEncoding(encoding: string): this
    end(cb?: () => void): this
    end(chunk: T, cb?: () => void): this
    end(chunk: T, encoding?: string, cb?: () => void): this
    cork(): void
    uncork(): void
  }

  export class Transform<T = any> extends Duplex<T> {
    constructor(opts?: TransformOptions)
  }

  export class PassThrough extends Transform {}

  export function pipeline(...streams: any[]): Promise<void>
  export function pipelinePromise(...streams: any[]): Promise<void>
  export function isStream(stream: any): boolean
  export function isStreamx(stream: any): boolean
  export function getStreamError(stream: any): Error | null
  export function isReadStreamx(stream: any): boolean
}
