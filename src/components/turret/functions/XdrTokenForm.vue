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

    <AppButton @click="fetchTxFees">Create XdrToken</AppButton>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
  Account,
  Keypair,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} from "stellar-sdk";
import AppButton from "@/components/common/AppButton.vue";
import AppInput from "@/components/common/form/AppInput.vue";

@Options({
  components: { AppInput, AppButton },
  emits: ["createXdrToken"],
})
export default class XdrTokenForm extends Vue {
  private newFunctionHash = "";
  private newFunctionHashError = "";
  private functionHashes: string[] = [];
  private xdrToken = "";
  private ttl = "86400";
  private ttlError = "";

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

  async fetchTxFees(): Promise<void> {
    const turret = this.$store.state.turret;
    this.xdrToken = "";

    const privateKeypair = Keypair.fromSecret(this.$store.state.privateKey);
    const pk = privateKeypair.publicKey();

    const testnet = new Server(turret.horizon);

    try {
      const tempAcct = new Account(pk, "-1");
      const fee = await testnet.fetchBaseFee();
      const txBuilder = new TransactionBuilder(tempAcct, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET,
      });

      for (const hash of this.functionHashes) {
        txBuilder.addOperation(
          Operation.manageData({
            name: "txFunctionHash",
            value: hash,
          })
        );
      }

      const tx = txBuilder.setTimeout(Number(this.ttl)).build();

      tx.sign(privateKeypair);

      const token = tx.toEnvelope().toXDR("base64");
      this.xdrToken = token;

      this.$emit("createXdrToken", token);
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
