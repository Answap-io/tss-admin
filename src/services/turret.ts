import {
  Account,
  Asset,
  BASE_FEE,
  Claimant,
  Keypair,
  Networks,
  Operation,
  Server,
  Transaction,
  TransactionBuilder,
} from "stellar-sdk";
import Turret from "@/entities/Turret";
import mapTurret from "@/mappers/turretMapper";
import Contract from "@/entities/Contracts/Contract";

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

async function createClaimableBalanceTx(
  turret: Turret,
  keyPair: Keypair
): Promise<Transaction> {
  const server = new Server(turret.horizon);
  const asset = Asset.native();

  const amount = turret.fee.min;
  const claimants = [
    new Claimant(turret.turret, Claimant.predicateUnconditional()),
  ];

  const op = Operation.createClaimableBalance({
    asset,
    amount,
    claimants,
  });

  const account = await server.loadAccount(keyPair.publicKey());

  return new TransactionBuilder(account)
    .addOperation(op)
    .setTimeout(60)
    .build();
}

export async function createRunAuthToken(
  turret: Turret,
  keyPair: Keypair
): Promise<string> {
  const server = new Server(turret.horizon);
  const claimableBalanceTx = await createClaimableBalanceTx(turret, keyPair);
  claimableBalanceTx.sign(keyPair);

  await server.submitTransaction(claimableBalanceTx);

  const claimableBalances = await server
    .claimableBalances()
    .claimant(turret.turret)
    .order("desc")
    .limit(1)
    .call();

  const claimableBalanceId = claimableBalances.records.pop()?.id;
  if (!claimableBalanceId) {
    throw new Error("No claimable balance id found");
  }

  const publicKey = keyPair.publicKey();
  const tempAcct = await new Account(publicKey, "-1");

  const txBuilder = new TransactionBuilder(tempAcct).addOperation(
    Operation.claimClaimableBalance({
      balanceId: claimableBalanceId,
      source: publicKey,
    })
  );

  const tx = txBuilder.setTimeout(60 * 60).build();
  tx.sign(keyPair);

  return tx.toEnvelope().toXDR("base64");
}

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
      networkPassphrase: Networks.TESTNET,
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
