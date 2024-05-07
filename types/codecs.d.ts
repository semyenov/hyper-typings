// codecs.d.ts

declare module 'codecs' {
  export interface Codec {
     name: string;
     encode: (obj: any) => Buffer;
     decode: (buf: Buffer) => any;
     preencode?: (state: any, obj: any) => void;
  }
 
  export interface Codecs {
     ascii: Codec;
     utf8: Codec;
     hex: Codec;
     base64: Codec;
     ucs2: Codec;
     utf16le: Codec;
     ndjson: Codec;
     json: Codec;
     binary: Codec;
     [key: string]: Codec;
  }
 
  export function codecs(fmt: string, fallback?: Codec): Codec;
  export function createJSON(newline: boolean): Codec;
  export function createString(type: string): Codec;
  export function isCompactEncoding(c: any): boolean;
  export function fromCompactEncoding(c: any): Codec;
 
  const codecs: Codecs;
  export default codecs;
 }
