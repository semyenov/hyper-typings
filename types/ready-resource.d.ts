declare module 'ready-resource' {
	import {EventEmitter} from 'events';
    
	export default class ReadyResource extends EventEmitter {
		opening: Promise<void> | undefined;
		closing: Promise<void> | undefined;
		opened: boolean;
		closed: boolean;
    
		constructor();
    
		ready(): Promise<void>;
		close(): Promise<void>;
    
		protected _open(): Promise<void>;
		protected _close(): Promise<void>;
	}
}