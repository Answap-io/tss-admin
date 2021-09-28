import IXdrToken from "@/entities/IXdrToken";
import {
  Account,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import ITurret from "@/entities/ITurret";

export default class XdrToken implements IXdrToken {
  private constructor(
    public hash: string,
    public lastModifiedTime: number,
    public publicKey: string,
    public singleUse: boolean,
    public txFunctionHashes: string[]
  ) {}

  public static createNull(): IXdrToken {
    return new XdrToken("", 0, "", false, []);
  }

  public static async create(
    turret: ITurret,
    keyPair: Keypair,
    isSingleUse: string,
    ttl: number,
    txFunctionHashes: string[]
  ): Promise<string> {
    const privateKeypair = Keypair.fromSecret(keyPair.secret());
    const pk = privateKeypair.publicKey();

    const server = new Server(turret.horizon);

    const tempAcct = new Account(pk, "-1");
    const fee = await server.fetchBaseFee();
    const txBuilder = new TransactionBuilder(tempAcct, {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
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

    tx.sign(privateKeypair);

    return tx.toEnvelope().toXDR("base64");
  }
}
