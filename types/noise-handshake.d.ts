declare module 'noise-handshake' {
  import { Buffer } from 'node:buffer';

  export interface KeyPair {
    publicKey: Buffer;
    secretKey: Buffer;
  }

  export class CipherState {
    constructor(key?: Buffer);

    readonly key: Buffer | null;
    readonly nonce: number;
    readonly CIPHER_ALG: string;

    initialiseKey(key: Buffer): void;
    setNonce(nonce: number): void;
    encrypt(plaintext: Buffer, ad?: Buffer): Buffer;
    decrypt(ciphertext: Buffer, ad?: Buffer): Buffer;
    get hasKey(): boolean;

    static readonly MACBYTES: number;
    static readonly NONCEBYTES: number;
    static readonly KEYBYTES: number;
  }

  export class SymmetricState extends CipherState {
    constructor(opts?: any);

    readonly curve: any; // Assuming 'curve' is an instance of a curve implementation
    readonly digest: Buffer;
    readonly chainingKey: Buffer | null;
    readonly offset: number;
    readonly DH_ALG: string;

    mixHash(data: Buffer): void;
    mixKeyAndHash(key: Buffer): void;
    mixKeyNormal(key: Buffer): void;
    mixKey(remoteKey: Buffer, localKey: Buffer): void;
    encryptAndHash(plaintext: Buffer): Buffer;
    decryptAndHash(ciphertext: Buffer): Buffer;
    getHandshakeHash(out?: Buffer): Buffer;
    split(): [Buffer, Buffer];
  }

  export class NoiseState extends SymmetricState {
    constructor(pattern: string, initiator: boolean, staticKeypair: KeyPair, opts?: any);

    readonly s: KeyPair;
    readonly e: KeyPair | null;
    readonly rs: Buffer | null;
    readonly re: Buffer | null;
    readonly psk: Buffer | null;
    readonly pattern: string;
    readonly handshake: any[]; // Array of symbols representing handshake steps
    readonly isPskHandshake: boolean;
    readonly protocol: Buffer;
    readonly initiator: boolean;
    readonly complete: boolean;
    readonly rx: Buffer | null;
    readonly tx: Buffer | null;
    readonly hash: Buffer | null;

    initialise(prologue: Buffer, remoteStatic: Buffer | null): void;
    final(): void;
    recv(buf: Buffer): Buffer | null;
    send(payload?: Buffer): Buffer;
  }
}