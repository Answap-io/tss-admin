import Fee from "@/entities/Fee";
import Divisor from "@/entities/Divisor";
import Contract from "@/entities/Contracts/Contract";
import BigNumber from "bignumber.js";

export default class Turret {
  public toml = "";

  public constructor(
    public url: string,
    public turret: string,
    public network: string,
    public horizon: string,
    public runner: string,
    public version: string,
    public fee: Fee,
    public divisor: Divisor
  ) {}

  public static createNull(): Turret {
    return new Turret(
      "",
      "",
      "",
      "",
      "",
      "",
      Fee.createNull(),
      Divisor.createNull()
    );
  }

  public calculateUploadFee(contract: Contract): string {
    return new BigNumber(0)
      .plus(this.calculateContractLengthFee(contract))
      .plus(this.calculateFieldsFee(contract))
      .toFixed(7);
  }

  public calculateContractLengthFee(contract: Contract): number {
    return contract.txFunction.length / Number(this.divisor.upload);
  }

  public calculateFieldsFee(contract: Contract): number {
    const base64 = btoa(JSON.stringify(contract.txFunctionFields));
    const buffer = Buffer.from(base64, "base64");
    return buffer.length / Number(this.divisor.upload);
  }

  public calculateRunFee(): number {
    return Number(this.divisor.run);
  }
}
