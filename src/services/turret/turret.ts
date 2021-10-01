import Turret from "@/entities/Turret";
import mapTurret from "@/mappers/turretMapper";
import ITurret from "@/entities/ITurret";
import {
  Account,
  Asset,
  Keypair,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import IFeeBalance from "@/entities/IFeeBalance";
import { getStellarPassphrase } from "@/helpers/stellarHelper";
import IPayment from "@/entities/IPayment";
import TurretHttpError from "@/errors/TurretHttpError";

export async function getTurret(url: string): Promise<Turret> {
  const responses = await Promise.all([
    fetch(url),
    fetch(`${url}/.well-known/stellar.toml`),
  ]);

  const [turretResponse, tomlResponse] = responses;

  const turret = mapTurret(await turretResponse.json(), url);
  turret.toml = await tomlResponse.text();

  return turret;
}

export async function generateXdr(
  turret: ITurret,
  keyPair: Keypair,
  isSingleUse: string,
  ttl: number,
  txFunctionHashes: string[]
): Promise<string> {
  const pk = keyPair.publicKey();
  const server = new Server(turret.horizon);
  const fee = await server.fetchBaseFee();

  const txBuilder = new TransactionBuilder(new Account(pk, "-1"), {
    fee: fee.toString(),
    networkPassphrase: getStellarPassphrase(turret.network),
  });

  for (const hash of txFunctionHashes) {
    txBuilder.addOperation(
      Operation.manageData({
        name: "txFunctionHash",
        value: hash,
      })
    );
  }

  txBuilder.addOperation(
    Operation.manageData({
      name: "singleUse",
      value: isSingleUse,
    })
  );

  const tx = txBuilder.setTimeout(ttl).build();

  tx.sign(keyPair);
  return tx.toEnvelope().toXDR("base64");
}

export async function fundTurret(
  turret: Turret,
  fundedKeyPair: string,
  fundingKeyPair: Keypair,
  amount: string
): Promise<IPayment> {
  const pk = fundingKeyPair.publicKey();
  const server = new Server(turret.horizon);

  const fee = await server.fetchBaseFee();
  const txBuilder = new TransactionBuilder(await server.loadAccount(pk), {
    fee: fee.toString(),
    networkPassphrase: getStellarPassphrase(turret.network),
  });

  txBuilder.addOperation(
    Operation.payment({
      source: pk,
      asset: Asset.native(),
      amount: amount,
      destination: turret.turret,
    })
  );

  const tx = txBuilder.setTimeout(60).build();
  tx.sign(fundingKeyPair);

  const result = await fetch(`${turret.url}/tx-fees/${fundedKeyPair}`, {
    method: "POST",
    body: JSON.stringify({
      txFunctionFee: tx.toXDR(),
    }),
  });

  if (!result.ok) {
    throw new TurretHttpError(await result.text());
  }

  return (await result.json()) as Promise<IPayment>;
}

export async function getFeeBalance(
  turret: Turret,
  xdrToken: string
): Promise<IFeeBalance> {
  const result = await fetch(`${turret.url}/tx-fees`, {
    headers: {
      Authorization: `Bearer ${xdrToken}`,
    },
  });

  if (!result.ok) {
    throw new TurretHttpError(await result.text());
  }

  return (await result.json()) as IFeeBalance;
}
