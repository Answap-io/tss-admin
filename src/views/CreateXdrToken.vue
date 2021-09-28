<template>
  <div class="fee-payments">
    <h1 class="text-2xl mb-5">
      Create XDR token for
      <span class="text-sm">{{ $store.getters.keypair.publicKey() }}</span>
    </h1>

    <div>
      <div>
        <XdrTokenForm
          :isLoading="isLoading"
          @createXdrToken="handleXdrTokenCreated"
        />

        <div v-if="xdrToken.hash" class="my-8">
          <strong>Xdr token</strong>
          <br />
          <textarea v-model="xdrTokenRaw" cols="77" rows="3"></textarea>
        </div>

        <FeeBalanceInfo
          v-if="xdrToken.hash !== ''"
          :transaction-fee="xdrToken"
        />

        <JsonTreeView v-if="createXdrTokenError" :json="createXdrTokenError" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";

import IXdrToken from "@/entities/IXdrToken";
import XdrToken from "@/entities/XdrToken";
import FeeBalanceInfo from "@/components/turret/fee-balance/FeeBalanceInfo.vue";
import XdrTokenForm from "@/components/turret/xdr-token/XdrTokenForm.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import JsonTreeView from "@/components/common/JsonTreeView.vue";
import scrollToBottom from "@/helpers/domHelper";

@Options({
  components: {
    FeeBalanceInfo,
    JsonTreeView,
    AppInput,
    XdrTokenForm,
    AppButton,
  },
})
export default class CreateXdrToken extends Vue {
  private xdrToken: IXdrToken = XdrToken.createNull();
  private xdrTokenRaw = "";
  private createXdrTokenError = null;
  private isLoading = false;

  async handleXdrTokenCreated(rawXdrToken: string): Promise<void> {
    this.isLoading = true;
    this.xdrToken = XdrToken.createNull();
    this.xdrTokenRaw = rawXdrToken;
    this.createXdrTokenError = null;
    const turret = this.$store.state.turret;
    const result = await fetch(`${turret.url}/tx-fees`, {
      headers: {
        Authorization: `Bearer ${rawXdrToken}`,
      },
    });

    const txFeeData = await result.json();

    if (!result.ok) {
      this.createXdrTokenError = txFeeData;
    } else {
      this.xdrToken = txFeeData as IXdrToken;
    }

    this.isLoading = false;

    await this.$nextTick(scrollToBottom);
  }
}
</script>

<style src="json-tree-view/devtools.css"></style>
