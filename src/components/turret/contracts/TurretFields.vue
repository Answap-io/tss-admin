<template>
  <div>
    <div id="new-field">
      <form class="w-full max-w-sm">
        <ContractInput v-model="editableField.name" label="Name" />
        <ContractInput v-model="editableField.type" label="Type" />
        <ContractInput
          v-model="editableField.description"
          label="Description"
        />
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3"></div>
          <label class="md:w-2/3 block text-gray-500 font-bold">
            <input
              v-model="editableField.rule"
              :value="rules.Optional"
              class="mr-2 leading-tight"
              name="rule-type"
              type="radio"
            />
            <span class="text-sm">Optional</span>
          </label>
          <label class="md:w-2/3 block text-gray-500 font-bold">
            <input
              v-model="editableField.rule"
              :value="rules.Required"
              class="mr-2 leading-tight"
              name="rule-type"
              type="radio"
            />
            <span class="text-sm">Required</span>
          </label>
        </div>
        <AppButton @click="saveField">{{ editing ? "Save" : "Add" }}</AppButton>
      </form>
    </div>
    <div id="contract-fields">
      <TurretFieldsTable
        :fields="fields"
        @onEditField="(field) => editField(field)"
        @onDeleteField="(field) => deleteField(field)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Turret from "@/entities/Turret";
import Card from "@/components/common/Card.vue";
import Field, { RuleTypes } from "@/entities/Contracts/Field";
import ContractInput from "@/components/common/form/ContractInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import TurretFieldsTable from "@/components/turret/contracts/TurretFieldsTable.vue";

@Options({
  components: { TurretFieldsTable, AppButton, ContractInput, Card },
  emits: ["fieldsUpdated"],
  props: {
    turret: {
      type: Turret,
    },
  },
})
export default class TurretForm extends Vue {
  private fields: Field[] = [];
  private editableField: Field = Field.createNull();
  private rules = RuleTypes;
  private editing = false;

  saveField(): void {
    const { name, type, description, rule } = this.editableField;
    const currentField = this.fields.find((f) => f === this.editableField);
    if (currentField) {
      currentField.name = name;
      currentField.type = type;
      currentField.description = description;
      currentField.rule = rule;
    } else {
      this.fields = [...this.fields, new Field(name, type, description, rule)];
    }

    this.editableField = Field.createNull();
    this.editing = false;
    this.$emit("fieldsUpdated", this.fields);
  }

  editField(field: Field): void {
    this.editableField = field;
    this.editing = true;
  }

  deleteField(field: Field): void {
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i] === field) {
        this.fields.splice(i, 1);
      }
    }
  }
}
</script>
