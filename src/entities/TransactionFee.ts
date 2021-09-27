import ITransactionFee from "@/entities/ITransactionFee";

export default class TransactionFee implements ITransactionFee {
  constructor(
    public balance: number,
    public hash: string,
    public lastModifiedTime: number,
    public publicKey: string,
    public singleUse: boolean,
    public txFunctionHashes: string[]
  ) {}

  public static createNull(): ITransactionFee {
    return new TransactionFee(0, "", 0, "", false, []);
  }
}
