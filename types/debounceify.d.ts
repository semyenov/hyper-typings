declare module 'debounceify' {
  
  export default function debounce(worker: () => Promise<any>, context?: any): () => Promise<any>;
}
