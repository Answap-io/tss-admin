<template>
  <div class="transaction-fee mt-4">
    <div class="flex flex-col">
      <div class="overflow-x-auto -mx-8">
        <div class="py-2 align-middle inline-block">
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
                    Field
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
                    Value
                  </th>
                  <th class="relative px-6 py-3" scope="col">
                    <span class="sr-only">Edit</span>
                    <span class="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Balance
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ transactionFee.balance }}
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Hash
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ transactionFee.hash }}
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Last modified time
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(Number(transactionFee.lastModifiedTime)) }}
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Public Key
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ transactionFee.publicKey }}
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Single use?
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="
                        transactionFee.singleUse ? 'bg-red-100' : 'bg-blue-100'
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
                      {{ transactionFee.singleUse ? "Yes" : "No" }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Function hashes
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ul>
                      <li
                        v-for="fnHash in transactionFee.txFunctionHashes"
                        :key="fnHash"
                      >
                        <a class="underline text-blue-500 font-mono" href="#">{{
                          fnHash
                        }}</a>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Actions
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      class="text-indigo-600 hover:text-indigo-900 mr-2"
                      href="#"
                      @click.prevent="
                        $emit('fund', $store.state.turret.fee.min)
                      "
                    >
                      Fund Min ({{ $store.state.turret.fee.min }} XLM)
                    </a>
                    <a
                      class="text-indigo-600 hover:text-indigo-900 mr-2"
                      href="#"
                      @click.prevent="
                        $emit('fund', $store.state.turret.fee.max)
                      "
                    >
                      Fund Max ({{ $store.state.turret.fee.max }} XLM)
                    </a>
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
import ITransactionFee from "@/entities/ITransactionFee";

@Options({
  props: {
    transactionFee: {
      type: Object as PropType<ITransactionFee>,
      required: true,
    },
  },
  emits: ["fund"],
})
export default class TransactionFeeInfo extends Vue {}
</script>
