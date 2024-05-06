
declare module '@hyperswarm/secret-stream' {
  import { Buffer } from 'node:buffer'
  import { Duplex } from 'stream'

  import { UDXStream } from 'udx-native'
  import Noise from 'noise-handshake';

  interface KeyPair {
    publicKey: Buffer
    secretKey: Buffer
  }

  export interface HandshakeResult {
    data?: Buffer
    tx?: Buffer
    rx?: Buffer
    hash?: Buffer
    publicKey?: Buffer
    remotePublicKey?: Buffer
  }

  export interface Handshake {
    constructor(isInitiator: boolean, keyPair: KeyPair, remotePublicKey?: Buffer, pattern?: string)

    readonly keyPair: KeyPair
    readonly isInitiator: boolean
    readonly noise: Noise

    recv(data: Buffer): HandshakeResult
    send(): HandshakeResult
  }

  export interface NoiseSecretStreamOptions {
    publicKey?: Buffer
    remotePublicKey?: Buffer
    handshake?: Handshake
    pattern?: string
    keepAlive?: number
    timeout?: number
    autoStart?: boolean
  }

  export class NoiseSecretStream extends Duplex {
    constructor(isInitiator: boolean, rawStream?: UDXStream, opts?: NoiseSecretStreamOptions)

    static keyPair(seed?: Buffer): KeyPair
    static id(handshakeHash: Buffer, isInitiator: boolean, id?: Buffer): Buffer

    readonly noiseStream: NoiseSecretStream
    readonly isInitiator: boolean
    readonly rawStream: UDXStream
    readonly publicKey: Buffer
    readonly remotePublicKey: Buffer
    readonly handshakeHash: Buffer
    readonly connected: boolean
    readonly keepAlive: number
    readonly timeout: number
    readonly destroyed: boolean

    setTimeout(ms: number): void
    setKeepAlive(ms: number): void
    start(rawStream?: UDXStream, opts?: NoiseSecretStreamOptions): void
    flush(): Promise<boolean>
    alloc(len: number): Buffer
    toJSON(): object
  }
}
