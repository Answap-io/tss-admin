<template>
  <button
    class="
      shadow
      bg-blue-500
      hover:bg-blue-600
      text-white
      font-bold
      focus:shadow-outline focus:outline-none
      py-2
      px-4
      rounded
    "
    type="button"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class ContractInput extends Vue {}
</script>
