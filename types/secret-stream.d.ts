
declare module 'secret-stream' {
    import EventEmitter from 'events';
    import { UDXStream } from 'udx-native';
    import { Buffer } from 'node:buffer';
    import { Duplex } from 'streamx';
    import Noise from 'noise-handshake';

    interface KeyPair {
        publicKey: Buffer;
        secretKey: Buffer;
    }

    export class Handshake {
        constructor(isInitiator: boolean, keyPair: KeyPair, remotePublicKey: Buffer | null, pattern: string);

        readonly isInitiator: boolean;
        readonly keyPair: KeyPair;
        readonly noise: Noise; // Assuming 'noise' is an instance of a noise protocol implementation
        readonly destroyed: boolean;

        recv(data: Buffer): HandshakeResult | null;
        send(): HandshakeResult | null;
        destroy(): void;

        static keyPair(seed?: Buffer): KeyPair;
    }

    export interface HandshakeResult {
        data: Buffer | null;
        remotePublicKey: Buffer | null;
        hash: Buffer | null;
        tx: Buffer | null;
        rx: Buffer | null;
    }

    export class NoiseSecretStream extends Duplex {
        constructor(isInitiator: boolean, rawStream?: UDXStream, opts?: NoiseSecretStreamOptions);

        readonly isInitiator: boolean;
        readonly rawStream: any;
        readonly publicKey: Buffer | null;
        readonly remotePublicKey: Buffer | null;
        readonly handshakeHash: Buffer | null;
        readonly connected: boolean;
        readonly keepAlive: number;
        readonly timeout: number;
        readonly userData: any;
        readonly opened: Promise<boolean>;

        start(rawStream: any, opts?: NoiseSecretStreamStartOptions): void;
        flush(): Promise<boolean>;
        setTimeout(ms: number): void;
        setKeepAlive(ms: number): void;

        static keyPair(seed: Buffer | null): KeyPair;
        static id(handshakeHash: Buffer, isInitiator: boolean, id: Buffer | null): Buffer;
    }

    export interface NoiseSecretStreamOptions {
        handshake?: Handshake;
        keyPair?: KeyPair | null;
        publicKey?: Buffer | null;
        remotePublicKey?: Buffer | null;
        pattern?: string | null;
        autoStart?: boolean;
        data?: Buffer;
        ended?: boolean;
        keepAlive?: number;
        timeout?: number;
    }

    export interface NoiseSecretStreamStartOptions {
        handshake?: Handshake;
        keyPair?: KeyPair | null;
        publicKey?: Buffer | null;
        remotePublicKey?: Buffer | null;
        pattern?: string | null;
        autoStart?: boolean;
        data?: Buffer;
        ended?: boolean;
    }

    export interface KeyPair {
        publicKey: Buffer;
        secretKey: Buffer;
    }


    export class SecretStream {
        readonly isInitiator: boolean;
        readonly rawStream: any;
        readonly publicKey: Uint8Array | null;
        readonly remotePublicKey: Uint8Array | null;
        readonly handshakeHash: Uint8Array | null;
        readonly connected: boolean;
        readonly keepAlive: number;
        readonly timeout: number;
        readonly userData: any;
        readonly opened: Promise<boolean>;
        start(rawStream: any, opts?: SecretStreamStartOptions): void;
        flush(): Promise<boolean>;
        setTimeout(ms: number): void;
        setKeepAlive(ms: number): void;
    }
    interface SecretStreamStartOptions {
        handshake?: Handshake;
        keyPair?: KeyPair | null;
        publicKey?: Uint8Array | null;
        remotePublicKey?: Uint8Array | null;
        pattern?: string | null;
        autoStart?: boolean;
        data?: Uint8Array;
        ended?: boolean;
    }

    declare function SecretStreamKeyPair(seed: Uint8Array | null): SecretStream.KeyPair;
    declare function SecretStreamId(handshakeHash: Uint8Array, isInitiator: boolean, id: Uint8Array | null): Uint8Array;
    declare class NoiseSecretStream extends SecretStream implements SecretStream.ReadStream, SecretStream.WriteStream {
        constructor(isInitiator: boolean, rawStream?: any, opts?: SecretStreamOptions);
        alloc(len: number): Uint8Array;
        static keyPair(seed: Uint8Array | null): SecretStream.KeyPair;
        static id(handshakeHash: Uint8Array, isInitiator: boolean, id: Uint8Array | null): Uint8Array;
    }
    interface SecretStreamOptions {
        handshake?: Handshake;
        keyPair?: SecretStream.KeyPair | null;
        publicKey?: Uint8Array | null;
        remotePublicKey?: Uint8Array | null;
        pattern?: string | null;
        autoStart?: boolean;
        data?: Uint8Array;
        ended?: boolean;
        keepAlive?: number;
        timeout?: number;
    }
}
