import Turret from "@/entities/Turret";
import ITxFunction from "@/entities/ITxFunction";

export async function getTxFunction(
  turret: Turret,
  txFunctionHash: string
): Promise<ITxFunction> {
  const response = await fetch(`${turret.url}/tx-functions/${txFunctionHash}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const tmpFunction = await response.json();
  tmpFunction.txFunction = tmpFunction.function;
  delete tmpFunction.function;

  return tmpFunction as Promise<ITxFunction>;
}
