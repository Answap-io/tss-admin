import { Networks } from "stellar-sdk";

export function getStellarPassphrase(network: string): Networks {
  switch (network) {
    case "TESTNET":
      return Networks.TESTNET;
    case "PUBLIC":
      return Networks.PUBLIC;
    default:
      throw new Error(`Unknown network ${network}`);
  }
}
