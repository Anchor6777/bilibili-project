<script setup lang="ts">
import { ref } from "vue";
import GlobalHeader from "./GlobalHeader.vue";
import { useLoginStore } from "../store/userLoginStore.ts";
import {
  getFansCount,
  getFocusInfo,
  getFollowsCount,
  userFocus,
  userUnfocus,
} from "../api/relation.ts";
import { useRoute, useRouter } from "vue-router";
import { useNotification } from "naive-ui";
import type { User, Video } from "../model/TypeDefinition.ts";
import { getUserInfoById } from "../api/user.ts";
import { getVideoListByUserID } from "../api/video.ts";
import { formatPlayCount, formatPlayTime } from "../constant.ts";
import dayjs from "dayjs";

const notification = useNotification();
const userLoginInfo = useLoginStore();
const router = useRouter();
const route = useRoute();

// 「主页对应用户」的id
const userID = Number(route.params.userID);
// 「主页对应用户」的个人信息
const userInfo = ref<User | undefined>(undefined);
// 粉丝数、关注数
const fansCount = ref(0);
const followsCount = ref(0);
// 是否隐藏‘关注’、‘发消息’按钮（当「登录用户」查看自己的主页时隐藏）
const hideBtn = ref(
  userLoginInfo.isLogin() && userLoginInfo.loginInfo.id === userID,
);
// 「登录用户」是否关注「主页对应用户」
const focusStatus = ref(false);
// 用户发布的视频列表
const videoList = ref<Video[]>([]);

getVideoListByUserID(userID, 10).then((res) => {
  videoList.value = res.data.data;
});

if (!hideBtn.value && userLoginInfo.isLogin()) {
  getFocusInfo(userLoginInfo.loginInfo.id, userID).then((res) => {
    focusStatus.value = res.data.data;
  });
}

getUserInfoById(userID).then((res) => {
  userInfo.value = res.data.data;
});
getFansCount(userID).then((res) => {
  fansCount.value = res.data.data;
  console.log(fansCount.value);
});
getFollowsCount(userID).then((res) => {
  followsCount.value = res.data.data;
});

