<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from "vue";
import { useNavBarStore } from "../store/navBarStore";
import { getVideoList } from "../api/video";
import type { NamedVideo } from "../model/TypeDefinition";
import { useRouter } from "vue-router";
import { formatPlayCount, formatPlayTime } from "../constant";
import dayjs from "dayjs";
import { useLoginStore } from "../store/userLoginStore";

const userLoginStore = useLoginStore();
// 检查refreshToken是否过期，过期则清空用户登录信息
if(localStorage.getItem("tokenInfo")){
  let expires = JSON.parse(localStorage.getItem("tokenInfo")!).expires;
  if(Date.now()>expires){
    userLoginStore.resetLoginInfo();
  }
}

// 切换header样式
const navBarStore = useNavBarStore();
navBarStore.setStyle(0);
navBarStore.setSlideChange(true);

const tagNames = [
  "番剧",
  "国创",
  "综艺",
  "动画",
  "鬼畜",
  "舞蹈",
  "娱乐",
  "科技数码",
  "美食",
  "汽车",
  "体育运动",
  "vlog",
  "电影",
  "电视剧",
  "纪录片",
  "游戏",
  "音乐",
  "影视",
  "知识",
  "资讯",
  "小剧场",
  "时尚美妆",
  "动物",
  "音乐",
];

const loading = ref(false);

const recommend_videos: Ref<NamedVideo[]> = ref([]);
getVideoList(15).then((res) => {
  recommend_videos.value = res.data.data;
});
const noMore = computed(() => recommend_videos.value.length >= 40);

async function handleLoad() {
  if (loading.value || noMore.value) return;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  recommend_videos.value.push(...recommend_videos.value);
  loading.value = false;
}

// 实现header的视差效果
let initX = 0;
let moveX = 0;
let imgList: HTMLElement[] = [];
onMounted(() => {
  const elements = document.querySelectorAll(".header-container > img");
  elements.forEach((e) => {
    imgList.push(e as HTMLElement);
  });
});

const onMouseEnter = (e: MouseEvent) => {
  initX = e.clientX;
  imgList.forEach((img) => {
    img.style.transition = "";
  });
};
const onMouseMove = (e: MouseEvent) => {
  moveX = e.clientX - initX;
  imgList[23].style.transform = `rotate(${moveX * 0.00007}deg) scale(${1+moveX*0.00003})`;
  imgList[26].style.transform = `rotate(${-moveX * 0.001}deg) scale(${1+moveX*0.00005})`;
  imgList[28].style.transform = `translate(${-moveX * 0.05}px,0) rotate(${moveX * 0.008}deg)`;
  imgList[29].style.transform = `translate(${moveX * 0.12}px,0) rotate(${-moveX * 0.006}deg)`;

  imgList[30].style.transform = `translate(${moveX * 0.02 - 100}px,0px)`;
  imgList[31].style.transform = `translate(${moveX * 0.02 - 100}px,0) `;

  imgList[13].style.transform = `translate(${moveX * 0.01}px,0px)`;
};
const onMouseLeave = (e: MouseEvent) => {
  imgList.forEach((img) => {
    img.style.transition = "all ease-in-out 0.3s";
  });
  imgList[13].style.transform = "";
  imgList[26].style.transform = "";
  imgList[28].style.transform = "";
  imgList[29].style.transform = "";
  imgList[30].style.transform = "translate(-100px,0px)";
  imgList[31].style.transform = "translate(-100px,0px)";
};

const router = useRouter();
const onVideoClick = (videoID: number) => {
  const route = router.resolve({
    name: "video",
    params: {
      videoID,
    },
  });
  window.open(route.href, "_blank");
};
</script>

