import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UploadContract from "@/views/UploadContract.vue";
import FeePayments from "@/views/FeePayments.vue";
import ManageXdrToken from "@/views/ManageXdrToken.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Upload contract",
    component: UploadContract,
  },
  {
    path: "/xdr-token",
    name: "Manage xdr token",
    component: ManageXdrToken,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
