<template>
  <pre ref="placeholder"></pre>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONTreeView = require("json-tree-view");

@Options({
  props: {
    json: {
      type: Object,
      required: true,
    },
  },
  watch: {
    json: {
      handler(): void {
        this.renderJson();
      },
    },
  },
})
export default class JsonTreeView extends Vue {
  private json = {};

  created(): void {
    this.$nextTick(() => {
      this.renderJson();
    });
  }

  renderJson(): void {
    const ref = this.$refs.placeholder as HTMLElement;
    const treeView = new JSONTreeView(
      "txFunctionFee",
      JSON.parse(JSON.stringify(this.json))
    );
    treeView.readonly = true;

    ref.innerHTML = "";
    ref.appendChild(treeView.dom);
  }
}
</script>
