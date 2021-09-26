<template>
  <div class="home m-10">
    <TurretForm @loaded="setTurret" />

    <Card>
      <label for="private-key">
        <span class="block text-gray-700 text-sm font-bold mb-2">
          Private key
        </span>
        <input
          id="private-key"
          v-model="$store.state.privateKey"
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
        <span class="block text-gray-700 text-sm font-bold mb-2">
          Public key
          {{ $store.getters.keypair.publicKey() }}
        </span>
      </label>
    </Card>
    <div id="turret-ops">
      <router-link to="/">Upload contract</router-link>
    </div>
    <router-view v-if="turret.turret" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TurretForm from "@/components/turret/TurretForm.vue";
import Turret from "@/entities/Turret"; // @ is an alias to /src
import Card from "@/components/common/Card.vue";

@Options({
  components: {
    TurretForm,
    Card,
  },
})
export default class Home extends Vue {
  private turret: Turret = Turret.createNull();

  setTurret(turret: Turret): void {
    this.$store.commit("setTurret", turret);
    this.turret = turret;
  }
}
</script>
