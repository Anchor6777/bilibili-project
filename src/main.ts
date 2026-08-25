import {
  // create naive ui
  create,
  // component
  NButton,
  NSpace,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NGrid,
  NGi,
  NCarousel,
  NInfiniteScroll,
  NModal,
  NCard,
  NTabs,
  NTab,
  NForm,
  NTabPane,
  NFormItemRow,
  NInput,
  NNotificationProvider,
  NSkeleton,
  NConfigProvider,
} from "naive-ui";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";

const naive = create({
  components: [
    NButton,
    NSpace,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NGrid,
    NGi,
    NCarousel,
    NInfiniteScroll,
    NModal,
    NCard,
    NTabs,
    NTab,
    NForm,
    NTabPane,
    NFormItemRow,
    NInput,
    NNotificationProvider,
    NSkeleton,
    NConfigProvider,
  ],
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router).use(naive).use(pinia).mount("#app");
