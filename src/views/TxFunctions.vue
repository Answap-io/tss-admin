<template>
  <div>
    <h1 class="text-2xl mb-5">View and run functions</h1>
    <Card>
      <AppInput v-model="txFunctionHash" label="Function hash" />
      <AppButton @click="getTxFunction">{{
        isFetching ? "Fetching..." : "Fetch"
      }}</AppButton>

      <div v-if="txFunction.txFunction">
        <p class="mt-4 font-bold">TxFunction fields</p>
        <TurretFieldsTable
          :fields="txFunction.fields"
          :showActions="false"
        ></TurretFieldsTable>
        <p class="mt-10"><strong>Signer:</strong> {{ txFunction.signer }}</p>
      </div>
      <p v-if="getTxFunctionError">{{ getTxFunctionError }}</p>
    </Card>
    <Card v-if="txFunction.txFunction">
      <div v-for="field in txFunction.fields" id="fields" :key="field">
        <AppInput
          v-model="txFunctionRunParams[field.name]"
          :label="field.name"
        />
      </div>
      <div class="turrets my-5">
        <TurretUrlList
          :turretsUrls="turretsUrls"
          @onDeleteTurretUrl="(url) => deleteTurretUrl(url)"
          @onEditTurretUrl="(url) => editTurretUrl(url)"
        />
        <AppInput v-model="editableTurretUrl" label="Add another turret url" />
        <AppButton @click="saveTurretUrl"
          >{{ isEditingTurretUrl ? "Save" : "Add another turret" }}
        </AppButton>
      </div>
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
              : `get a multi-use XDR token for ${$store.getters.keypair.publicKey()} and ${
                  this.txFunctionHash
                } (valid for 5 minutes)`
          }}
        </a>
      </p>
      <AppButton @click="runTxFunction"
        >{{ isRunning ? "Running..." : "Run txFunction" }}
      </AppButton>
      <div v-if="resultingTxRunXdr" id="resultingXdr">
        <p class="mt-4 font-bold">Resulting XDR:</p>
        <p class="break-words">
          {{ resultingTxRunXdr }}
        </p>
      </div>

      <div>
        <p class="mt-4 font-bold">TxFunction code</p>
        <pre>{{ txFunction.txFunction }}</pre>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import Card from "@/components/common/Card.vue";
import { getTxFunction, runTxFunction } from "@/services/turret/function";
import TxFunction from "@/entities/TxFunction";
import JsonTreeView from "@/components/common/JsonTreeView.vue";
import TurretFieldsTable from "@/components/turret/contracts/TurretFieldsTable.vue";
import TurretUrlList from "@/components/turret/contracts/TurretUrlList.vue";
import TurretHttpError from "@/errors/TurretHttpError";
import { generateXdr } from "@/services/turret/turret";

@Options({
  components: {
    TurretFieldsTable,
    AppButton,
    AppInput,
    Card,
    JsonTreeView,
    TurretUrlList,
  },
})
export default class TxFunctions extends Vue {
  private txFunctionHash = "";
  private txFunction = TxFunction.createNull();
  private getTxFunctionError = "";
  private turretsUrls: string[] = [];
  private txFunctionRunParams = {};
  private xdrToken = "";
  private resultingTxRunXdr = "";
  private editableTurretUrl = "";
  private editIndex = 0;
  private isEditingTurretUrl = false;
  private isCreatingXdr = false;
  private isRunning = false;
  private isFetching = false;

  async getTxFunction(): Promise<void> {
    this.isFetching = true;
    this.getTxFunctionError = "";
    const turret = this.$store.state.turret;
    try {
      this.txFunction = await getTxFunction(turret, this.txFunctionHash);
    } catch (error) {
      this.getTxFunctionError = error;
    }
    this.isFetching = false;
  }

  saveTurretUrl(): void {
    if (!this.editableTurretUrl) {
      return;
    }

    if (this.isEditingTurretUrl && this.editIndex !== -1) {
      this.turretsUrls[this.editIndex] = this.editableTurretUrl;
    } else {
      this.turretsUrls = [...this.turretsUrls, this.editableTurretUrl];
    }
    this.editableTurretUrl = "";
    this.isEditingTurretUrl = false;
  }

  editTurretUrl(url: string): void {
    this.editableTurretUrl = url;
    this.editIndex = this.turretsUrls.indexOf(url);
    this.isEditingTurretUrl = true;
  }

  deleteTurretUrl(url: string): void {
    for (let i = 0; i < this.turretsUrls.length; i++) {
      if (this.turretsUrls[i] === url) {
        this.turretsUrls.splice(i, 1);
      }
    }
  }

  async runTxFunction(): Promise<void> {
    this.isRunning = true;
    const finalTurretUrls = [...this.turretsUrls];
    finalTurretUrls.push(this.$store.state.turret.url);

    try {
      this.resultingTxRunXdr = await runTxFunction(
        finalTurretUrls,
        this.txFunctionHash,
        this.txFunctionRunParams,
        this.xdrToken,
        this.$store.state.turret.network
      );
    } catch (e) {
      this.resultingTxRunXdr = e.message;
      if (e instanceof TurretHttpError) {
        this.resultingTxRunXdr = e.json;
      }
    }

    this.isRunning = false;
  }

  async createXdr(): Promise<void> {
    this.isCreatingXdr = true;
    this.xdrToken = await generateXdr(
      this.$store.state.turret,
      this.$store.getters.keypair,
      "false",
      300,
      [this.txFunctionHash]
    );
    this.isCreatingXdr = false;
  }
}
</script>
