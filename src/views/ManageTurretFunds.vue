<template>
  <div class="fee-payments">
    <h1 class="text-2xl mb-5">Manage Turret funds</h1>

    <div class="grid grid-cols-2 gap-10">
      <div>
        <h2 class="text-2xl mb-5">View Fee Balance</h2>
        <AppInput v-model="xdrToken" label="XDR Token" />
        <p class="mb-5 text-sm">
          <router-link class="underline text-blue-500" to="/xdr-token">
            Create an XDR token
          </router-link>
          or
          <a
            class="underline text-blue-500"
            href="#"
            @click.prevent="createXdr"
          >
            {{
              isCreatingXdr
                ? "creating..."
                : `get a global XDR token for ${$store.getters.keypair.publicKey()} (expires in an hour)`
            }}
          </a>
        </p>
        <AppButton @click="() => fetchTransactionFee()"
          >{{ isFetching ? "Loading..." : "Fetch" }}
        </AppButton>

        <JsonTreeView v-if="fetchError" :json="fetchError" />
      </div>
      <div>
        <form @submit.prevent="() => {}">
          <AppInput v-model="publicKeyToFund" label="Public key to fund" />
          <a
            class="blue-500 underline"
            href="#"
            @click.prevent="
              publicKeyToFund = $store.getters.keypair.publicKey()
            "
          >
            Use {{ $store.getters.keypair.publicKey() }}
          </a>

          <div class="mt-5">
            <AppButton
              class="mr-4"
              @click.prevent="
                () => handleFundingPublicKey($store.state.turret.fee.min)
              "
            >
              {{
                isProcessingPayment
                  ? "Loading..."
                  : `Fund Min (${$store.state.turret.fee.min} XLM)`
              }}
            </AppButton>
            <AppButton
              @click.prevent="
                () => handleFundingPublicKey($store.state.turret.fee.max)
              "
            >
              {{
                isProcessingPayment
                  ? "Loading..."
                  : `Fund max (${$store.state.turret.fee.max} XLM)`
              }}
            </AppButton>

            <PaymentInfo :json="paymentResult" v-if="paymentResult" />
          </div>
        </form>
      </div>
    </div>
    <FeeBalanceInfo
      v-if="feeBalance.hash"
      :is-loading="isProcessingPayment"
      :show-actions="true"
      :transaction-fee="feeBalance"
      @fund="(amount) => handleFundingFromFeeBalanceInfo(this.xdrToken, amount)"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";

import FeeBalanceInfo from "@/components/turret/fee-balance/FeeBalanceInfo.vue";
import XdrTokenForm from "@/components/turret/xdr-token/XdrTokenForm.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import JsonTreeView from "@/components/common/JsonTreeView.vue";
import PaymentInfo from "@/components/turret/payment/PaymentInfo.vue"
import scrollToBottom from "@/helpers/domHelper";
import IFeeBalance from "@/entities/IFeeBalance";
import FeeBalance from "@/entities/FeeBalance";
import {
  fundTurret,
  generateXdr,
  getFeeBalance,
} from "@/services/turret/turret";

@Options({
  components: {
    FeeBalanceInfo,
    JsonTreeView,
    AppInput,
    XdrTokenForm,
    AppButton,
    PaymentInfo,
  },
})
export default class ManageTurretFunds extends Vue {
  private feeBalance: IFeeBalance = FeeBalance.createNull();
  private xdrToken = "";
  private paymentResult = null as unknown;
  private fetchError = null;
  private isFetching = false;
  private isCreatingXdr = false;
  private isProcessingPayment = false;
  private publicKeyToFund = "";

  async createXdr(): Promise<void> {
    try {
      const turret = this.$store.state.turret;
      const keyPair = this.$store.getters.keypair;
      this.isCreatingXdr = true;
      this.xdrToken = await generateXdr(turret, keyPair, "true", 3600, []);
      await this.fetchTransactionFee();
    } catch (e) {
      console.error(e);
    } finally {
      this.isCreatingXdr = false;
    }
  }

  async fetchTransactionFee(xdrToken?: string): Promise<void> {
    this.isFetching = true;
    this.fetchError = null;
    this.feeBalance = FeeBalance.createNull();

    const turret = this.$store.state.turret;
    try {
      this.feeBalance = await getFeeBalance(turret, xdrToken ?? this.xdrToken);
    } catch (e) {
      console.error(e);
      this.fetchError = e;
    }

    this.isFetching = false;
    await this.$nextTick(scrollToBottom);
  }

  async handleFundingFromFeeBalanceInfo(
    xdrToken: string,
    amount: string
  ): Promise<void> {
    this.isProcessingPayment = true;
    const kp = this.$store.getters.keypair;
    const turret = this.$store.state.turret;
    this.paymentResult = await fundTurret(turret, kp.publicKey(), kp, amount);
    await this.fetchTransactionFee(xdrToken);
    this.isProcessingPayment = false;
  }

  async handleFundingPublicKey(amount: string): Promise<void> {
    this.isProcessingPayment = true;

    this.paymentResult = await fundTurret(
      this.$store.state.turret,
      this.publicKeyToFund,
      this.$store.getters.keypair,
      amount
    );

    this.isProcessingPayment = false;
  }
}
</script>

<style src="json-tree-view/devtools.css"></style>
