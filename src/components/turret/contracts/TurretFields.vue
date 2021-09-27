<template>
  <div class="my-5">
    <h2 class="text-xl mb-5">Add contract field (Optional)</h2>
    <div id="new-field">
      <form class="w-full max-w-sm">
        <AppInput v-model="editableField.name" label="Name" />
        <AppInput v-model="editableField.type" label="Type" />
        <AppInput v-model="editableField.description" label="Description" />
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
        <div class="text-center">
          <AppButton @click="saveField" class="block w-full">{{
            editing ? "Save" : "Add"
          }}</AppButton>
        </div>
      </form>
    </div>
    <div id="contract-fields" class="my-10">
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
import AppInput from "@/components/common/form/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import TurretFieldsTable from "@/components/turret/contracts/TurretFieldsTable.vue";

@Options({
  components: { TurretFieldsTable, AppButton, AppInput, Card },
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
