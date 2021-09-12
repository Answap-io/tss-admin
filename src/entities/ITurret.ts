import Fee from "@/entities/Fee";
import Divisor from "@/entities/Divisor";

export default interface ITurret {
  url: string;
  turret: string;
  network: string;
  horizon: string;
  runner: string;
  version: string;
  fee: Fee;
  divisor: Divisor;
  toml: string;
}
