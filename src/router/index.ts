import { createRouter, createWebHistory, type RouteRecordRaw, } from "vue-router";
import HomePage from "../components/HomePage.vue";
import NotificationPage from "../components/NotificationPage.vue";
import VideoDetailPage from "../components/VideoDetailPage.vue";
import UserSpacePage from "../components/UserSpacePage.vue";

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
