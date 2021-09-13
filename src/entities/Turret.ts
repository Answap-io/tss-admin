import Fee from "@/entities/Fee";
import Divisor from "@/entities/Divisor";
import Contract from "@/entities/Contracts/Contract";

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

  public calculateUploadFee(contract: Contract): number {
    return (
      this.calculateContractLengthFee(contract) +
      this.calculateFieldsFee(contract)
    );
  }

  public calculateContractLengthFee(contract: Contract): number {
    const functionBuffer = Buffer.from(contract.txFunction);
    return functionBuffer.length / Number(this.divisor.upload);
  }

  public calculateFieldsFee(contract: Contract): number {
    const fieldsBuffer = Buffer.from(
      JSON.stringify(contract.txFunctionFields),
      "base64"
    );

    return fieldsBuffer.length / Number(this.divisor.upload);
  }

  public calculateRunFee(): number {
    return Number(this.divisor.run);
  }
}
