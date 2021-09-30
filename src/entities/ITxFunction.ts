import Field from "./Contracts/Field";

export default interface ITxFunction {
  txFunction: string;
  fields: Field[];
  signer: string;
}
