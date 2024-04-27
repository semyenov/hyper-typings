declare module 'streamx' {
  import { EventEmitter } from 'events';

  // Errors
  export const STREAM_DESTROYED = new Error('Stream was destroyed');
  export const PREMATURE_CLOSE = new Error('Premature close');

  // Stream States
  export const OPENING = 1;
  export const PREDESTROYING = 2;
  export const DESTROYING = 3;
  export const DESTROYED = 4;

  // Classes
  export interface Stream extends EventEmitter { }

  export interface ReadableStream<T = unknown> extends Stream {
    read(): T | null;
    push(chunk: T): boolean;
    end(): void;
    destroy(err?: Error): void;
    destroySoon(err?: Error): void;
    pipe<U>(dest: WritableStream<U>, opts?: { end?: boolean }): WritableStream<U>;
  }


  export class Writable<T = unknown> extends Stream {
    write(data: any): boolean;
    end(data?: any): this;
  }

  export class Duplex<T = unknown> extends ReadableStream<T>, Writable<T> { }

  export class Transform extends Duplex { }
  export class PassThrough extends Transform { }

  // Functions
  export function pipeline(...streams: any[]): any;
  export function pipelinePromise(...streams: any[]): Promise<void>;
  export function isStream(stream: any): boolean;
  export function isStreamx(stream: any): boolean;
  export function getStreamError(stream: any): Error | null;
  export function isReadStreamx(stream: any): boolean;
  export function isTypedArray(data: any): boolean;
  export function defaultByteLength(data: any): number;
  export function noop(): void;
  export function abort(): void;

  // Types and Interfaces
  export interface ReadableState {
    buffer: Buffer[];
    bufferOffset: number;
    bufferLength: number;
    paused: boolean;
    ended: boolean;
    errored: boolean;
    error: Error | null;
    pipes: any[];
    pipesCount: number;
    flowing: boolean;
    endedEmitted: boolean;
    emitClose: boolean;
    reading: boolean;
    sync: boolean;
    defaultEncoding: string;
    length: number;
    objectMode: boolean;
    highWaterMark: number;
    needReadable: boolean;
    emittedReadable: boolean;
    readableListening: boolean;
    resumeScheduled: boolean;
    destroyed: boolean;
    autoDestroy: boolean;
  }

  export interface WritableState {
    buffer: Buffer;
    bufferedRequestCount: number;
    bufferedRequest: any[];
    bufferedFlush: any[];
    bufferedFinish: any[];
    bufferedEnd: boolean;
    corked: number;
    corkRefillLength: number;
    errored: boolean;
    error: Error | null;
    ended: boolean;
    ending: boolean;
    endedEmitted: boolean;
    finished: boolean;
    finishedEmitted: boolean;
    destroying: boolean;
    destroyed: boolean;
    decodeStrings: boolean;
    defaultEncoding: string;
    length: number;
    objectMode: boolean;
    highWaterMark: number;
    writecb: any;
    writechunk: Buffer | null;
    writelen: number;
    afterWriteTick: boolean;
    needDrain: boolean;
    endingEmitted: boolean;
    sync: boolean;
    emitClose: boolean;
    autoDestroy: boolean;
  }
}
