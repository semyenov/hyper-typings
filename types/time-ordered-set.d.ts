declare module 'time-ordered-set' {

	export class TimeOrderedSetItem<T = any> extends T {
		prev: TimeOrderedSetItem | undefined;
		next: TimeOrderedSetItem | undefined;
	}

	export default class TimeOrderedSet {
		oldest: TimeOrderedSetItem | undefined;
		latest: TimeOrderedSetItem | undefined;
		length: number;

		constructor();

		has(node: TimeOrderedSetItem): boolean;
		add<T>(node: T): TimeOrderedSetItem<T>;
		remove<T>(node: T): TimeOrderedSetItem<T>;
		toArray<T = any>(pick?: number): Array<TimeOrderedSetItem<T>>;
	}
}

