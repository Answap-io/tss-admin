<template>
  <div>
    <h1 class="text-2xl mb-5">View and run functions</h1>
    <Card>
      <AppInput v-model="txFunctionHash" label="Function hash" />
      <AppButton @click="getTxFunction">Fetch</AppButton>

      <div v-if="txFunction.txFunction">
        <p class="mt-4 font-bold">TxFunction fields</p>
        <TurretFieldsTable
          :fields="txFunction.fields"
          :showActions="false"
        ></TurretFieldsTable>
        <p class="mt-10"><strong>Signer:</strong> {{ txFunction.signer }}</p>

        <p class="mt-4 font-bold">TxFunction code</p>
        <pre>{{ txFunction.txFunction }}</pre>
      </div>
      <p v-if="getTxFunctionError">{{ getTxFunctionError }}</p>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import Card from "@/components/common/Card.vue";
import { getTxFunction } from "@/services/turret/function";
import TxFunction from "@/entities/TxFunction";
import JsonTreeView from "@/components/common/JsonTreeView.vue";
import TurretFieldsTable from "@/components/turret/contracts/TurretFieldsTable.vue";

@Options({
  components: {
    TurretFieldsTable,
    AppButton,
    AppInput,
    Card,
    JsonTreeView,
  },
})
export default class TxFunctions extends Vue {
  private txFunctionHash = "";
  private txFunction = TxFunction.createNull();
  private getTxFunctionError = "";

  async getTxFunction(): Promise<void> {
    this.getTxFunctionError = "";
    const turret = this.$store.state.turret;
    try {
      this.txFunction = await getTxFunction(turret, this.txFunctionHash);
    } catch (error) {
      console.error(error);
      this.getTxFunctionError = error;
    }
  }
}
</script>
