declare module 'signal-promise' {
  
  export class Signal {
    private _resolve: Function | null;
    private _reject: Function | null;
    private _promise: Promise<any> | null;
    private _bind: Function;
    private _onerror: Function;
    private _onsuccess: Function;
    private _timers: Set<any>;
  
    
    constructor();

    wait(max?: number): Promise<any>;
    notify(err?: Error): void;
  
    private _sleep(max: number): Promise<boolean>;
  }
  
  export function clear(this: Signal, err?: Error): void;
  export function bind(this: Signal, resolve: Function, reject: Function): void;
  }
