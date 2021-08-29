<template>
  <div class="home">
    <TurretForm />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TurretForm from "@/components/TurretForm.vue"; // @ is an alias to /src

@Options({
  components: {
    TurretForm,
  },
})
export default class Home extends Vue {}
</script>
