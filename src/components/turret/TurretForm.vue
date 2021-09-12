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
      <button
        class="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          my-2
          py-2
          px-4
          rounded
          focus:outline-none focus:shadow-outline
        "
        type="submit"
      >
        Fetch
      </button>
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
        <p>
          Days: <strong>{{ turret.fee.days }}</strong>
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

@Options({
  components: { TurretContract, Card },
  emits: ["loaded"],
})
export default class TurretForm extends Vue {
  private turretUrl = "http://localhost:8787";
  private turret = Turret.createNull();
  private showDetails = false;

  async loadTurret(): Promise<void> {
    this.turret = await getTurret(this.turretUrl);
    this.$emit("loaded", this.turret);
  }
}
</script>
