<template>
  <div class="transaction-fee mb-4">
    <form class="w-full mb-10" @submit.prevent="saveFunctionHash">
      <div>
        <AppInput v-model="newFunctionHash" label="Function hash (optional)" />
        <p class="mb-2">
          e.g.: 30180f8f65a06b24480b51c29317f3eeb152141d00254d20bce6d6c9a3f35602
        </p>
        <p class="mb-4">{{ newFunctionHashError }}</p>
      </div>
      <div class="text-center">
        <AppButton class="block w-full" @click="saveFunctionHash">
          Add
        </AppButton>
      </div>
    </form>

    <table
      v-if="functionHashes.length"
      class="min-w-full divide-y divide-gray-200 mb-5"
    >
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
            Function hash
          </th>
          <th class="relative px-6 py-3" scope="col">
            <span class="sr-only">Delete</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="hash in functionHashes" :key="hash">
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono"
          >
            <a class="underline text-blue-500" href="#">{{ hash }}</a>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <a
              class="text-indigo-600 hover:text-indigo-900"
              href="#"
              @click.prevent="deleteFunctionHash(hash)"
            >
              Delete
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="mb-8">
      This XDR token is valid for any function. Add one or more Function Hashes
      to restrict it.
    </p>

    <div>
      <AppInput v-model="ttl" label="TTL (in seconds)" />
      <p class="mb-4">{{ ttlError }}</p>
    </div>

    <div class="flex mb-6">
      <div class="w-1/3 block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
        Single use?
      </div>
      <label class="mr-4">
        <input
          v-model="isSingleUse"
          class="mr-2 leading-tight"
          name="rule-type"
          type="radio"
          value="true"
        />
        <span class="text-sm">True</span>
      </label>
      <label>
        <input
          v-model="isSingleUse"
          class="mr-2 leading-tight"
          name="rule-type"
          type="radio"
          value="false"
        />
        <span class="text-sm">False</span>
      </label>
    </div>
    <AppButton @click="createXdrToken"
      >{{ isLoading || isCreatingXdr ? "Loading..." : "Create xdrToken" }}
    </AppButton>

    <JsonTreeView v-if="requestError" :json="requestError" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppButton from "@/components/common/AppButton.vue";
import AppInput from "@/components/common/form/AppInput.vue";
import JsonTreeView from "@/components/common/JsonTreeView.vue";
import { generateXdr } from "@/services/turret/turret";

@Options({
  components: { JsonTreeView, AppInput, AppButton },
  emits: ["createXdrToken"],
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
})
export default class XdrTokenForm extends Vue {
  private newFunctionHash = "";
  private newFunctionHashError = "";
  private functionHashes: string[] = [];
  private xdrToken = "";
  private ttl = "86400";
  private ttlError = "";
  private isSingleUse = "false";
  private requestError = null as unknown;
  private isCreatingXdr = false;

  saveFunctionHash(): void {
    const ttl = Number(this.ttl);
    if (isNaN(ttl)) {
      this.ttlError = "TTL must be a number, in seconds.";
      return;
    }
    if (this.newFunctionHash.length !== 64) {
      this.newFunctionHashError =
        "Function hashes should be 64 characters long";
      return;
    }
    this.functionHashes.push(this.newFunctionHash);
    this.newFunctionHash = "";
    this.newFunctionHashError = "";
  }

  deleteFunctionHash(hash: string): void {
    this.functionHashes.splice(
      this.functionHashes.findIndex((h) => h === hash),
      1
    );
  }

  async createXdrToken(): Promise<void> {
    this.isCreatingXdr = true;
    this.xdrToken = "";
    this.requestError = null;

    try {
      const token = await generateXdr(
        this.$store.state.turret,
        this.$store.getters.keypair,
        this.isSingleUse,
        Number(this.ttl),
        this.functionHashes
      );

      this.xdrToken = token;

      this.$emit("createXdrToken", token);
    } catch (e) {
      this.requestError = e;
    } finally {
      this.isCreatingXdr = false;
    }
  }
}
</script>
