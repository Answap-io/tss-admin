<template>
  <div class="fee-payments">
    <h1 class="text-2xl mb-5">Manage Turret funds</h1>

    <h2 class="text-2xl mb-5">View Fee Balance</h2>
    <AppInput v-model="xdrToken" label="XDR Token" />
    <p class="mb-5 text-sm">
      <router-link class="underline text-blue-500" to="/xdr-token">
        Create an XDR token
      </router-link>
      or
      <a class="underline text-blue-500" href="#" @click.prevent="createXdr">
        {{
          isCreatingXdr
            ? "creating..."
            : `get a global XDR token for ${$store.getters.keypair.publicKey()} (expires in an hour)`
        }}
      </a>
    </p>
    <AppButton @click="() => fetchTransactionFee(false)"
      >{{ isFetching ? "Loading..." : "Fetch" }}
    </AppButton>

    <JsonTreeView :json="fetchError" v-if="fetchError" />

    <FeeBalanceInfo
      v-if="feeBalance.hash"
      :is-loading="isProcessingPayment"
      :show-actions="true"
      :transaction-fee="feeBalance"
      @fund="(amount) => handlePayment(true, this.xdrToken, amount)"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";

import FeeBalanceInfo from "@/components/turret/fee-balance/FeeBalanceInfo.vue";
import XdrTokenForm from "@/components/turret/xdr-token/XdrTokenForm.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import {
  Asset,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import JsonTreeView from "@/components/common/JsonTreeView.vue";
import scrollToBottom from "@/helpers/domHelper";
import IFeeBalance from "@/entities/IFeeBalance";
import FeeBalance from "@/entities/FeeBalance";
import XdrToken from "@/entities/XdrToken";

@Options({
  components: {
    FeeBalanceInfo,
    JsonTreeView,
    AppInput,
    XdrTokenForm,
    AppButton,
  },
})
export default class ManageTurretFunds extends Vue {
  private feeBalance: IFeeBalance = FeeBalance.createNull();
  private xdrToken = "";
  private paymentResult = null;
  private fetchError = null;
  private isFetching = false;
  private isCreatingXdr = false;
  private isProcessingPayment = false;

  async createXdr(): Promise<void> {
    try {
      const turret = this.$store.state.turret;
      const keyPair = this.$store.getters.keypair;
      this.isCreatingXdr = true;
      this.xdrToken = await XdrToken.create(turret, keyPair, "true", 3600, []);
    } catch (e) {
      console.error(e);
    } finally {
      this.isCreatingXdr = false;
    }
  }

  async fetchTransactionFee(isNew: boolean, xdrToken?: string): Promise<void> {
    this.isFetching = true;
    this.fetchError = null;
    this.feeBalance = FeeBalance.createNull();

    const turret = this.$store.state.turret;
    const result = await fetch(`${turret.url}/tx-fees`, {
      headers: {
        Authorization: `Bearer ${xdrToken ?? this.xdrToken}`,
      },
    });

    if (result.ok) {
      this.feeBalance = (await result.json()) as IFeeBalance;
    } else {
      this.fetchError = await result.json();
    }

    this.isFetching = false;

    await this.$nextTick(scrollToBottom);
  }

  async handlePayment(
    isNew: boolean,
    xdrToken: string,
    amount: string
  ): Promise<void> {
    this.isProcessingPayment = true;
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

    this.paymentResult = await result.json();

    await this.fetchTransactionFee(isNew, xdrToken);
    this.isProcessingPayment = false;
  }
}
</script>

<style src="json-tree-view/devtools.css"></style>