const onFocusBtnClick = async () => {
  // 未登录
  if (!userLoginInfo.isLogin()) {
    notification["error"]({
      content: "错误",
      meta: "请先登录",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  // 不能关注自己
  if (userLoginInfo.loginInfo.id === userID) {
    notification["error"]({
      content: "错误",
      meta: "不能关注自己",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  // 已经关注了，取关
  if (focusStatus.value) {
    const res = await userUnfocus(userLoginInfo.loginInfo.id, userID);
    if (res.data.code === 200 && res.data.data === true) {
      focusStatus.value = false;
      notification["success"]({
        content: "取关成功",
        meta: "",
        duration: 1000,
        keepAliveOnHover: true,
      });
    } else {
      notification["error"]({
        content: "错误",
        meta: res.data.description,
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  } else {
    // 关注
    const res = await userFocus(userLoginInfo.loginInfo.id, userID);
    if (res.data.code === 200 && res.data.data === true) {
      focusStatus.value = true;
      notification["success"]({
        content: "关注成功",
        meta: "",
        duration: 1000,
        keepAliveOnHover: true,
      });
    } else {
      notification["error"]({
        content: "错误",
        meta: res.data.description,
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  }
  // 重新获取作者粉丝数
  // const res = await getFansCount(authorInfo.value.id);
  // authorFansCount.value = res.data.data;
};

const onMessageClick = () => {
  if (!userLoginInfo.isLogin()) {
    notification["error"]({
      content: "错误",
      meta: "请先登录",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  if (userLoginInfo.loginInfo.id === userID) {
    notification["error"]({
      content: "错误",
      meta: "不能给自己发消息",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  const route = router.resolve({
    name: "notification",
    params: {
      selectIndex: -1,
      another_id: userID,
    },
  });
  window.open(route.href, "_blank");
};

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
  <div id="user-info-page">
    <div class="header-container">
      <div class="header-container-mask">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
      <img
        class="header-toutu"
        src="https://origin.picgo.net/2026/08/03/1sz3p8w2Sk.png3840w_400h_1c_100q044363d4ea4511d1.avif"
      />
      <div :class="{ 'btn-container': true, hide: hideBtn }">
        <div
          :class="{ 'focus-btn': true, focused: focusStatus }"
          @click="onFocusBtnClick"
        >
          {{ focusStatus ? "已关注" : "+ 关注" }}
        </div>
        <div class="msg-btn" @click="onMessageClick">发消息</div>
      </div>
      <div class="user-info-container">
        <img class="user-avatar" :src="userInfo?.avatar" />
        <div class="user-name">{{ userInfo?.username }}</div>
      </div>
    </div>
    <div class="top-wrapper">
      <div class="tabs-wrapper">
        <n-tabs
          type="line"
          style="
            --n-bar-color: #00aeec;
            --n-tab-font-size: 16px;
            --n-bar-width: 10px;
          "
        >
          <n-tab name="主页"><div class="tab-item">主页</div></n-tab>
          <n-tab name="动态"><div class="tab-item">动态</div></n-tab>
          <n-tab name="投稿"><div class="tab-item">投稿</div></n-tab>
        </n-tabs>
      </div>
      <div class="relation-info-wrapper">
        <div class="item">
          <div class="item-title">关注数</div>
          <div class="item-number">{{ followsCount }}</div>
        </div>
        <div class="item">
          <div class="item-title">粉丝数</div>
          <div class="item-number">{{ fansCount }}</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="video-container">
        <div class="header">
          <div class="video-count">
            视频<span> · {{ formatPlayCount(videoList.length) }}</span>
          </div>
          <div class="order-way"></div>
        </div>
        <div class="video-list">
          <n-grid cols="4 xxl:5" responsive="screen" :x-gap="24" :y-gap="24">
            <n-gi v-for="(item, index) in videoList" :key="item.id">
              <div class="intro-video-item">
                <div style="position: relative">
                  <img
                    :src="item.cover_url"
                    class="intro-video-cover"
                    @click="onVideoClick(item.id)"
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
                      formatPlayCount(item.play_count)
                    }}</span>
                    <span class="video-play-time">{{
                      formatPlayTime(item.play_time)
                    }}</span>
                  </div>
                </div>
                <h3 class="intro-video-title">
                  {{ item.title }}
                </h3>
                <h3 class="intro-video-author">
                  {{ `${dayjs(item.createTime).format("MM-DD")}` }}
                </h3>
              </div>
            </n-gi>
          </n-grid>
        </div>
      </div>
      <div class="info-container">
        <div class="info-title">个人资料</div>
        <div class="info-item">
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
          {{ userInfo?.id }}
        </div>
        <div class="info-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            class="intro-video-svg"
          >
            <path
              d="M19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.045 15.045 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2.001 2.001 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07c.53 8.54 7.36 15.36 15.89 15.89c1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"
              fill="currentColor"
            ></path>
          </svg>
          {{ userInfo?.phone }}
        </div>
        <div class="info-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            class="intro-video-svg"
          >
            <path
              d="M28 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-2.2 2L16 14.78L6.2 8zM4 24V8.91l11.43 7.91a1 1 0 0 0 1.14 0L28 8.91V24z"
              fill="currentColor"
            ></path>
          </svg>
          {{ userInfo?.email }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.info-item {
  font-size: 13px;
  margin-bottom: 6px;
}
.info-title {
  font-size: 16px;
  margin-bottom: 10px;
}
.video-container {
  flex: 1;
  color: #18191c;
}
.info-container {
  /* box-sizing: border-box; */
  flex-basis: 280px;
  height: min-content;
  background-color: #f6f7f8;
  margin-left: 32px;
  margin-top: 40px;
  border-radius: 6px;
  padding: 20px 16px 24px;
}
.tab-item {
  padding: 10px 0;
}
.item {
  margin-left: 24px;
}
.item > .item-title {
  font-size: 13px;
  color: #61666d;
}
.item > .item-number {
  font-size: 14px;
  color: #18191c;
  text-align: center;
}
.relation-info-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.top-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  padding: 0 140px;
  border-bottom: 1px solid #00000012;
}
.tabs-wrapper :deep(.n-tabs-tab) {
  font-weight: 400;
  color: #18191c;
}
.tabs-wrapper :deep(.n-tabs-tab:hover) {
  font-weight: 400;
  color: #00aeec;
}
.tabs-wrapper :deep(.n-tabs-tab.n-tabs-tab--active) {
  font-weight: 700;
  color: #00aeec;
}
.video-list {
  margin-top: 14px;
}
.video-play-count,
.video-play-time {
  color: #fff;
  font-size: 13px;
}

.video-play-time {
  margin-left: auto;
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
}
.intro-video-svg {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  color: #61666d;
  margin-right: 4px;
}
.intro-video-author {
  font-size: 13px;
  font-weight: 500;
  color: #a9a195;
  margin: 0;
}
.intro-video-title {
  height: 40px;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  margin-top: 4px;
  line-height: 20px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.intro-video-item {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
}
.main {
  padding: 0 140px;
  display: flex;
}
.video-count {
  font-size: 24px;
  font-weight: 600;
  color: #18191c;
}
.video-count > span {
  font-size: 16px;
  font-weight: 400;
  color: #61666d;
}
.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-right: 8px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}
.user-avatar {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 16px;
}
.user-info-container {
  display: flex;
  align-items: center;
  position: absolute;
  left: 140px;
  bottom: 20px;
  z-index: 200;
}
.msg-btn {
  width: 150px;
  height: 34px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: #ffffff24;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.focus-btn {
  width: 150px;
  height: 34px;

  font-size: 14px;
  font-weight: 600;
  color: #fff;

  background-color: #00aeec;
  border-radius: 6px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  margin-right: 24px;
}
.focused {
  background-color: #ffffff24;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.hide {
  display: none;
}
.btn-container {
  display: flex;
  align-items: center;
  position: absolute;
  right: 140px;
  bottom: 20px;
  z-index: 200;
}
.header-container-mask > .top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 106px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}
.header-container-mask > .bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 117px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}
.header-container-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
.header-toutu {
  width: 100%;
  object-fit: cover;
}
.header-container {
  position: relative;
}
</style>
