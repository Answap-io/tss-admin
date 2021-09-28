export default interface IXdrToken {
  hash: string;
  lastModifiedTime: number;
  publicKey: string;
  singleUse: boolean;
  txFunctionHashes: string[];
}
