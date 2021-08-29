import Fee from "@/entities/Fee";
import Divisor from "@/entities/Divisor";

export default class Turret {
  public constructor(
    public turret: string,
    public network: string,
    public horizon: string,
    public runner: string,
    public version: string,
    public fee: Fee,
    public divisor: Divisor
  ) {
  }

  public static createNull(): Turret {
    return new Turret(
      "",
      "",
      "",
      "",
      "",
      Fee.createNull(),
      Divisor.createNull()
    );
  }
}
