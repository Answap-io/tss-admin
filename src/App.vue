<template>
  <div class="home m-10">
    <TurretForm @loaded="setTurret" />

    <Card>
      <label for="private-key">
        <span class="block text-gray-700 text-sm font-bold mb-2">
          Private key (this will be used to create your XDR token and fund
          turrets)
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
    <div id="turret-ops" class="mb-5">
      <router-link to="/">
        <AppButton class="mr-2">Upload contract</AppButton>
      </router-link>
      <router-link to="/xdr-token">
        <AppButton class="mr-2">Create XDR Token</AppButton>
      </router-link>
      <router-link to="/turret-funds">
        <AppButton class="mr-2">Manage Turret funds</AppButton>
      </router-link>
      <router-link to="/tx-functions">
        <AppButton class="mr-2">View & Run functions</AppButton>
      </router-link>
    </div>
    <router-view v-if="turret.turret && $store.state.privateKey" />
    <p v-else>
      Waiting for turret information to be loaded and private key to be entered
    </p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TurretForm from "@/components/turret/TurretForm.vue";
import Turret from "@/entities/Turret"; // @ is an alias to /src
import Card from "@/components/common/Card.vue";
import AppButton from "@/components/common/AppButton.vue";

@Options({
  components: {
    AppButton,
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
