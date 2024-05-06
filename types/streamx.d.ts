declare module 'streamx' {
  export * from 'stream';

  export function pipeline(...streams: any[]): Promise<void>;
  export function pipelinePromise(...streams: any[]): Promise<void>;
  export function isStream(stream: any): boolean;
  export function isStreamx(stream: any): boolean;
  export function getStreamError(stream: any): Error | null;
  export function isReadStreamx(stream: any): boolean;
}