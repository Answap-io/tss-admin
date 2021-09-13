<template>
  <div>
    <Card>
      <form enctype="multipart/form-data">
        <label for="contract">
          <span class="block text-gray-700 text-sm font-bold mb-2">
            Contract
          </span>
          <input
            id="contract"
            class="
              shadow
              appearance-none
              border
              rounded
              w-full
              py-2
              px-3
              text-gray-700
              leading-tight
              focus:outline-none focus:shadow-outline
            "
            type="file"
            @change="loadContract"
          />
        </label>
      </form>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Turret from "@/entities/Turret";
import Card from "@/components/common/Card.vue";

@Options({
  components: { Card },
  emits: ["loaded"],
  props: {
    turret: {
      type: Turret,
    },
  },
})
export default class TurretContract extends Vue {
  private contractCode = "";

  loadContract(): void {
    const files = (document.querySelector("#contract") as HTMLInputElement)
      .files;

    const file = files ? files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        if (!evt.target?.result) {
          return;
        }
        this.contractCode = evt.target.result.toString();
        this.$emit("loaded", this.contractCode);
      };
      reader.onerror = function (evt) {
        console.error(evt);
      };
    }
  }
}
</script>
