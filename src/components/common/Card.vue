<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Card extends Vue {}
</script>
