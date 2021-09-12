import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UploadContract from "@/views/UploadContract.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Upload contract",
    component: UploadContract,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
