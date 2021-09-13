<template>
  <div id="contract-fields">
    <div v-for="field in fields" :key="field.name" class="contract-field">
      <p>
        <strong>Name</strong> <span>{{ field.name }}</span>
      </p>
      <p>
        <strong>Type</strong> <span>{{ field.type }}</span>
      </p>
      <p>
        <strong>Description</strong> <span>{{ field.description }}</span>
      </p>
      <p>
        <strong>Rule type</strong> <span>{{ field.rule }}</span>
      </p>

      <button @click.prevent="deleteField(field)">Delete</button>
      <button @click.prevent="editField(field)">Edit</button>
    </div>

    <div id="new-field">
      <label>
        <span>Name</span>
        <input v-model="editableField.name" type="text" />
      </label>
      <label>
        <span>Type</span>
        <input v-model="editableField.type" type="text" />
      </label>
      <label>
        <span>Description</span>
        <input v-model="editableField.description" type="text" />
      </label>
      <label>
        <span>Optional</span>
        <input
          v-model="editableField.rule"
          :value="rules.Optional"
          type="radio"
        />
      </label>
      <label>
        <span>Required</span>
        <input
          v-model="editableField.rule"
          :value="rules.Required"
          type="radio"
        />
      </label>
    </div>
    <button @click="saveField">{{ editing ? "Save" : "Add" }}</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Turret from "@/entities/Turret";
import Card from "@/components/common/Card.vue";
import Field, { RuleTypes } from "@/entities/Contracts/Field";

@Options({
  components: { Card },
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
