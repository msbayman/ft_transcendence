declare module '*.js' {
    const content: any;
    export default content;
  }
  
  export interface Config {
    HOST_URL: string;
    WS_HOST_URL: string;
  }
  
  declare const config: Config;
  export { config };