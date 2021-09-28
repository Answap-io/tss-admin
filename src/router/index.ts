import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UploadContract from "@/views/UploadContract.vue";
import CreateXdrToken from "@/views/CreateXdrToken.vue";
import ManageTurretFunds from "@/views/ManageTurretFunds.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Upload contract",
    component: UploadContract,
  },
  {
    path: "/xdr-token",
    name: "Manage xdr token",
    component: CreateXdrToken,
  },
  {
    path: "/turret-funds",
    name: "Manage turret funds",
    component: ManageTurretFunds,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
