<template>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label
        :for="inputId"
        class="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
      >
        {{ label }}
      </label>
    </div>
    <div class="md:w-2/3">
      <input
        :id="inputId"
        :value="modelValue"
        class="
          bg-gray-200
          appearance-none
          border-2 border-gray-200
          rounded
          w-full
          py-2
          px-4
          text-gray-700
          leading-tight
          focus:outline-none focus:bg-white focus:border-blue-500
        "
        type="text"
        @change="$emit('update:modelValue', $event.target.value)"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  emits: ["update:modelValue"],
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: String,
  },
})
export default class AppInput extends Vue {
  private label = "";

  get inputId(): string {
    const match = this.label.match(/[a-z]+[a-z0-9]/gi);
    if (match === null) {
      throw new Error("Label must contain letters");
    }
    return "contract-input-" + match.join("").toLowerCase();
  }
}
</script>
