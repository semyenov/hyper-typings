declare module 'kademlia-routing-table' {
  import { EventEmitter } from 'node:events';
  import { Buffer } from 'node:buffer';

  export class RoutingTable {
    readonly id: Buffer;
    readonly k: number;
    readonly rows: Row[];

    constructor(id: Buffer, opts?: RoutingTable.Options);

    add(node: Node): boolean;
    remove(id: Buffer): boolean;
    get(id: Buffer): Node | null;
    has(id: Buffer): boolean;
    random(): Node | null;
    closest(id: Buffer, k?: number): Node[];
    toArray(): Node[];

    on(event: 'row', listener: (row: Row) => void): this;
  }

  export namespace RoutingTable {
    interface Options {
      k?: number;
    }
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

  export interface Node {
    readonly id: Buffer;
    readonly pinged: number;
    readonly added: number;
  }

  export default RoutingTable;
}
