import Turret from "@/entities/Turret";
import Contract from "@/entities/Contracts/Contract";
import {
  Asset,
  BASE_FEE,
  Keypair,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import { getStellarPassphrase } from "@/helpers/stellarHelper";

export async function getUploadTxXdr(
  turret: Turret,
  secretKey: string,
  contract: Contract
): Promise<string> {
  const server = new Server(turret.horizon);

  const keyPair = Keypair.fromSecret(secretKey);
  const publicKey = keyPair.publicKey();

  const txBuilder = new TransactionBuilder(
    await server.loadAccount(publicKey),
    {
      fee: BASE_FEE,
      networkPassphrase: getStellarPassphrase(turret.network),
    }
  ).addOperation(
    Operation.payment({
      amount: turret.calculateUploadFee(contract),
      asset: Asset.native(),
      destination: turret.turret,
    })
  );

  const tx = txBuilder.setTimeout(60 * 60).build();
  tx.sign(keyPair);

  return tx.toEnvelope().toXDR("base64");
}

export async function uploadContract(
  turret: Turret,
  contract: Contract
): Promise<unknown> {
  const formData = new FormData();

  formData.append("txFunction", contract.txFunction);
  formData.append(
    "txFunctionFields",
    btoa(JSON.stringify(contract.txFunctionFields))
  );
  formData.append("txFunctionFee", contract.txFunctionFee);

  const response = await fetch(turret.url + "/tx-functions", {
    method: "POST",
    body: formData,
  });

  return response.json();
}