<template>
  <div id="home-page">
    <div
      class="header-container"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <div class="header-container-mask"></div>
      <img
        src="https://origin.picgo.net/2026/07/05/0b271407de79c5def.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/345b6e0fe3bcce70b4dda85984e6bd2e989ed383.png1c603d0c97e403e790.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/24d836a47b39a9646.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/333861a4461da8206.webp"
        class="header-img"
      />

      <img
        src="https://origin.picgo.net/2026/07/05/444a1fd091f196eff.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/57bb6fabc33c3e50d.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/6acb78ed7a611845e.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/77a6d511dbd030539.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/8025c878f4ede6b4b.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/9533ba628c8f63154.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/10e15c61915dc0a379.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/1150b92567bdf06aa7.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/123c904958396a3edb.webp"
        class="header-img"
      />

      <img
        src="https://origin.picgo.net/2026/07/05/13fef98c5dd2f3d492.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/14ce30854fd381e8c9.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/152aff78f8d542c374.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/160840674a6cb5e335.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/17fc5c80ce2c5e57f7.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/181d88da03666297c6.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/19804f9f1b46ab18d8.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/200efbd0bc8b7aaf96.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/21ab3a75a395d30fb2.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/22bfe87a3a5bcbb997.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/23a3f14a343f544f74.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/244545c7bf7212c901.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/25ca8e207d8de57af7.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/26fec1792c19782b69.webp"
        class="header-img"
        style="transform-origin: 1200px 160px;"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/27d7ac5cf5494df243.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/28504b4a2151714511.webp"
        class="header-img"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/291f95c14593675d87.webp"
        class="header-1"
        style="transform: translate(-100px, 0px)"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/30fd557c84760929c7.webp"
        class="header-img"
        style="transform: translate(-100px, 0px)"
      />
      <img
        src="https://origin.picgo.net/2026/07/05/3107494a7238f2eb89.webp"
        class="header-img"
      />
    </div>
    <div id="content">
      <div class="line-one">
        <div class="dynamic btn-container">
          <div class="header-btn">
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="icon-bg--icon"
            >
              <path
                d="M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
            </svg>
          </div>
          <span>动态</span>
        </div>
        <div class="hot btn-container">
          <div class="header-btn">
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="icon-bg--icon"
            >
              <path
                d="M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M15.125 16.0827C15.125 18.614 13.2782 20.666 11 20.666L11 11.4993C13.2782 11.4993 15.125 13.5514 15.125 16.0827Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M6.875 6.91667C6.875 9.44797 8.72183 11.5 11 11.5L11 2.33333C8.72182 2.33333 6.875 4.38536 6.875 6.91667Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M15.5833 7.375C13.052 7.375 11 9.22183 11 11.5H20.1667C20.1667 9.22183 18.1146 7.375 15.5833 7.375Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-darkreader-inline-stroke=""
                style="
                  --darkreader-inline-stroke: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
            </svg>
          </div>
          <span>动态</span>
        </div>
        <div class="tags-container">
          <n-grid
            :cols="12"
            :collapsed="true"
            :collapsed-rows="2"
            :x-gap="10"
            :y-gap="10"
          >
            <n-gi v-for="i in tagNames.length" :key="i">
              <n-button>{{ tagNames[i - 1] }}</n-button>
            </n-gi>
            <n-gi suffix class="suffix">
              <n-button>更多</n-button>
            </n-gi>
          </n-grid>
        </div>
        <div class="tags-right-container">
          <div class="tags-right-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="side-icon"
            >
              <!--[-->
              <path
                d="M0 0L24 0L24 24L0 24L0 0z"
                fill="#F7F7F703"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-f7f7f703,
                    rgba(227, 225, 221, 0.01)
                  );
                "
              ></path>
              <path
                d="M18 4.8L6 4.8C5.33726 4.8 4.8 5.33726 4.8 6L4.8 18C4.8 18.66276 5.33726 19.2 6 19.2L18 19.2C18.66276 19.2 19.2 18.66276 19.2 18L19.2 6C19.2 5.33726 18.66276 4.8 18 4.8z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M4 5.99998C4 4.89541 4.89544 3.99997 6 3.99997L18 3.99997C19.1046 3.99997 20.00004 4.89541 20.00004 5.99998L20.00004 18C20.00004 19.1046 19.1046 19.99992 18 19.99992L6 19.99992C4.89544 19.99992 4 19.1046 4 18L4 5.99998zM6 5.59998C5.77909 5.59998 5.6 5.77907 5.6 5.99998L5.6 18C5.6 18.22092 5.77908 18.39996 6 18.39996L18 18.39996C18.22092 18.39996 18.39996 18.22092 18.39996 18L18.39996 5.99998C18.39996 5.77906 18.22092 5.59998 18 5.59998L6 5.59998z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M15.99996 11.19931L8 11.19931C7.55818 11.19931 7.2 11.55749 7.2 11.99932C7.2 12.44112 7.55818 12.79932 8 12.79932L15.99996 12.79932C16.4418 12.79932 16.8 12.44112 16.8 11.99932C16.8 11.55749 16.4418 11.19931 15.99996 11.19931z"
                fill="#ffffffff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M15.99996 8.00062L8 8.00062C7.55818 8.00062 7.2 8.35878 7.2 8.80061C7.2 9.24244 7.55818 9.60061 8 9.60061L15.99996 9.60061C16.4418 9.60061 16.8 9.24244 16.8 8.80061C16.8 8.35878 16.4418 8.00062 15.99996 8.00062z"
                fill="#ffffffff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <path
                d="M11.2 14.4L8 14.4C7.55818 14.4 7.2 14.7582 7.2 15.20004C7.2 15.64188 7.55818 15.99996 8 15.99996L11.2 15.99996C11.64182 15.99996 12 15.64188 12 15.20004C12 14.7582 11.64182 14.4 11.2 14.4z"
                fill="#ffffffff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <!--]-->
            </svg>
            <span>专栏</span>
          </div>
          <div class="tags-right-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="side-icon"
            >
              <!--[-->
              <path
                d="M0.89371 0.57143L23.75086 0.57143L23.75086 23.42857L0.89371 23.42857L0.89371 0.57143z"
                fill="#F7F7F703"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-f7f7f703,
                    rgba(227, 225, 221, 0.01)
                  );
                "
              ></path>
              <path
                d="M4.70841 5.19295C5.2937 5.03613 5.8953 5.38346 6.05213 5.96874L9.42514 18.55703C9.58198 19.14229 9.23464 19.74389 8.64935 19.90069C8.06406 20.0576 7.46246 19.71029 7.30563 19.12491L3.93262 6.53667C3.77578 5.95138 4.12312 5.34978 4.70841 5.19295z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M5.27351 7.30093L10.54989 5.88712L13.46914 6.22925L16.10731 5.52234C16.52366 5.4108 16.94503 5.63347 17.04846 6.01973L18.99543 12.34011C19.09886 12.7264 18.84526 13.12994 18.42903 13.24149L15.79086 13.94834L12.87154 13.60629L7.59518 15.02011L5.27351 7.30093z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M4.63459 6.94483C4.7309 6.77202 4.89311 6.64559 5.08421 6.59439L10.36057 5.18058C10.44997 5.15663 10.5431 5.14986 10.63502 5.16063L13.4152 5.48645L15.91806 4.81581C16.66903 4.61457 17.5232 5.00021 17.75086 5.81514L19.6944 12.1248C19.69703 12.13349 19.69954 12.14206 19.70183 12.15086C19.92309 12.97623 19.37406 13.74549 18.61829 13.948L15.98011 14.65486C15.89074 14.67886 15.7976 14.6856 15.70571 14.67486L12.92549 14.34903L7.78448 15.72651C7.40264 15.8288 7.00859 15.60926 6.89474 15.23074L4.57307 7.51155C4.51609 7.3221 4.53829 7.11765 4.63459 6.94483zM6.19111 7.81225L8.09123 14.12983L12.68229 12.89977C12.77166 12.87577 12.8648 12.86903 12.95669 12.87977L15.7368 13.2056L18.23966 12.53497C18.26217 12.52891 18.27554 12.51874 18.28274 12.51109L16.34949 6.23501C16.3488 6.23285 16.34811 6.23067 16.34754 6.22849C16.33783 6.2252 16.32046 6.22243 16.29669 6.22882L13.65851 6.93571C13.56903 6.95967 13.47589 6.96645 13.384 6.95567L10.60387 6.62985L6.19111 7.81225z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <!--]-->
            </svg>
            <span>活动</span>
          </div>
          <div class="tags-right-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="side-icon"
            >
              <!--[-->
              <path
                d="M19.11943 4.38093L8.53291 4.38093C8.11213 4.38093 7.77102 4.72205 7.77102 5.14283L7.77102 8.67166L7.77928 8.78424C7.83369 9.15165 8.15038 9.43355 8.53291 9.43355L8.65256 9.43312L11.26813 9.32185L11.27639 9.43445C11.33081 9.80184 11.64754 10.08376 12.03006 10.08376L12.18743 12.96229L13.28743 14.06251L13.38183 14.14286C13.67954 14.35714 14.09714 14.33029 14.36491 14.06251L15.464 12.96229L19.11943 12.9624C19.54023 12.9624 19.88137 12.62126 19.88137 12.20046L19.88137 5.14283C19.88137 4.72205 19.54023 4.38093 19.11943 4.38093zM18.35657 5.90398L18.35657 11.43769L15.14949 11.43857L15.0296 11.44807C14.87189 11.47319 14.72503 11.54742 14.61074 11.66173L13.82629 12.44571L13.0416 11.66173L12.95006 11.58366C12.8208 11.48994 12.66446 11.43857 12.50286 11.43857L12.79086 8.55906L10.17703 8.67166L10.16877 8.55906C10.11434 8.19167 9.79766 7.90975 9.41512 7.90975L9.2937 7.90969L9.2937 5.90398L18.35657 5.90398z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M16.07166 7.42781C16.45417 7.42781 16.77086 7.70971 16.82526 8.07712L16.8336 8.1897L16.8336 17.33257C16.8336 17.71509 16.55166 18.03177 16.18423 18.08617L16.07166 18.0944L9.0857 18.09406L6.24303 20.22777C5.80353 20.55737 5.19983 20.32423 5.05576 19.84011L5.03216 19.73269L5.02398 19.61829L5.02285 18.09406L3.88113 18.0944C3.53685 18.0944 3.24591 17.86606 3.15149 17.55257L3.12749 17.44514L3.11922 17.33257L3.11922 8.1897C3.11922 7.80718 3.40114 7.49048 3.76854 7.43607L3.88113 7.42781L16.07166 7.42781zM8.45256 13.52377L6.16685 13.52377L6.05425 13.532C5.68686 13.58651 5.40494 13.9032 5.40494 14.28571C5.40494 14.70651 5.74606 15.04754 6.16685 15.04754L8.45256 15.04754L8.56514 15.03931C8.93255 14.98491 9.21446 14.66823 9.21446 14.28571C9.21446 13.86491 8.87335 13.52377 8.45256 13.52377zM10.73827 10.4769L6.16685 10.4769L6.05425 10.48517C5.68686 10.53958 5.40494 10.85627 5.40494 11.2388C5.40494 11.65959 5.74606 12.00069 6.16685 12.00069L10.73827 12.00069L10.85086 11.99245C11.21826 11.93802 11.50023 11.62134 11.50023 11.2388C11.50023 10.81801 11.15906 10.4769 10.73827 10.4769z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <!--]-->
            </svg>
            <span>社区中心</span>
          </div>
          <div class="tags-right-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="side-icon"
            >
              <!--[-->
              <path
                d="M0 0L24 0L24 24L0 24L0 0z"
                fill="#F7F7F703"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-f7f7f703,
                    rgba(227, 225, 221, 0.01)
                  );
                "
              ></path>
              <path
                d="M3.99984 6.40068C3.99984 5.95885 4.35802 5.60069 4.79984 5.60069L15.99984 5.60069C16.44168 5.60069 16.79988 5.95885 16.79988 6.40068L16.79988 10.00068L19.9998 7.60068L19.9998 16.80072L16.79988 14.40072L16.79988 17.60064C16.79988 18.04248 16.44168 18.40068 15.99984 18.40068L4.79984 18.40068C4.35802 18.40068 3.99984 18.04248 3.99984 17.60064L3.99984 6.40068z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M3.19985 6.40066C3.19985 5.517 3.91619 4.80066 4.79984 4.80066L15.99984 4.80066C16.88352 4.80066 17.5998 5.51701 17.5998 6.40066L17.5998 8.40066L19.5198 6.96066C19.7622 6.77885 20.08656 6.7496 20.35764 6.88512C20.6286 7.02064 20.79984 7.29764 20.79984 7.60066L20.79984 16.8006C20.79984 17.10372 20.6286 17.38068 20.35764 17.51616C20.08656 17.65176 19.7622 17.62248 19.5198 17.44068L17.5998 16.00068L17.5998 17.60064C17.5998 18.48432 16.88352 19.2006 15.99984 19.2006L4.79984 19.2006C3.9162 19.2006 3.19985 18.48432 3.19985 17.60064L3.19985 6.40066zM15.99984 6.40066L4.79984 6.40066L4.79984 17.60064L15.99984 17.60064L15.99984 14.4006C15.99984 14.0976 16.17108 13.82064 16.44204 13.68516C16.71312 13.54956 17.03748 13.57884 17.27988 13.76064L19.19988 15.20064L19.19988 9.20066L17.27988 10.64066C17.03748 10.82246 16.71312 10.85172 16.44204 10.7162C16.17108 10.58069 15.99984 10.30368 15.99984 10.00066L15.99984 6.40066z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <path
                d="M12.63456 12.93084L9.47683 15.03612C9.10921 15.28116 8.61252 15.1818 8.36743 14.81424C8.27982 14.68272 8.23307 14.5284 8.23307 14.37048L8.23307 10.16006C8.23307 9.71824 8.59124 9.36006 9.03307 9.36006C9.19102 9.36006 9.34542 9.40681 9.47683 9.49442L12.63456 11.59961C13.00224 11.84468 13.1016 12.3414 12.85644 12.70896C12.79788 12.79692 12.72252 12.87228 12.63456 12.93084z"
                fill="#ffffffff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-ffffff,
                    #e8e6e3
                  );
                "
              ></path>
              <!--]-->
            </svg>
            <span>直播</span>
          </div>
          <div class="tags-right-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="side-icon"
            >
              <!--[-->
              <path
                d="M19.33943 4.80001L16.25371 4.80001C14.42514 4.80001 13.39657 5.94287 12.82514 6.85715C12.71086 7.08573 12.25371 7.08573 12.13943 6.85715C11.68229 6.05715 10.65371 4.80001 8.71086 4.80001L5.62514 4.80001C4.82514 4.80001 4.13943 5.48573 4.13943 6.28573L4.13943 16C4.13943 16.8 4.82514 17.48571 5.62514 17.48571L8.71086 17.48571C10.53943 17.48571 11.568 18.74286 12.13943 19.54286C12.25371 19.77143 12.71086 19.77143 12.82514 19.54286C13.28229 18.74286 14.31086 17.48571 16.25371 17.48571L19.33943 17.48571C20.13943 17.48571 20.82514 16.8 20.82514 16L20.82514 6.17144C20.82514 5.37144 20.25371 4.80001 19.33943 4.80001zM11.568 12.57143L10.31086 14.85714L9.05371 12.57143L6.768 11.3143L9.05371 10.05715L10.31086 7.77144L11.568 10.05715L13.85371 11.3143L11.568 12.57143zM16.368 14.28571L15.68229 15.54286L14.88229 14.28571L13.62514 13.6L14.88229 12.91429L15.568 11.65715L16.25371 12.91429L17.51086 13.6L16.368 14.28571z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <!--]-->
            </svg>
            <span>课堂</span>
          </div>
          <div class="tags-right-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="side-icon"
            >
              <!--[-->
              <path
                d="M18.16229 5.52378C19.36731 5.52378 20.3544 6.45621 20.44171 7.63891L20.44789 7.8095L20.44789 16.95234C20.44789 18.15737 19.51554 19.14446 18.33291 19.23177L18.16229 19.23806L5.97181 19.23806C4.7668 19.23806 3.77961 18.3056 3.69235 17.12297L3.68609 16.95234L3.68609 7.8095C3.68609 6.60451 4.61851 5.61731 5.80121 5.53006L5.97181 5.52378L18.16229 5.52378zM14.68914 7.34128C14.24057 7.07799 13.64914 7.33809 13.55577 7.86781L12.34663 12.40594C11.96057 12.05474 11.47371 11.80491 10.92165 11.70758C9.36766 11.43357 7.88577 12.4712 7.61177 14.02514C7.33776 15.5792 8.37538 17.06103 9.92936 17.33509L10.07949 17.35749C11.57771 17.5416 12.97406 16.52126 13.2392 15.01749L14.84069 9.35157L15.90011 10.14427L15.97429 10.19341C16.30411 10.38517 16.73257 10.30351 16.96663 9.99065C17.21863 9.65373 17.14994 9.17624 16.81303 8.92416L14.76251 7.39006L14.68914 7.34128z"
                fill="#61666Dff"
                data-darkreader-inline-fill=""
                style="
                  --darkreader-inline-fill: var(
                    --darkreader-text-61666d,
                    #a7a094
                  );
                "
              ></path>
              <!--]-->
            </svg>
            <span>新歌热榜</span>
          </div>
        </div>
      </div>

      <div class="line-two">
        <div class="banner">
          <n-carousel show-arrow autoplay>
            <img
              class="banner-img"
              src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
            />
            <img
              class="banner-img"
              src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
            />
            <img
              class="banner-img"
              src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
            />
          </n-carousel>
        </div>
        <div class="intro-video-container">
          <n-grid
            cols="2 xxl:3"
            responsive="screen"
            :collapsed="true"
            :collapsed-rows="2"
            :x-gap="24"
            :y-gap="24"
          >
            <n-gi
              v-for="(item, index) in recommend_videos"
              :key="item.video.id"
            >
              <div class="intro-video-item">
                <div style="position: relative">
                  <img
                    :src="item.video.cover_url"
                    class="intro-video-cover"
                    @click="onVideoClick(item.video.id)"
                  />
                  <div class="intro-video-info">
                    <svg
                      class="view-icon"
                      style="
                        width: 20px;
                        height: 20px;
                        color: #fff;
                        margin-right: 4px;
                      "
                      data-v-0c3641b4=""
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 20 20"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M12.23275 9.1962C12.851516666666667 9.553483333333332 12.851516666666667 10.44665 12.232683333333332 10.803866666666666L9.57975 12.335600000000001C8.960983333333335 12.692816666666667 8.1875 12.246250000000002 8.187503333333334 11.531733333333333L8.187503333333334 8.4684C8.187503333333334 7.753871666666667 8.960983333333335 7.307296666666667 9.57975 7.66456L12.23275 9.1962z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span class="video-play-count">{{
                      formatPlayCount(item.video.play_count)
                    }}</span>
                    <span class="video-play-time">{{
                      formatPlayTime(item.video.play_time)
                    }}</span>
                  </div>
                </div>
                <h3 class="intro-video-title">
                  {{ item.video.title }}
                </h3>
                <h3 class="intro-video-author">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                    class="intro-video-svg"
                  >
                    <path
                      d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  {{
                    `${item.username} · ${dayjs(item.video.createTime).format("MM-DD")}`
                  }}
                </h3>
              </div>
            </n-gi>
          </n-grid>
        </div>
      </div>
      <div class="recommend-video-list">
        <n-infinite-scroll :distance="0" @load="handleLoad">
          <n-grid cols="4 xxl:5" responsive="screen" :x-gap="24" :y-gap="24">
            <n-gi
              v-for="(item, index) in recommend_videos"
              :key="item.video.id"
            >
              <div class="intro-video-item">
                <div style="position: relative">
                  <img
                    :src="item.video.cover_url"
                    class="intro-video-cover"
                    @click="onVideoClick(item.video.id)"
                  />
                  <div class="intro-video-info">
                    <svg
                      class="view-icon"
                      style="
                        width: 20px;
                        height: 20px;
                        color: #fff;
                        margin-right: 4px;
                      "
                      data-v-0c3641b4=""
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 20 20"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M12.23275 9.1962C12.851516666666667 9.553483333333332 12.851516666666667 10.44665 12.232683333333332 10.803866666666666L9.57975 12.335600000000001C8.960983333333335 12.692816666666667 8.1875 12.246250000000002 8.187503333333334 11.531733333333333L8.187503333333334 8.4684C8.187503333333334 7.753871666666667 8.960983333333335 7.307296666666667 9.57975 7.66456L12.23275 9.1962z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span class="video-play-count">{{
                      formatPlayCount(item.video.play_count)
                    }}</span>
                    <span class="video-play-time">{{
                      formatPlayTime(item.video.play_time)
                    }}</span>
                  </div>
                </div>
                <h3 class="intro-video-title">
                  {{ item.video.title }}
                </h3>
                <h3 class="intro-video-author">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                    class="intro-video-svg"
                  >
                    <path
                      d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  {{
                    `${item.username} · ${dayjs(item.video.createTime).format("MM-DD")}`
                  }}
                </h3>
              </div>
            </n-gi>
          </n-grid>

          <n-grid
            v-if="!noMore"
            cols="4 xxl:5"
            responsive="screen"
            :x-gap="24"
            :y-gap="24"
          >
            <n-gi v-for="i in 10" :key="i">
              <div class="skeleton-item">
                <n-skeleton height="180px" width="100%" class="skeleton" />
                <n-skeleton class="skeleton skeleton-text-1" />
                <n-skeleton class="skeleton skeleton-text-2" />
                <n-skeleton class="skeleton skeleton-text-3" />
              </div>
            </n-gi>
          </n-grid>

          <div v-if="noMore" class="text">没有更多了...</div>
        </n-infinite-scroll>
      </div>
    </div>
  </div>
