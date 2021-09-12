import { Store } from "vuex";
import IState from "@/store/IState";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<IState>;
  }
}
