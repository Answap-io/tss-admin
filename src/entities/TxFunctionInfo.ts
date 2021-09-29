import Field from "./Contracts/Field";
import ITxFunctionInfo from "./ITxFunctionInfo";

export default class TxFunctionInfo implements ITxFunctionInfo {
  public constructor(
    public txFunction: string,
    public fields: Field[],
    public signer: string
  ) {}

  public static createNull(): ITxFunctionInfo {
    return new TxFunctionInfo("", [], "");
  }
}
