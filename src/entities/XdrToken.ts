import IXdrToken from "@/entities/IXdrToken";

export default class XdrToken implements IXdrToken {
  private constructor(
    public hash: string,
    public lastModifiedTime: number,
    public publicKey: string,
    public singleUse: boolean,
    public txFunctionHashes: string[]
  ) {}

  public static createNull(): IXdrToken {
    return new XdrToken("", 0, "", false, []);
  }
}
