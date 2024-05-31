/// <reference types="node" />

declare module "udx-native" {
  import { EventEmitter } from "node:events";
  import { Writable } from "streamx";
  import { Duplex } from "stream";

  export type NetworkInterfacesWatcher =
    & {
      start(): void;
      stop(): void;
      close(): void;
      on(event: "change", listener: () => void): this;
      on(event: "close", listener: () => void): this;
    }
    & AsyncIterable<
      Array<{ name: string; host: string; family: 4 | 6; internal: boolean }>
    >;

  export type UDXStreamOptions = {
    firewall?: (socket: UDXSocket, port: number, host: string) => boolean;
    framed?: boolean;
    seq?: number;
  };

  export class UDXSocket extends WritableStream {
    constructor(udx: UDX);

    readonly userData: any;
    readonly isBound: boolean;
    readonly isClosed: boolean;
    readonly isIdle: boolean;
    readonly isBusy: boolean;

    address: { host: string; family: 4 | 6; port: number };
    bind(port?: number, host?: string): Promise<void>;
    unbind(): void;
    setTTL(ttl: number): void;
    send(message: Buffer, port: number, host?: string): Promise<void>;
    sendSync(
      message: Buffer,
      { host, family, port }: { host: string; family: 4 | 6; port: number },
    ): void;
    on(event: "close", listener: () => void): this;
    on(event: "idle", listener: () => void): this;
    on(event: "busy", listener: () => void): this;
    on(event: "bind", listener: () => void): this;
  }

  export class UDXStream extends Duplex {
    constructor(udx: UDX, options?: UDXStreamOptions);

    readonly udx: UDX;
    readonly socket: UDXSocket | undefined;
    readonly id: number;
    readonly remoteId: number;
    readonly remoteHost: string;
    readonly remoteFamily: 4 | 6;
    readonly remotePort: number;
    readonly userData: any;
    readonly isConnected: boolean;
    readonly mtu: number;
    readonly localHost: string | undefined;
    readonly localFamily: 0 | 4 | 6;
    readonly localPort: number;

    connect(
      socket: UDXSocket,
      remoteId: number,
      remotePort: number,
      remoteHost?: string,
      options?: { ack?: boolean },
    ): Promise<void>;
    reconnect(
      remotePort: number,
      remoteHost?: string,
      options?: { ack?: boolean },
    ): Promise<void>;
    relay(stream: UDXStream): void;
    send(message: Buffer): Promise<void>;
    sendSync(message: Buffer): void;
    waitForAcks(): Promise<void>;
    on(event: "connect", listener: () => void): this;
    on(event: "message", listener: (message: Buffer) => void): this;
    on(event: "reconnect", listener: () => void): this;
    on(event: "mtu", listener: (mtu: number) => void): this;
  }

  export default class UDX {
    createSocket(options?: { ipv6Only?: boolean }): UDXSocket;
    createStream(id?: number, options?: UDXStreamOptions): UDXStream;
    isIPv4(host: string): boolean;
    isIPv6(host: string): boolean;
    getAddressFamily(host: string): 0 | 4 | 6;
    getNetworkInterfaces(): {
      name: string;
      host: string;
      family: 4 | 6;
      internal: boolean;
    }[];
    watchNetworkInterfaces(): NetworkInterfacesWatcher;
    resolveHost(
      host: string,
      options?: { family?: 0 | 4 | 6 },
    ): {
      host: string;
      family: 4 | 6;
    };
  }
}
