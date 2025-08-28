export interface ISoapClient {
  call(method: string, payload: any): Promise<string>; // returns XML string or library result
}
