<script setup lang="ts">
import { onMounted, ref } from "vue";
import GlobalHeader from "./components/GlobalHeader.vue";
import { RouterView } from "vue-router";
import { useNavBarStore } from "./store/navBarStore.ts";

const isOnTop = ref(true);
const navBarStore = useNavBarStore();
const onPageScroll = (e: Event) => {
  if (!navBarStore.slideChange) {
    return;
  }
  const scrollTop = document.querySelector("#app-container")!.scrollTop;
  if (scrollTop === 0) {
    isOnTop.value = true;
  } else {
    isOnTop.value = false;
  }
};

const customBreakpoints = {
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1280,
  xxl: 1300,
};

onMounted(() => {
  let appContainer = document.getElementById("app-container");
  appContainer?.addEventListener("scroll", () => {}, { capture: true });
});
</script>

<template>
  <n-config-provider :breakpoints="customBreakpoints">
    <n-notification-provider>
      <div id="app-container" @scroll="onPageScroll">
        <nav>
          <div id="header">
            <global-header :is-on-top="isOnTop" />
          </div>
        </nav>
        <main>
          <router-view />
        </main>
      </div>
    </n-notification-provider>
  </n-config-provider>
</template>
<style scoped>
.skeleton-item {
  border-radius: 6px;
}
.skeleton {
  background-color: #f1f2f3;
  border-radius: 6px;
  display: inline-block;
}
.skeleton-cover {
  width: 100%;
  height: 180px;
}
.skeleton-text-1 {
  width: 95%;
  height: 24px;
  margin-top: 6px;
}
.skeleton-text-2 {
  width: 75%;
  height: 24px;
  margin-top: 6px;
}
.skeleton-text-3 {
  width: 50%;
  height: 24px;
  margin-top: 6px;
}
.text {
  display: flex;
  justify-content: center;
  font-size: 16px;
  color: gray;
  padding: 24px 0;
}
.recommend-video-list {
  margin-top: 64px;
}
.intro-video-author {
  font-size: 13px;
  font-weight: 500;
  color: #a9a195;
  margin: 0;
}
.intro-video-title {
  font-size: 15px;
  font-weight: 500;
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.intro-video-item {
  display: flex;
  flex-direction: column;
}
#app-container {
  font-size: 0;
  height: 100vh;
  overflow-y: scroll;
}
#header {
  width: 100%;
  position: fixed;
  z-index: 999;
}
#content {
  height: 100vh;
  background: #fff;
  padding: 20px 140px;
}
#header-img {
  width: 100%;
}
.n-button {
  width: 100%;
}
.tags-container {
  width: 1300px;
}
.line-two {
  margin-top: 20px;
  display: flex;
  flex-wrap: nowrap;
}
.banner {
  flex: 0 0 630px;
  max-width: 630px;
  height: 400px;
  margin-right: 24px;
}
.carousel-img {
  object-fit: cover;
}
.intro-video-container {
  flex: 1;
}
.intro-video-cover {
  width: 100%;
  height: 170px;
  object-fit: contain;
}
.intro-video-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20px;
  background-color: aqua;
  z-index: 999;
}
</style>
