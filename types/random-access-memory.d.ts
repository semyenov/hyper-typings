// random-access-memory.d.ts

declare module 'random-access-memory' {
  import { RandomAccessStorage } from 'random-access-storage';
 
  export default class RAM extends RandomAccessStorage {
     toBuffer(): Buffer;
     clone(): RAM;
     static reusable(): RAM;
  }
 }
