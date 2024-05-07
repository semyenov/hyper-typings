declare module 'random-access-storage' {
  import { EventEmitter } from 'events'

  export function queueTick(callback: () => void): void

  interface RandomAccessStorageOptions {
    open?: Function
    read?: Function
    write?: Function
    del?: Function
    truncate?: Function
    stat?: Function
    suspend?: Function
    close?: Function
    unlink?: Function
  }

  type Noop = () => void
  type Callback<T = any> = (err: Error | null, val?: T) => void

  export const NOT_READABLE: Function
  export const NOT_WRITABLE: Function
  export const NOT_DELETABLE: Function
  export const NOT_STATABLE: Function

  export const DEFAULT_OPEN: Function
  export const DEFAULT_CLOSE: Function
  export const DEFAULT_UNLINK: Function

  export const READ_OP = 0
  export const WRITE_OP = 1
  export const DEL_OP = 2
  export const TRUNCATE_OP = 3
  export const STAT_OP = 4

  export const OPEN_OP = 5
  export const SUSPEND_OP = 6
  export const CLOSE_OP = 7
  export const UNLINK_OP = 8

  export const noop: Noop
  export function nextTickCallback(cb: Noop): void
  export function defaultImpl(err: Error | null): Function

  export class Request {
    constructor(
      self: RandomAccessStorage,
      type: number,
      offset: number,
      size: number,
      data: any,
      cb: Callback,
    )

    _maybeOpenError(err: Error): void
    _unqueue(err: Error): void
    callback(err: Error, val?: any): void
    _openAndNotClosed(): boolean
    _open(): void
    _run(): void
  }

  export class RandomAccessStorage extends EventEmitter {
    constructor(opts?: RandomAccessStorageOptions)

    opened: boolean
    suspended: boolean
    closed: boolean
    unlinked: boolean
    writing: boolean

    readable: boolean
    writable: boolean
    deletable: boolean
    truncatable: boolean
    statable: boolean

    read(offset: number, size: number, cb: Callback): void
    write(offset: number, data: any, cb: Callback): void
    del(offset: number, size: number, cb: Callback): void
    truncate(offset: number, cb: Callback): void
    stat(cb: Callback): void
    open(cb: Callback): void
    suspend(cb: Callback): void
    close(cb: Callback): void
    unlink(cb: Callback): void

    run(req: Request, writing: boolean): void
  }

  export function queueAndRun(self: RandomAccessStorage, req: Request): void
  export function drainQueue(self: RandomAccessStorage): void
}
