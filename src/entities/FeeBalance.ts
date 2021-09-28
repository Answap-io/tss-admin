import IFeeBalance from "@/entities/IFeeBalance";

export default class FeeBalance implements IFeeBalance {
  constructor(
    public balance: number,
    public hash: string,
    public lastModifiedTime: number,
    public publicKey: string,
    public singleUse: boolean,
    public txFunctionHashes: string[]
  ) {}

  public static createNull(): IFeeBalance {
    return new FeeBalance(0, "", 0, "", false, []);
  }
}
