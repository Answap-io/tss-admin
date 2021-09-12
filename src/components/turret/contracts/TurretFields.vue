<template>
  <div id="contract-fields">
    <div
      :key="contract.txFunction"
      :v-for="field in contract.txFunctionFields"
      class="contract-field"
    >
      {{ field }}
      <input type="text" />
    </div>
    <button @click="addField">Add</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Turret from "@/entities/Turret";
import Card from "@/components/common/Card.vue";
import Contract from "@/entities/Contracts/Contract";
import Field, { RuleTypes } from "@/entities/Contracts/Field";

@Options({
  components: { Card },
  emits: ["loaded"],
  props: {
    turret: {
      type: Turret,
    },
  },
})
export default class TurretForm extends Vue {
  private contract: Contract = Contract.createNull();

  addField(): void {
    this.contract.txFunctionFields.push(Field.createNull());
  }
}
</script>
