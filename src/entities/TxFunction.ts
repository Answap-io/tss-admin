import Field from "./Contracts/Field";
import ITxFunction from "./ITxFunction";

export default class TxFunction implements ITxFunction {
  public constructor(
    public txFunction: string,
    public fields: Field[],
    public signer: string
  ) {}

  public static createNull(): ITxFunction {
    return new TxFunction("", [], "");
  }
}
