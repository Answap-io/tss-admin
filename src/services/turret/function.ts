import Turret from "@/entities/Turret";

export async function getTxFunction(
  turret: Turret,
  txFunctionHash: string
): Promise<unknown> {
  const response = await fetch(turret.url + "/tx-functions/" + txFunctionHash);

  if (!response.ok) {
    throw new Error(await response.json());
  }

  return response.json();
}
