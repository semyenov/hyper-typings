declare module 'ready-resource' {
  export default class ReadyResource {
    ready(): Promise<void>;
    close(): Promise<void>;
  }
}
