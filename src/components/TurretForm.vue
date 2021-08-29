<template>
  <form action="#" @submit.prevent="getTurret">
    <label for="turret-url">Turret url</label>
    <input id="turret-url" v-model="turretUrl" type="text" />
    <button type="submit">Fetch</button>
  </form>

  <div v-if="turret.turret !== ''" class="turret">
    <p>Turret address: <strong>{{ turret.turret }}</strong></p>
    <p>Turret network: <strong>{{ turret.network }}</strong></p>
    <p>Horizon url: <a :href="turret.horizon"><strong>{{ turret.horizon }}</strong></a></p>
    <p>Runner: <a :href="turret.runner"><strong>{{ turret.runner }}</strong></a></p>
    <p>Version: <strong>{{ turret.version }}</strong></p>
    <div class="fee">
      <h2>Fee</h2>
      <p>Min: <strong>{{ turret.fee.min }}</strong></p>
      <p>Max: <strong>{{ turret.fee.max }}</strong></p>
      <p>Days: <strong>{{ turret.fee.days }}</strong></p>
    </div>

    <div class="divisor">
      <h2>Divisor</h2>
      <p>Upload: <strong>{{ turret.divisor.upload }}</strong></p>
      <p>Run: <strong>{{ turret.divisor.run }}</strong></p>
    </div>

    <div class="toml">
      <pre>{{ toml }}</pre>
    </div>
  </div>

  <div class="turret-ops">
    <label for="private-key">
      <span>Private key</span>
      <input id="private-key" v-model="privateKey" type="text">
    </label>


    <h2>Upload contract</h2>
    <form enctype="multipart/form-data">
      <label for="contract">
        <span>Contract</span>
        <input id="contract" type="file" @change="loadContract">
      </label>
    </form>

    <div id="contract-info">
      <textarea v-model="contractCode" />
      <p>Byte length:<strong>{{contractCode.length}}</strong></p>
      <p>txFunctionFee amount: <strong>{{ (contractCode.length / turret.divisor.upload).toFixed(7)}}</strong></p>
      <p>txFunctionFee transaction xdr <strong>{{ txFunctionFeeXdr }}</strong></p>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import Turret from "@/entities/Turret";

export default class TurretForm extends Vue {
  private turretUrl = "http://localhost:8787/";
  private turret = Turret.createNull();
  private toml = "";
  private privateKey = "";
  private contractCode = "";
  private txFunctionFeeXdr = "";

  async getTurret(): Promise<void> {
    this.turret = await (await fetch("http://localhost:8787/")).json();
    this.toml = await (await fetch("http://localhost:8787/.well-known/stellar.toml")).text();
  }

  loadContract() {
    const file = (document.querySelector("#contract") as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.contractCode = evt.target!.result!.toString();
      };
      reader.onerror = function(evt) {
        console.error(evt);
      };
    }
  }
}
</script>
