declare module "time-ordered-set" {
  export class TimeOrderedSetItem<T> {
    prev: TimeOrderedSetItem | undefined;
    next: TimeOrderedSetItem | undefined;
  }

  export default class TimeOrderedSet<T = any> {
    oldest: TimeOrderedSetItem<T> | undefined;
    latest: TimeOrderedSetItem<T> | undefined;
    length: number;

    constructor();

    has(node: TimeOrderedSetItem<T>): boolean;
    add<T>(node: T): TimeOrderedSetItem<T>;
    remove<T>(node: T): TimeOrderedSetItem<T>;
    toArray<T = any>(pick?: number): Array<TimeOrderedSetItem<T>>;
  }
}
