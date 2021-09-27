export default interface ITransactionFee {
  balance: number;
  hash: string;
  lastModifiedTime: number;
  publicKey: string;
  singleUse: boolean;
  txFunctionHashes: string[];
}
