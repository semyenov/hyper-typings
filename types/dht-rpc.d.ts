
declare module 'dht-rpc' {
	import {EventEmitter} from 'events';
	import {type Buffer} from 'buffer';
	import {ReadableStream} from 'stream';

	import type RoutingTable from 'kademlia-routing-table';
	import type TOS from 'time-ordered-set';
	import {type UDXSocket} from 'udx-native';
	import type UDX from 'udx-native';

	export type Node = {
		host: string;
		port: number;
		id?: Buffer;
	};

	export type QueryInput = {
		target: Buffer;
		command: number;
		value?: Buffer;
	};

	export type QueryOptions = {
		concurrency?: number;
		maxSlow?: number;
		nodes?: Node[];
		closestNodes?: Node[];
		replies?: any[]; // Define a more specific type if possible
		closestReplies?: any[]; // Define a more specific type if possible
		commit?: boolean | ((reply: any, dht: DHT, query: Query) => Promise<void>);
		session?: Session;
		onlyClosestNodes?: boolean;
	};

	export type RequestInput = {
		token?: Buffer;
		command: number;
		target?: Buffer;
		value?: Buffer;
	};

	export type RequestOptions = {
		session?: Session;
		ttl?: number;
	};

	export type PingOptions = {
		size?: number;
		session?: Session;
		ttl?: number;
	};

	export type DHTOptions = {
		bootstrap?: boolean | Node[];
		udx?: UDX;
		concurrency?: number;
		addNode?: (node: Node) => void;
		nodes?: TOS;
		ephemeral?: boolean;
		adaptive?: boolean;
		quickFirewall?: boolean;
	};

	export type IOOptions = {
		maxWindow?: number;
		port?: number;
		host?: string;
		anyPort?: boolean;
		firewalled?: boolean;
		onrequest?: (req: Request, external: boolean) => void;
		onresponse?: (res: any, external: boolean) => void; // Adjust 'any' to the actual response type
		ontimeout?: (req: Request) => void;
	};

	export class CongestionWindow {
		constructor(maxWindow: number);

		isFull(): boolean;
		recv(): void;
		send(): void;
		drain(): void;
	}

	export class IO {
		constructor(table: RoutingTable, udx: UDX, options?: IOOptions); // Adjust 'any' to the actual types

		readonly table: RoutingTable;
		readonly udx: UDX;
		readonly inflight: Request[];
		readonly clientSocket: UDXSocket | undefined;
		readonly serverSocket: UDXSocket | undefined;
		readonly firewalled: boolean;
		readonly ephemeral: boolean;
		readonly congestion: CongestionWindow;
		readonly networkInterfaces: any; // Adjust 'any' to the actual type
		readonly suspended: boolean;

		onrequest: (req: Request, external: boolean) => void;
		onresponse: (res: any, external: boolean) => void; // Adjust 'any' to the actual response type
		ontimeout: (req: Request) => void;

		onmessage(socket: UDXSocket, buffer: Buffer, from: Node): void;
		token(addr: {host: string}, i: number): Uint8Array;
		destroy(): Promise<void>;
		suspend(): void;
		resume(): Promise<void>;
		bind(): Promise<void>;
		createRequest(to: Node, token: Uint8Array | undefined, internal: boolean, command: number, target: any | undefined, value: any | undefined, session: any | undefined, ttl: number): Request | undefined; // Adjust 'any' to the actual types
	}

	export class DHT extends EventEmitter {
		constructor(opts?: DHTOptions);

		static bootstrapper(port: number, host: string, opts?: DHTOptions): DHT;

		readonly id: Buffer | undefined;
		readonly host: string | undefined;
		readonly port: number | undefined;
		readonly randomized: boolean;
		readonly socket: UDXSocket | undefined;
		readonly table: RoutingTable;
		readonly udx: UDX;
		readonly io: IO;
		readonly nodes: TOS;
		readonly bootstrapNodes: Node[];

		private readonly concurrency: number;
		private readonly bootstrapped: boolean;
		private readonly ephemeral: boolean;
		private readonly firewalled: boolean;
		private readonly adaptive: boolean;
		private readonly destroyed: boolean;
		private readonly suspended: boolean;
		private readonly online: boolean;

		onmessage(socket: UDXSocket, buffer: Buffer, from: Node): void;
		bind(): Promise<void>;
		suspend(): Promise<void>;
		resume(): Promise<void>;
		address(): any | undefined;
		localAddress(): Node | undefined;
		remoteAddress(): Node | undefined;
		addNode({host, port}: Node): void;
		toArray(): Node[];
		ready(): Promise<void>;
		findNode(target: Buffer, opts?: any): Query;
		query(query: QueryInput, opts?: QueryOptions): Query;
		ping(node: Node, opts?: PingOptions): Promise<number>;
		request(request: RequestInput, node: Node, opts?: RequestOptions): Query;
		refresh(): void;
		destroy(): void;

