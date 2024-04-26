declare module 'time-ordered-set' {
  export class TimeOrderedSet {
    oldest: TimeOrderedSetItem | null;
    latest: TimeOrderedSetItem | null;
    length: number;

    constructor();

    has(node: TimeOrderedSetItem): boolean;
    add<T>(node: T): TimeOrderedSetItem<T>;
    remove<T>(node: T): TimeOrderedSetItem<T>;
    toArray<T = any>(pick?: number): TimeOrderedSetItem<T>[];
  }

  export class TimeOrderedSetItem<T = any> extends T {
    prev: TimeOrderedSetItem | null;
    next: TimeOrderedSetItem | null;
  }

  export default TimeOrderedSet;
}

