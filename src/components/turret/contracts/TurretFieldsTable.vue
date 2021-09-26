<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                  scope="col"
                >
                  Name
                </th>
                <th
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                  scope="col"
                >
                  Type
                </th>
                <th
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                  scope="col"
                >
                  Description
                </th>
                <th
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                  scope="col"
                >
                  Rule type
                </th>
                <th class="relative px-6 py-3" scope="col">
                  <span class="sr-only">Edit</span>
                  <span class="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="field in fields"
                :key="field.name"
                class="contract-field"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ field.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ field.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ field.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="
                      field.rule === 'Optional' ? 'bg-blue-100' : 'bg-red-100'
                    "
                    class="
                      px-2
                      inline-flex
                      text-xs
                      leading-5
                      font-semibold
                      rounded-full
                    "
                  >
                    {{ field.rule }}
                  </span>
                </td>
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-right text-sm
                    font-medium
                  "
                >
                  <a
                    class="text-indigo-600 hover:text-indigo-900 mr-2"
                    href="#"
                    @click.prevent="editField(field)"
                    >Edit</a
                  >
                  <a
                    class="text-indigo-600 hover:text-indigo-900"
                    href="#"
                    @click.prevent="deleteField(field)"
                    >Delete</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PropType } from "vue";
import Field from "@/entities/Contracts/Field";

@Options({
  emits: ["onEditField", "onDeleteField"],
  props: {
    fields: {
      type: Array as PropType<Field[]>,
    },
  },
})
export default class TurretForm extends Vue {
  editField(field: Field): void {
    this.$emit("onEditField", field);
  }

  deleteField(field: Field): void {
    this.$emit("onDeleteField", field);
  }
}
</script>