		on(event: 'ready', listener: () => void): this;
		on(event: 'suspend', listener: () => void): this;
		on(event: 'resume', listener: () => void): this;
		on(event: 'ping', listener: (node: Node, ms: number) => void): this;
		on(event: 'node', listener: (node: Node) => void): this;
		on(event: 'node-failed', listener: (node: Node, reason: string) => void): this;
		on(event: 'node-removed', listener: (node: Node, reason: string) => void): this;
		on(event: 'query', listener: (query: Query) => void): this;
		on(event: 'query-failed', listener: (query: Query, reason: string) => void): this;
		on(event: 'query-finished', listener: (query: Query) => void): this;
		on(event: 'error', listener: (err: Error) => void): this;
		on(event: string, listener: (...args: any[]) => void): this;

		once(event: 'ready', listener: () => void): this;
		once(event: 'suspend', listener: () => void): this;
		once(event: 'resume', listener: () => void): this;
		once(event: 'ping', listener: (node: Node, ms: number) => void): this;
		once(event: 'node', listener: (node: Node) => void): this;
		once(event: 'node-failed', listener: (node: Node, reason: string) => void): this;
		once(event: 'node-removed', listener: (node: Node, reason: string) => void): this;
		once(event: 'query', listener: (query: Query) => void): this;
		once(event: 'query-failed', listener: (query: Query, reason: string) => void): this;
		once(event: 'query-finished', listener: (query: Query) => void): this;
		once(event: 'error', listener: (err: Error) => void): this;
		once(event: string, listener: (...args: any[]) => void): this;

		emit(event: 'ready'): boolean;
		emit(event: 'suspend'): boolean;
		emit(event: 'resume'): boolean;
		emit(event: 'ping', node: Node, ms: number): boolean;
		emit(event: 'node', node: Node): boolean;
		emit(event: 'node-failed', node: Node, reason: string): boolean;
		emit(event: 'node-removed', node: Node, reason: string): boolean;
		emit(event: 'query', query: Query): boolean;
		emit(event: 'query-failed', query: Query, reason: string): boolean;
		emit(event: 'query-finished', query: Query): boolean;
		emit(event: 'error', err: Error): boolean;
		emit(event: string, ...args: any[]): boolean;

		off(event: 'ready', listener: () => void): this;
		off(event: 'suspend', listener: () => void): this;
		off(event: 'resume', listener: () => void): this;
		off(event: 'ping', listener: (node: Node, ms: number) => void): this;
		off(event: 'node', listener: (node: Node) => void): this;
		off(event: 'node-failed', listener: (node: Node, reason: string) => void): this;
		off(event: 'node-removed', listener: (node: Node, reason: string) => void): this;
		off(event: 'query', listener: (query: Query) => void): this;
		off(event: 'query-failed', listener: (query: Query, reason: string) => void): this;
		off(event: 'query-finished', listener: (query: Query) => void): this;
		off(event: 'error', listener: (err: Error) => void): this;
		off(event: string, listener: (...args: any[]) => void): this;
	}

	export class Request {
		constructor(io: IO, socket: UDXSocket, tid: number, from: any, to: any, token: Buffer | undefined, internal: boolean, command: number, target: Buffer | undefined, value: Buffer | undefined, session: Session | undefined, ttl: number);

		// Properties
		socket: UDXSocket;
		tid: number;
		from: any; // Define a more specific type if possible
		to: any; // Define a more specific type if possible
		token: Buffer | undefined;
		internal: boolean;
		command: number;
		target: Buffer | undefined;
		value: Buffer | undefined;
		session: Session | undefined;
		ttl: number;
		index: number;
		sent: number;
		retries: number;
		destroyed: boolean;
		oncycle: (req: Request) => void;
		onerror: (err: Error, req: Request) => void;
		onresponse: (res: any, req: Request) => void; // Define a more specific type for res if possible

		// Methods
		reply(value: Buffer | undefined, opts?: any): void; // Define a more specific type for opts if possible
		error(code: number, opts?: any): void; // Define a more specific type for opts if possible
		relay(value: Buffer | undefined, to: any, opts?: any): void; // Define a more specific type for to and opts if possible
		send(force?: boolean): void;
		sendReply(error: number, value: Buffer | undefined, token: boolean, hasCloserNodes: boolean, from: any, socket: UDXSocket, ttl?: number): void; // Define a more specific type for from if possible
		destroy(err?: Error): void;
	}

	export class Query extends ReadableStream {
		constructor(dht: DHT, target: Buffer, internal: boolean, command: number, value: Buffer | undefined, opts?: QueryOptions);

		// Properties
		dht: DHT;
		target: Buffer;
		internal: boolean;
		command: number;
		value: Buffer | undefined;
		errors: number;
		successes: number;
		concurrency: number;
		inflight: number;
		map: (m: any) => any; // Define a more specific type if possible
		maxSlow: number;
		closestReplies: any[]; // Define a more specific type if possible

		// Methods
		finished(): Promise<void>;
	}

	export class Session {
		constructor(dht: DHT);

		// Properties
		dht: DHT;
		inflight: Request[];

		// Methods
		query(query: QueryInput, opts?: QueryOptions): Query;
		request(request: RequestInput, to: Node, opts?: RequestOptions): Promise<void>;
		ping(to: Node, opts?: PingOptions): Promise<void>;
		destroy(err?: Error): void;
	}

	export default DHT;
}
