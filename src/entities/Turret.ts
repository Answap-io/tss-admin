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
    const functionBuffer = Buffer.from(contract.txFunction);
    const fieldsBuffer = Buffer.from(
      JSON.stringify(contract.txFunctionFields),
      "base64"
    );

    const concatenatedBuffer = Buffer.concat([functionBuffer, fieldsBuffer]);
    return concatenatedBuffer.length / Number(this.divisor.upload);
  }

  public calculateRunFee(): number {
    return Number(this.divisor.run);
  }
}
