<template>
  <Card>
    <form action="#" @submit.prevent="loadTurret">
      <label for="turret-url">
        <span class="block text-gray-700 text-sm font-bold mb-2">
          Turret url
        </span>
        <input
          id="turret-url"
          v-model="turretUrl"
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            leading-tight
            focus:outline-none focus:shadow-outline
          "
          type="text"
        />
      </label>
      <AppButton @click="loadTurret">
        {{ isLoading ? "Loading..." : "Fetch" }}
      </AppButton>
    </form>
    <p v-if="turret.turret !== ''">
      <strong>Loaded turret {{ turret.turret }}</strong>
      <br />
      <a href="#" @click.prevent="this.showDetails = !this.showDetails">
        {{ this.showDetails ? "Hide details" : "Show details" }}
      </a>
    </p>
  </Card>
  <div v-if="showDetails" class="turret">
    <Card>
      <p>
        Turret address: <strong>{{ turret.turret }}</strong>
      </p>
      <p>
        Turret url: <strong>{{ turret.url }}</strong>
      </p>
      <p>
        Turret network: <strong>{{ turret.network }}</strong>
      </p>
      <p>
        Horizon url:
        <a :href="turret.horizon" class="underline"
          ><strong>{{ turret.horizon }}</strong></a
        >
      </p>
      <p>
        Runner:
        <a :href="turret.runner" class="underline"
          ><strong>{{ turret.runner }}</strong></a
        >
      </p>
      <p>
        Version: <strong>{{ turret.version }}</strong>
      </p>
      <div class="fee">
        <h2>Fee</h2>
        <p>
          Min: <strong>{{ turret.fee.min }}</strong>
        </p>
        <p>
          Max: <strong>{{ turret.fee.max }}</strong>
        </p>
      </div>

      <div class="divisor">
        <h2>Divisor</h2>
        <p>
          Upload: <strong>{{ turret.divisor.upload }}</strong>
        </p>
        <p>
          Run: <strong>{{ turret.divisor.run }}</strong>
        </p>
      </div>

      <div class="toml">
        <pre>{{ turret.toml }}</pre>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Turret from "@/entities/Turret";
import Card from "@/components/common/Card.vue";
import TurretContract from "@/components/turret/contracts/TurretContract.vue";
import { getTurret } from "@/services/turret";
import AppButton from "@/components/common/AppButton.vue";

@Options({
  components: { AppButton, TurretContract, Card },
  emits: ["loaded"],
})
export default class TurretForm extends Vue {
  private turretUrl =
    "https://stellar-turrets-testnet.sdf-ecosystem.workers.dev";
  private turret = Turret.createNull();
  private showDetails = false;
  private isLoading = false;

  async loadTurret(): Promise<void> {
    this.isLoading = true;
    this.turret = await getTurret(this.turretUrl);
    this.$emit("loaded", this.turret);
    this.isLoading = false;
  }
}
</script>
