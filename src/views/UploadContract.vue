<template>
  <div class="upload-contract grid">
    <Card>
      <div>
        <TurretFields @fields-updated="handleFieldsUpdated" />
        <TurretContract :turret="turret" @loaded="handleContractCodeLoaded" />
      </div>
    </Card>
    <Card>
      <div id="contract-info">
        <div class="mb-5">
          <div class="mb-10">
            <p>
              Byte length:<strong>{{ this.contract.txFunction.length }}</strong>
            </p>
            <p>
              Fields fee:
              <strong>{{ fieldsFee }}</strong>
            </p>
            <p>
              Contract length fee:
              <strong>{{ contractLengthFee }}</strong>
            </p>
            <p>
              Total upload fee:
              <strong>{{ uploadFee }}</strong>
            </p>
          </div>
          <AppButton @click.prevent="handleUploadTx">
            {{ isLoading ? "Loading..." : "Get Function Fee XDR" }}
          </AppButton>
          <p class="mt-10">txFunctionFee transaction XDR:</p>
          <textarea
            v-model="txFunctionFeeXdr"
            class="border-2 border-blue-100"
            cols="80"
            rows="4"
          ></textarea>

          <pre ref="tx-function-json-viewer"></pre>
        </div>

        <AppButton v-if="txFunctionFeeXdr" @click="upload">
          {{ isUploading ? "Uploading..." : "Upload" }}
        </AppButton>

        <pre>{{ uploadResponse }}</pre>

        <p class="mt-4 font-bold">Contract code</p>
        <pre class="overflow-hidden overflow-clip">
          {{ contract.txFunction }}
        </pre>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TurretForm from "@/components/turret/TurretForm.vue";
import Turret from "@/entities/Turret"; // @ is an alias to /src
import Card from "@/components/common/Card.vue";
import TurretFields from "@/components/turret/contracts/TurretFields.vue";
import TurretContract from "@/components/turret/contracts/TurretContract.vue";
import Contract from "@/entities/Contracts/Contract";
import { getUploadTxXdr, uploadContract } from "@/services/turret";
import Field from "@/entities/Contracts/Field";
import AppButton from "@/components/common/AppButton.vue";
import { Transaction } from "stellar-sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONTreeView = require("json-tree-view");

@Options({
  components: {
    AppButton,
    TurretContract,
    TurretFields,
    TurretForm,
    Card,
  },
  watch: {
    contract: {
      deep: true,
      handler() {
        if (this.turret.turret !== "") {
          this.uploadFee = this.turret.calculateUploadFee(this.contract);

          this.fieldsFee = this.turret
            .calculateFieldsFee(this.contract)
            .toFixed(7);

          this.contractLengthFee = this.turret
            .calculateContractLengthFee(this.contract)
            .toFixed(7);
        } else {
          return "0";
        }
      },
    },
  },
})
export default class UploadContract extends Vue {
  private turret: Turret = new Proxy<Turret>(Turret.createNull(), {});
  private contract: Contract = Contract.createNull();
  private uploadFee = "0";
  private contractLengthFee = "0";
  private fieldsFee = "0";
  private txFunctionFeeXdr = "";
  private isLoading = false;
  private isUploading = false;
  private uploadResponse = "";

  created(): void {
    this.turret = this.$store.state.turret;
  }

  handleContractCodeLoaded(contractCode: string): void {
    this.contract.txFunction = contractCode;
  }

  handleFieldsUpdated(fields: Field[]): void {
    this.contract.txFunctionFields = fields;
  }

  async handleUploadTx(): Promise<void> {
    this.isLoading = true;
    this.contract.txFunctionFee = this.txFunctionFeeXdr = await getUploadTxXdr(
      this.turret,
      this.$store.state.privateKey,
      this.contract
    );

    const tx = new Transaction(
      this.contract.txFunctionFee,
      this.turret.network
    );
    const treeView = new JSONTreeView(
      "txFunctionFee",
      JSON.parse(JSON.stringify(tx))
    );
    const ref = this.$refs["tx-function-json-viewer"] as HTMLElement;
    ref.innerHTML = "";
    ref.appendChild(treeView.dom);

    this.isLoading = false;
  }

  async upload(): Promise<void> {
    this.isUploading = true;
    this.uploadResponse = await uploadContract(this.turret, this.contract);
    this.isUploading = false;
  }
}
</script>

<style src="json-tree-view/devtools.css"></style>
