import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomePage from "../components/HomePage.vue";
import NotificationPage from "../components/NotificationPage.vue";
import VideoDetailPage from "../components/VideoDetailPage.vue";
import UserSpacePage from "../components/UserSpacePage.vue";

declare module "vue-router" {
  interface RouteMeta {
    /** 该页面需要登录才能进入 */
    requiresAuth?: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/notification/:selectIndex?/:another_id?",
    name: "notification",
    component: NotificationPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/video/:videoID?",
    name: "video",
    component: VideoDetailPage,
  },
  {
    path: "/userSpace/:userID",
    name: "userSpace",
    component: UserSpacePage,
  },
];

const router = createRouter({
  history: createWebHistory(""),
  routes,
});

export default router;
