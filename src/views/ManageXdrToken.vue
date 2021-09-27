<template>
  <div class="fee-payments">
    <h1 class="text-2xl mb-5">Manage XDR Token</h1>

    <div class="grid grid-cols-2 gap-x-8">
      <div>
        <h2 class="text-2xl mb-5">Fetch an existing XDR token</h2>
        <AppInput v-model="existingXdrToken" label="XDR Token" />
        <AppButton @click="() => fetchTransactionFee(false)">Fetch</AppButton>

        <TransactionFeeInfo
          v-if="existingTxFee.hash !== ''"
          :transaction-fee="existingTxFee"
          @fund="(amount) => handlePayment(true, this.existingXdrToken, amount)"
        />
      </div>

      <div>
        <h2 class="text-2xl mb-5">
          Create/Update XDR token for
          <span class="text-sm">{{ $store.getters.keypair.publicKey() }}</span>
        </h2>
        <XdrTokenForm @createXdrToken="handleXdrTokenCreated" />

        <div v-if="newTxFee.hash" class="my-8">
          <strong>Xdr token</strong>
          <br />
          <textarea v-model="xdrToken" cols="77" rows="3"></textarea>
        </div>

        <TransactionFeeInfo
          v-if="newTxFee.hash !== ''"
          :transaction-fee="newTxFee"
          @fund="(amount) => handlePayment(false, this.xdrToken, amount)"
        />
      </div>
      <div>
        <pre ref="payment-result-json-viewer"></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";

import ITransactionFee from "@/entities/ITransactionFee";
import TransactionFee from "@/entities/TransactionFee";
import TransactionFeeInfo from "@/components/turret/functions/TransactionFeeInfo.vue";
import XdrTokenForm from "@/components/turret/functions/XdrTokenForm.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import {
  Asset,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONTreeView = require("json-tree-view");

@Options({
  components: { AppInput, XdrTokenForm, TransactionFeeInfo, AppButton },
})
export default class ManageXdrToken extends Vue {
  private existingTxFee: ITransactionFee = TransactionFee.createNull();
  private newTxFee: ITransactionFee = TransactionFee.createNull();
  private xdrToken = "";
  private existingXdrToken = "";

  async handleXdrTokenCreated(xdrToken: string): Promise<void> {
    this.xdrToken = xdrToken;
    const turret = this.$store.state.turret;
    const result = await fetch(`${turret.url}/tx-fees`, {
      headers: {
        Authorization: `Bearer ${xdrToken}`,
      },
    });

    this.newTxFee = (await result.json()) as ITransactionFee;
  }

  async fetchTransactionFee(isNew: boolean, xdrToken?: string): Promise<void> {
    const turret = this.$store.state.turret;
    const result = await fetch(`${turret.url}/tx-fees`, {
      headers: {
        Authorization: `Bearer ${xdrToken ?? this.existingXdrToken}`,
      },
    });

    const txFeeResult = (await result.json()) as ITransactionFee;
    isNew ? (this.newTxFee = txFeeResult) : (this.existingTxFee = txFeeResult);
  }

  async handlePayment(
    isNew: boolean,
    xdrToken: string,
    amount: string
  ): Promise<void> {
    const turret = this.$store.state.turret;
    const privateKeypair = Keypair.fromSecret(this.$store.state.privateKey);
    const pk = privateKeypair.publicKey();

    const server = new Server(turret.horizon);

    const fee = await server.fetchBaseFee();
    const txBuilder = new TransactionBuilder(await server.loadAccount(pk), {
      fee: fee.toString(),
      networkPassphrase: Networks.TESTNET,
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
    tx.sign(privateKeypair);

    const result = await fetch(`${turret.url}/tx-fees/${pk}`, {
      method: "POST",
      body: JSON.stringify({
        txFunctionFee: tx.toXDR(),
      }),
    });

    const payment = await result.json();

    const treeView = new JSONTreeView(
      "txFunctionFee",
      JSON.parse(JSON.stringify(payment))
    );

    const ref = this.$refs["payment-result-json-viewer"] as HTMLElement;
    ref.innerHTML = "";
    ref.appendChild(treeView.dom);

    await this.fetchTransactionFee(isNew, xdrToken);
  }
}
</script>

<style src="json-tree-view/devtools.css"></style>
