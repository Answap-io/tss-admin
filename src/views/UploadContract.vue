<template>
  <div class="upload-contract grid">
    <Card>
      Upload contract
      <div class="grid grid-cols-2">
        <TurretFields @fields-updated="handleFieldsUpdated" />
        <TurretContract :turret="turret" @loaded="handleContractCodeLoaded" />
      </div>
    </Card>
    <Card>
      <div id="contract-info">
        <div class="mb-5">
          <p>
            Byte length:<strong>{{ this.contract.txFunction.length }}</strong>
          </p>
          <p>
            fields upload fee:
            <strong>{{ fieldsFee }}</strong>
          </p>
          <p>
            contract length fee:
            <strong>{{ contractLengthFee }}</strong>
          </p>
          <p>
            total upload fee:
            <strong>{{ uploadFee }}</strong>
          </p>
          <p>txFunctionFee transaction xdr</p>
          <textarea v-model="txFunctionFee"></textarea>
          <button @click.prevent="handleUploadTx">Get</button>
        </div>

        <button @click="upload">Upload</button>
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

@Options({
  components: {
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
          this.uploadFee = this.turret
            .calculateUploadFee(this.contract)
            .toFixed(7);

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
  private txFunctionFee = "";

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
    this.contract.txFunctionFee = this.txFunctionFee = await getUploadTxXdr(
      this.turret,
      this.$store.state.privateKey,
      this.contract
    );
  }

  upload(): void {
    uploadContract(this.turret, this.contract);
  }
}
</script>
