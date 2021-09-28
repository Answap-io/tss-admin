import IXdrToken from "@/entities/IXdrToken";

export default interface IFeeBalance extends IXdrToken {
  balance: number;
}
