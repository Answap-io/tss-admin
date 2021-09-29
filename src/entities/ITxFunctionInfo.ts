import Field from "./Contracts/Field";

export default interface ITxFunctionInfo {
  txFunction: string;
  fields: Field[];
  signer: string;
}
