// streamx.d.ts

declare module 'streamx' {
  import { EventEmitter } from 'node:events';

  export class Stream extends EventEmitter {
    constructor(opts?: any);
    destroy(err?: Error): void;
    // Add other methods and properties as needed
  }

  export class Readable extends Stream {
    constructor(opts?: any);
    pipe(dest: any, cb?: (err: Error | null) => void): any;
    read(): any;
    push(data: any): boolean;
    unshift(data: any): boolean;
    resume(): this;
    pause(): this;
    // Add other methods and properties as needed
  }

  export class Writable extends Stream {
    constructor(opts?: any);
    write(data: any): boolean;
    end(data?: any): this;
    // Add other methods and properties as needed
  }

  export class Duplex extends Stream implements Readable, Writable {
    constructor(opts?: any);

    pipe(dest: any, cb?: (err: Error | null) => void): any;
    read(): any;
    push(data: any): boolean;
    unshift(data: any): boolean;
    resume(): this;
    pause(): this;

    write(data: any): boolean;
    end(data?: any): this;
  }

  export class Transform extends Duplex {
    constructor(opts?: any);
    // Add other methods and properties as needed
  }

  export class PassThrough extends Transform { }

  export function pipeline(...streams: any[]): Promise<void>;
  export function pipelinePromise(...streams: any[]): Promise<void>;
  export function isStream(stream: any): boolean;
  export function isStreamx(stream: any): boolean;
  export function getStreamError(stream: any): Error | null;
  export function isReadStreamx(stream: any): boolean;
  // Add other utility functions as needed
}