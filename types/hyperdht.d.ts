declare module 'hyperdht' {
    import { EventEmitter } from 'events';
    import { Buffer } from 'buffer';
    import DHT from 'dht-rpc';

    interface KeyPair {
        publicKey: Buffer;
        privateKey: Buffer;
    }

    class HyperDHT extends DHT {
        constructor(opts?: any);

        readonly defaultKeyPair: KeyPair;

        connect(remotePublicKey: Buffer, opts?: any): Promise<any>;
        createServer(opts?: any, onconnection?: any): Server;
        pool(): ConnectionPool;
        resume(): Promise<void>;
        suspend(): Promise<void>;
        destroy(opts?: any): Promise<void>;
        validateLocalAddresses(addresses: any[]): Promise<any>;
        findPeer(publicKey: Buffer, opts?: any): Query;
        lookup(target: Buffer, opts?: any): Query;
        lookupAndUnannounce(target: Buffer, keyPair: KeyPair, opts?: any): Query;
        unannounce(target: Buffer, keyPair: KeyPair, opts?: any): Promise<void>;
        announce(target: Buffer, keyPair: KeyPair, relayAddresses: any, opts?: any): Promise<void>;
        immutableGet(target: Buffer, opts?: any): Query;
        immutablePut(value: Buffer, opts?: any): Promise<{ hash: Buffer; closestNodes: Node[] }>;
        mutableGet(publicKey: Buffer, opts?: any): Query;
        mutablePut(keyPair: KeyPair, value: Buffer, opts?: any): Promise<{ publicKey: Buffer; closestNodes: Node[]; seq: number; signature: Buffer }>;
        onrequest(req: any): boolean;

        static keyPair(seed: any): any;
        static hash(data: any): Buffer;
        static connectRawStream(encryptedStream: any, rawStream: any, remoteId: any): void;

        createRawStream(opts: any): any;
    }


    // type Query = import("hyperdht/lib/query");
    // type Server = import("hyperdht/lib/server");
    // type Node = import("hyperdht/lib/node");
    // type Router = import("hyperdht/lib/router");
    // type SocketPool = import("hyperdht/lib/socket-pool");
    // type RawStreamSet = import("hyperdht/lib/raw-stream-set");
    // type Persistent = import("hyperdht/lib/persistent");
    // type ConnectionPool = import("hyperdht/lib/connection-pool");

    export default HyperDHT;
}