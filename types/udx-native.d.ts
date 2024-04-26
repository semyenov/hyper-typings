
declare module 'udx-native' {
  import { EventEmitter } from 'node:events'
  import { Buffer } from 'node:buffer'
  import { Duplex } from 'streamx'

  export class UDX {
    constructor()
    static isIPv4(host: string): boolean
    static isIPv6(host: string): boolean
    static isIP(host: string): boolean

    createSocket(opts: object): UDXSocket
    createStream(id: number, opts?: object): UDXStream
    networkInterfaces(): NetworkInterface[]
    watchNetworkInterfaces(onchange?: (interfaces: NetworkInterface[]) => void): void
    lookup(host: string, opts?: { family?: number }): Promise<{ host: string, family: number }>
  }

  export class UDXSocket {
    readonly udx: UDX
    readonly handle: any
    readonly bound: boolean
    readonly closing: boolean
    readonly destroying: boolean
    readonly destroyed: boolean
    readonly localPort: number
    readonly remotePort: number
    readonly localHost: string
    readonly remoteHost: string
    readonly localFamily: string
    readonly remoteFamily: string
    readonly encrypted: boolean

    bind(port: number, host?: string): void
    listen(port: number, host?: string): void
    connect(port: number, host?: string): void
    connect(port: number, host?: string, opts?: any): void
    accept(): UDXSocket
    destroy(err?: Error): void
    close(cb?: (err?: Error) => void): void
    write(data: Buffer, cb?: (err?: Error) => void): void
    end(data?: Buffer | string, cb?: (err?: Error) => void): void
    tls(opts: {
      key: string
      cert: string
      ca?: string[]
      requestCert?: boolean
      rejectUnauthorized?: boolean
      alpnProtocols?: string[]
      NPNProtocols?: string[]
      SNICallback?: (servername: string, cb: (err: Error | null, ctx: any) => void) => void
    }, cb?: (err?: Error) => void): void
    setInteractive(bool: boolean): void
    setFirewall(firewall: (socket: UDXSocket, port: number, host: string) => boolean): void
  }

  export class UDXStream extends Duplex {
    readonly connected: boolean
    readonly mtu: number
    readonly rtt: number
    readonly cwnd: number
    readonly inflight: number
    readonly localHost: string | null
    readonly localFamily: number
    readonly localPort: number

    constructor(udx: UDX, id: number, opts?: {
      firewall?: (socket: any, port: number, host: string) => boolean,
      framed?: boolean,
      seq?: number,
      ack?: number,
    })

    setInteractive(bool: boolean): void
    connect(socket: any, remoteId: number, port: number, host?: string, opts?: {
      ack?: number,
    }): void
    changeRemote(socket: any, remoteId: number, port: number, host?: string): Promise<void>
    relayTo(destination: UDXStream): void
    async send(buffer: Buffer): Promise<boolean>
    trySend(buffer: Buffer): void
    async flush(): Promise<boolean>
    toJSON(): {
      id: number,
      connected: boolean,
      destroying: boolean,
      destroyed: boolean,
      remoteId: number,
      remoteHost: string | null,
      remoteFamily: number,
      remotePort: number,
      mtu: number,
      rtt: number,
      cwnd: number,
      inflight: number,
      socket: any,
    }
  }

  export interface NetworkInterface {
    family: number
    name: string
    address: string
    netmask: string
    mac: string
    internal: boolean
    cidr: string
    scopeid: number
  }

  export default UDX
}