</template>
<style scoped>
.intro-video-svg {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.hot {
  margin-left: 24px;
  margin-right: 36px;
}
.btn-container > span {
  display: block;
  font-size: 14px;
  color: #18191c;
  margin-top: 6px;
  caret-color: transparent;
}
.header-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.dynamic > .header-btn {
  background-color: #ff9212;
}
.hot > .header-btn {
  background-color: #f07775;
}
.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tags-right-item {
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  caret-color: transparent;
}
.tags-right-item > span {
  font-size: 14px;
  color: #61666d;
}
.side-icon {
  margin-right: 4px;
  width: 20px;
  height: 20px;
  fill: #61666d;
  transition: fill 0.3s;
}
.tags-right-container {
  width: auto;
  height: 74px;
  margin-left: auto;
  display: grid;
  grid-template-columns: 86px 86px 114px;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 10px;
}
.line-one {
  display: flex;
  align-items: center;
}
.banner-img {
  height: 100%;
  object-fit: cover;
}
.header-1 {
  width: 207px;
  height: 136px;
  object-fit: cover;

  position: absolute;
  left: 500px;
  top: 10px;
}
.header-container-mask {
  width: 100%;
  height: 180px;
  position: absolute;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0) 60%
  );
  z-index: 100;
}
.header-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  display: flow-root;
}
.header-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.skeleton-item {
  border-radius: 6px;
}
.skeleton {
  background-color: #f1f2f3;
  border-radius: 6px;
  display: inline-block;
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
  line-height: 44px;

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
#content {
  height: 100vh;
  background: #fff;
  padding: 20px 110px;
}
.n-button {
  width: 100%;
}
.tags-container {
  width: 1300px;
  padding-right: 36px;
  border-right: 1px solid #e3e5e7;
}
.line-two {
  margin-top: 20px;
  display: flex;
  flex-wrap: nowrap;
}
.banner {
  flex: 0 0 630px;
  max-width: 630px;
  height: 450px;
  margin-right: 24px;
  border-radius: 6px;
  overflow: hidden;
}
.carousel-img {
  object-fit: cover;
}
.intro-video-container {
  flex: 1 0 0;
}
.intro-video-cover {
  width: 100%;
  aspect-ratio: 310 / 170;
  object-fit: cover;
  cursor: pointer;

  border-radius: 6px;
}
.intro-video-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  z-index: 100;
  padding: 4px 10px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.1) 60%,
    rgba(0, 0, 0, 0) 100%
  );

  border-radius: 6px;
}
.video-play-count,
.video-play-time {
  color: #fff;
  font-size: 13px;
}

.video-play-time {
  margin-left: auto;
}
</style>
