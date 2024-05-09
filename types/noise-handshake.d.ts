declare module 'noise-handshake' {
  type KeyPair = {
  	publicKey: Uint8Array;
  	secretKey: Uint8Array;
  };

  export class CipherState {
  	static readonly MACBYTES: number;
  	static readonly NONCEBYTES: number;
  	static readonly KEYBYTES: number;

  	constructor(key?: Uint8Array);

  	readonly key: Uint8Array | undefined;
  	readonly nonce: number;
  	readonly CIPHER_ALG: string;

  	initialiseKey(key: Uint8Array): void;
  	setNonce(nonce: number): void;
  	encrypt(plaintext: Uint8Array, ad?: Uint8Array): Uint8Array;
  	decrypt(ciphertext: Uint8Array, ad?: Uint8Array): Uint8Array;
  	get hasKey(): boolean;
  }

  export class SymmetricState extends CipherState {
  	constructor(opts?: any);

  	readonly curve: any; // Assuming 'curve' is an instance of a curve implementation
  	readonly digest: Uint8Array;
  	readonly chainingKey: Uint8Array | undefined;
  	readonly offset: number;
  	readonly DH_ALG: string;

  	mixHash(data: Uint8Array): void;
  	mixKeyAndHash(key: Uint8Array): void;
  	mixKeyNormal(key: Uint8Array): void;
  	mixKey(remoteKey: Uint8Array, localKey: Uint8Array): void;
  	encryptAndHash(plaintext: Uint8Array): Uint8Array;
  	decryptAndHash(ciphertext: Uint8Array): Uint8Array;
  	getHandshakeHash(out?: Uint8Array): Uint8Array;
  	split(): [Uint8Array, Uint8Array];
  }

  export default class NoiseState extends SymmetricState {
  	constructor(
  		pattern: string,
  		initiator: boolean,
  		staticKeypair: KeyPair,
  		opts?: any
  	);

  	readonly s: KeyPair;
  	readonly e: KeyPair | undefined;
  	readonly rs: Uint8Array | undefined;
  	readonly re: Uint8Array | undefined;
  	readonly psk: Uint8Array | undefined;
  	readonly pattern: string;
  	readonly handshake: any[]; // Array of symbols representing handshake steps
  	readonly isPskHandshake: boolean;
  	readonly protocol: Uint8Array;
  	readonly initiator: boolean;
  	readonly complete: boolean;
  	readonly rx: Uint8Array | undefined;
  	readonly tx: Uint8Array | undefined;
  	readonly hash: Uint8Array | undefined;

  	initialise(
  		prologue: Uint8Array,
  		remoteStatic: Uint8Array | undefined
  	): void;
  	final(): void;
  	recv(buf: Uint8Array): Uint8Array | undefined;
  	send(payload?: Uint8Array): Uint8Array;
  }
}
