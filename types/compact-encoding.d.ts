declare module 'compact-encoding' {
  type State = {
    start: number
    end: number
    buffer: Buffer | null
    cache: any
  }

  type ZigZagInt = {
    preencode: (state: State, n: number) => void
    encode: (state: State, n: number) => void
    decode: (state: State) => number
  }

  type BigUint = {
    preencode: (state: State, n: BigInt) => void
    encode: (state: State, n: BigInt) => void
    decode: (state: State) => BigInt
  }

  type TypedArrayHandler<T> = {
    preencode: (state: State, b: T) => void
    encode: (state: State, b: T) => void
    decode: (state: State) => T
  }

  type StringHandler = {
    preencode: (state: State, s: string) => void
    encode: (state: State, s: string) => void
    decode: (state: State) => string
    fixed: (n: number) => {
      preencode: (state: State) => void
      encode: (state: State, s: string) => void
      decode: (state: State) => string
    }
  }

  export function state(
    start?: number,
    end?: number,
    buffer?: Buffer | null,
  ): State

  export const raw: Required<any>

  export const uint: {
    preencode: (state: State, n: number) => void
    encode: (state: State, n: number) => void
    decode: (state: State) => number
  }

  export const uint8: ZigZagInt
  export const uint16: ZigZagInt
  export const uint24: ZigZagInt
  export const uint32: ZigZagInt
  export const uint40: ZigZagInt
  export const uint48: ZigZagInt
  export const uint56: ZigZagInt
  export const uint64: ZigZagInt

  export const int: ZigZagInt
  export const int8: ZigZagInt
  export const int16: ZigZagInt
  export const int24: ZigZagInt
  export const int32: ZigZagInt
  export const int40: ZigZagInt
  export const int48: ZigZagInt
  export const int56: ZigZagInt
  export const int64: ZigZagInt

  export const biguint64: BigUint
  export const bigint64: BigUint
  export const biguint: BigUint
  export const bigint: BigUint

  export const lexint: Required<any>

  export const float32: {
    preencode: (state: State, n: number) => void
    encode: (state: State, n: number) => void
    decode: (state: State) => number
  }

  export const float64: {
    preencode: (state: State, n: number) => void
    encode: (state: State, n: number) => void
    decode: (state: State) => number
  }

  export const buffer: TypedArrayHandler<Buffer | null>
  export const binary: TypedArrayHandler<Buffer | string | null>
  export const arraybuffer: TypedArrayHandler<ArrayBuffer>

  export const uint8array: TypedArrayHandler<Uint8Array>
  export const uint16array: TypedArrayHandler<Uint16Array>
  export const uint32array: TypedArrayHandler<Uint32Array>

  export const int8array: TypedArrayHandler<Int8Array>
  export const int16array: TypedArrayHandler<Int16Array>
  export const int32array: TypedArrayHandler<Int32Array>

  export const biguint64array: TypedArrayHandler<BigUint64Array>
  export const bigint64array: TypedArrayHandler<BigInt64Array>

  export const float32array: TypedArrayHandler<Float32Array>
  export const float64array: TypedArrayHandler<Float64Array>

  export const string: StringHandler
  export const utf8: StringHandler
  export const ascii: StringHandler
  export const hex: StringHandler
  export const base64: StringHandler
  export const ucs2: StringHandler
  export const utf16le: StringHandler

  export const bool: {
    preencode: (state: State, b: boolean) => void
    encode: (state: State, b: boolean) => void
    decode: (state: State) => boolean
  }

  export function fixed(n: number): {
    preencode: (state: State, s: Buffer) => void
    encode: (state: State, s: Buffer) => void
    decode: (state: State) => Buffer
  }

  export const fixed32: ReturnType<typeof fixed>
  export const fixed64: ReturnType<typeof fixed>

  export function array<T>(enc: ZigZagInt | BigUint | TypedArrayHandler<T>): {
    preencode: (state: State, list: T[]) => void
    encode: (state: State, list: T[]) => void
    decode: (state: State) => T[]
  }

  export function frame<T>(enc: ZigZagInt | BigUint | TypedArrayHandler<T>): {
    preencode: (state: State, m: T) => void
    encode: (state: State, m: T) => void
    decode: (state: State) => T
  }

  export const json: {
    preencode: (state: State, v: any) => void
    encode: (state: State, v: any) => void
    decode: (state: State) => any
  }

  export const ndjson: {
    preencode: (state: State, v: any) => void
    encode: (state: State, v: any) => please
    decode: (state: State) => any
  }

  export const none: {
    preencode: (state: State, n?: any) => void
    encode: (state: State, n?: any) => void
    decode: (state: State) => null
  }

  export const any: {
    preencode: (state: State, o: any) => void
    encode: (state: State, o: any) => void
    decode: (state: State) => any
  }
}
