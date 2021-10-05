<template>
  <div class="turrets my-5">
    <div class="flex flex-col my-5">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-gray-200
              sm:rounded-lg
            "
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
                    Url
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="url in turretsUrls" :key="url">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ url }}
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
                      @click.prevent="editTurretUrl(url)"
                      >Edit</a
                    >
                    <a
                      class="text-indigo-600 hover:text-indigo-900"
                      href="#"
                      @click.prevent="deleteTurretUrl(url)"
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
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PropType } from "vue";
import AppInput from "@/components/common/form/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";

@Options({
  components: { AppButton, AppInput },
  emits: ["onEditTurretUrl", "onDeleteTurretUrl"],
  props: {
    turretsUrls: {
      type: Array as PropType<string[]>,
    },
  },
})
export default class TurretUrlList extends Vue {
  editTurretUrl(url: string): void {
    this.$emit("onEditTurretUrl", url);
  }

  deleteTurretUrl(url: string): void {
    this.$emit("onDeleteTurretUrl", url);
  }
}
</script>
