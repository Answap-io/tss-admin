import Turret from "@/entities/Turret";
import ITxFunction from "@/entities/ITxFunction";
import TurretHttpError from "@/errors/TurretHttpError";
import { getStellarPassphrase } from "@/helpers/stellarHelper";
import { Transaction } from "stellar-sdk";

export async function getTxFunction(
  turret: Turret,
  txFunctionHash: string
): Promise<ITxFunction> {
  const response = await fetch(`${turret.url}/tx-functions/${txFunctionHash}`);

  if (!response.ok) {
    throw new TurretHttpError(await response.text());
  }

  const tmpFunction = await response.json();
  tmpFunction.txFunction = tmpFunction.function;
  delete tmpFunction.function;

  return tmpFunction as Promise<ITxFunction>;
}

export async function runTxFunction(
  turretsUrl: string[],
  txFunctionHash: string,
  txFunctionParams: Record<string, string>,
  xdrToken: string,
  network: string
): Promise<string> {
  const fetchTxFunctions = turretsUrl.map((turretUrl) =>
    fetch(`${turretUrl}/tx-functions/${txFunctionHash}`, {
      method: "POST",
      body: JSON.stringify(txFunctionParams),
      headers: {
        Authorization: `Bearer ${xdrToken}`,
      },
    }).then((r) => r.json())
  );

  const xdrs = await Promise.all(fetchTxFunctions);

  try {
    const transaction = new Transaction(
      xdrs[0].xdr,
      getStellarPassphrase(network)
    );
    xdrs.forEach((xdr) => {
      transaction.addSignature(xdr.signer, xdr.signature);
    });
    return transaction.toXDR();
  } catch (e) {
    throw new TurretHttpError(JSON.stringify(xdrs));
  }
}
