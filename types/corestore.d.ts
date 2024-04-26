declare module 'corestore' {
  import { Buffer } from 'node:buffer';
  import { RandomAccessStorage } from 'random-access-storage';
  import ReadyResource from 'ready-resource';
  import Hypercore from 'hypercore';

  export class Corestore extends ReadyResource {
    constructor(storage: RandomAccessStorage | string | ((path: string) => RandomAccessStorage), options?: CorestoreOptions);

    get(key: Buffer | { key: Buffer | string, name?: string, exclusive?: boolean, [options: string]: any }): Hypercore;
    replicate(options: ReplicationOptions | any): any;
    namespace(name: string): Corestore;
    session(options?: SessionOptions): Corestore;
  }

  // Define the Corestore options interfaces
  export interface CorestoreOptions {
    primaryKey?: Buffer;
  }

  export interface ReplicationOptions {
    // Define replication options here
  }

  export interface SessionOptions {
    primaryKey?: Buffer;
    namespace?: Buffer;
  }

  export default Corestore;
}
