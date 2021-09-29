<template>
  <div>
    <h1 class="text-2xl mb-5">View and run functions</h1>
    <Card>
      <AppInput v-model="txFunctionHash" label="Function hash" />
      <AppButton @click="getFunction">Fetch</AppButton>

      <div v-if="response">
        <p class="mt-4 font-bold">TxFunction code</p>
        <textarea
          v-model="response.function"
          class="border-2 border-blue-100 mb-10 h-auto"
          cols="80"
          rows="4"
          readonly
        ></textarea>

        <p class="mt-4 font-bold">TxFunction fields</p>
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
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="field in response.fields"
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
            </tr>
          </tbody>
        </table>
        <p class="mt-10"><strong>Signer:</strong> {{ response.signer }}</p>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import Card from "@/components/common/Card.vue";
import { getTxFunction } from "@/services/turret/function";

@Options({
  components: {
    AppButton,
    AppInput,
    Card,
  },
})
export default class TxFunctions extends Vue {
  private txFunctionHash = "";
  private response = null as unknown;

  async getFunction(): Promise<void> {
    const turret = this.$store.state.turret;
    this.response = await getTxFunction(turret, this.txFunctionHash);
  }
}
</script>
