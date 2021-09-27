<template>
  <div
    class="
      bg-white
      border-2 border-gray-300
      shadow-xl
      rounded
      px-8
      pt-6
      pb-8
      mb-8
    "
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Card extends Vue {}
</script>
