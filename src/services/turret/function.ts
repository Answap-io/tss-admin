import Turret from "@/entities/Turret";

export async function getTxFunction(
  turret: Turret,
  txFunctionHash: string
): Promise<unknown> {
  const response = await fetch(`${turret.url}/tx-functions/${txFunctionHash}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json);
  }

  return json;
}
