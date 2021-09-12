import Field from "@/entities/Contracts/Field";

export default class Contract {
  public constructor(
    public txFunction: string,
    public txFunctionFields: Field[],
    public txFunctionFee: string
  ) {}

  public static createNull(): Contract {
    return new Contract("", [], "");
  }
}
