declare module "mutexify/promise" {
  export default function mutexify(): () => Promise<() => void>;
}
