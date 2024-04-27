declare module 'kademlia-routing-table' {
	import {EventEmitter} from 'events';
	import {type Buffer} from 'buffer';

	export class RoutingTable {
		readonly id: Buffer;
		readonly k: number;
		readonly rows: Row[];

		constructor(id: Buffer, opts?: RoutingTable.Options);

		add(node: Node): boolean;
		remove(id: Buffer): boolean;
		get(id: Buffer): Node | undefined;
		has(id: Buffer): boolean;
		random(): Node | undefined;
		closest(id: Buffer, k?: number): Node[];
		toArray(): Node[];

		on(event: 'row', listener: (row: Row) => void): this;
	}

	export namespace RoutingTable {
    type Options = {
    	k?: number;
    };
	}

	export class Row extends EventEmitter {
		readonly data: any;
		readonly index: number;
		readonly table: RoutingTable;
		readonly nodes: Node[];

		on(event: 'add', listener: (node: Node) => void): this;
		on(event: 'remove', listener: (node: Node) => void): this;
		on(event: 'full', listener: (node: Node) => void): this;
	}

	export type Node = {
		readonly id: Buffer;
		readonly pinged: number;
		readonly added: number;
	};

	export default RoutingTable;
}
