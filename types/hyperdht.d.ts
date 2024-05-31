
declare module 'hyperdht' {
  import ReadyResource from 'ready-resource';
  import { NoiseSecretStream } from '@hyperswarm/secret-stream';
  import { UDXSocket } from 'udx-native'
  import { EventEmitter } from 'events'

  interface KeyPair {
    publicKey: Buffer
    secretKey: Buffer
  }

  interface DHTOptions {
    bootstrap?: string[];
    keyPair?: KeyPair;
    connectionKeepAlive?: number;
  }
  export default class DHT extends EventEmitter implements ReadyResource {
    constructor(options?: DHTOptions)
    
    static keyPair(seed?: Buffer): KeyPair
    static bootstrapper(port: number, host: string, options?: any): DHT

    ready(): Promise<void>;

    close(): Promise<void>;
    
    createServer(
      options?: {
        firewall?: (
          remotePublicKey: Buffer,
          remoteHandshakePayload: any,
        ) => boolean
      },
      onconnection?: (socket: NoiseSecretStream) => void,
    ): Server

    connect(
      remotePublicKey: Buffer,
      options?: { nodes?: any[]; keyPair?: KeyPair },
    ): NoiseSecretStream

    lookup(topic: Buffer, options?: any): LookupStream

    announce(
      topic: Buffer,
      keyPair: KeyPair,
      relayAddresses?: { host: string; port: number }[],
      options?: any,
    ): LookupStream

    unannounce(topic: Buffer, keyPair: KeyPair, options?: any): Promise<void>

    immutablePut(
      value: Buffer,
      options?: any,
    ): Promise<{ hash: Buffer; closestNodes: any[] }>

    immutableGet(
      hash: Buffer,
      options?: any,
    ): Promise<{ value: Buffer; from: any }>

    mutablePut(
      keyPair: KeyPair,
      value: Buffer,
      options?: any,
    ): Promise<{
      publicKey: Buffer
      closestNodes: any[]
      seq: number
      signature: Buffer
    }>

    mutableGet(
      publicKey: Buffer,
      options?: { seq?: number; latest?: boolean },
    ): Promise<{ value: Buffer; from: any; seq: number; signature: Buffer }>

    destroy(options?: { force?: boolean }): Promise<void>
  }

  export class Server extends EventEmitter {
    listen(keyPair: KeyPair): Promise<void>
    refresh(): void
    close(): Promise<void>
    address(): { host: string; port: number; publicKey: Buffer }
    nodes: any[]

    on(eventName: 'connection', listener: (socket: NoiseSecretStream) => void): this;
  }

  interface Socket extends UDXSocket {
    remotePublicKey: Buffer
    publicKey: Buffer
    handshakeHash: Buffer
  }

  interface LookupStream extends EventEmitter {
    from: { id: Buffer; host: string; port: number }
    to: { host: string; port: number }
    peers: { publicKey: Buffer; nodes: { host: string; port: number }[] }[]
  }
}
