declare module "mutexify" {
  export default function mutexifyPromise(): {
      (): Promise<void>;
      locked: boolean;
  }
}
