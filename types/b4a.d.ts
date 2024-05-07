// b4a.d.ts

declare module 'b4a' {
  export function isBuffer(value: any): boolean
  export function isEncoding(encoding: string): boolean
  export function alloc(size: number, fill?: any, encoding?: string): Buffer
  export function allocUnsafe(size: number): Buffer
  export function allocUnsafeSlow(size: number): Buffer
  export function byteLength(string: string, encoding?: string): number
  export function compare(a: Buffer, b: Buffer): number
  export function concat(buffers: Buffer[], totalLength?: number): Buffer
  export function copy(
    source: Buffer,
    target: Buffer,
    targetStart?: number,
    start?: number,
    end?: number,
  ): number
  export function equals(a: Buffer, b: Buffer): boolean
  export function fill(
    buffer: Buffer,
    value: any,
    offset?: number,
    end?: number,
    encoding?: string,
  ): Buffer
  export function from(
    value: any,
    encodingOrOffset?: string | number,
    length?: number,
  ): Buffer
  export function includes(
    buffer: Buffer,
    value: any,
    byteOffset?: number,
    encoding?: string,
  ): boolean
  export function indexOf(
    buffer: Buffer,
    value: any,
    byteOffset?: number,
    encoding?: string,
  ): number
  export function lastIndexOf(
    buffer: Buffer,
    value: any,
    byteOffset?: number,
    encoding?: string,
  ): number
  export function swap16(buffer: Buffer): Buffer
  export function swap32(buffer: Buffer): Buffer
  export function swap64(buffer: Buffer): Buffer
  export function toBuffer(buffer: Buffer | Uint8Array): Buffer
  export function toString(
    buffer: Buffer,
    encoding?: string,
    start?: number,
    end?: number,
  ): string
  export function write(
    buffer: Buffer,
    string: string,
    offset?: number,
    length?: number,
    encoding?: string,
  ): number
  export function writeDoubleLE(
    buffer: Buffer,
    value: number,
    offset: number,
  ): number
  export function writeFloatLE(
    buffer: Buffer,
    value: number,
    offset: number,
  ): number
  export function writeUInt32LE(
    buffer: Buffer,
    value: number,
    offset: number,
  ): number
  export function writeInt32LE(
    buffer: Buffer,
    value: number,
    offset: number,
  ): number
  export function readDoubleLE(buffer: Buffer, offset: number): number
  export function readFloatLE(buffer: Buffer, offset: number): number
  export function readUInt32LE(buffer: Buffer, offset: number): number
  export function readInt32LE(buffer: Buffer, offset: number): number
}
