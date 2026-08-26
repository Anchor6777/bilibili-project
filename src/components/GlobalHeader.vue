<script setup lang="ts">
import { ref, useTemplateRef, watch } from "vue";
import router from "../router";
import { useLoginStore } from "../store/userLoginStore";
import { useNotification } from "naive-ui";
import { userLogin } from "../api/user";
import type { User } from "../model/TypeDefinition";
import { useNavBarStore } from "../store/navBarStore";
import dayjs from "dayjs";

const props = defineProps(["isOnTop"]);
const navBar = useTemplateRef<HTMLDivElement>("navBar");
const navBarStore = useNavBarStore();

watch(
  () => props.isOnTop,
  (v) => {
    if (!navBarStore.slideChange) {
      return;
    }
    if (v) {
      navBar.value?.classList.remove("alter");
    } else {
      navBar.value?.classList.add("alter");
    }
  },
);

watch(
  () => navBarStore.navBarStyle,
  (v) => {
    if (v === 0) {
      navBar.value?.classList.remove("alter");
    } else {
      navBar.value?.classList.add("alter");
    }
  },
);

const onNavClick = (path: string) => {
  if (path === "/notification" && userInfo.loginInfo.id === 0) {
    notification["warning"]({
      content: `请先登录`,
      meta: `请先登录`,
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  router.push({
    path: path,
  });
};
const showModal = ref(false);

let username = ref("");
let password = ref("");

const userInfo = useLoginStore();
const notification = useNotification();

const handleSubmit = async () => {
  try {
    const res = await userLogin(username.value, password.value);
    if (res.data.code !== 200) {
      notification["error"]({
        content: `登录失败`,
        meta: `${res.data.message}: ${res.data.description}`,
        duration: 2500,
        keepAliveOnHover: true,
      });
      return;
    }
    let newUser: User = res.data.data.userInfo;
    // 更新用户信息
    userInfo.setLoginInfo(newUser);

    // 保存token
    let tokenInfo = {
      token: res.data.data.token,
      refreshToken: res.data.data.refreshToken,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };
    localStorage.setItem("tokenInfo",JSON.stringify(tokenInfo));
  
    notification["success"]({
      content: `登录成功`,
      meta: "登陆成功",
      duration: 2500,
      keepAliveOnHover: true,
    });
    showModal.value = false;
  } catch (error) {
    console.log(error);
  }
};

const gotoUserSpace = () => {
  const route = router.resolve({
    name: "userSpace",
    params: {
      userID: 3,
    },
  });
  window.open(route.href, "_blank");
};
</script>

<template>
  <div class="global-header" ref="navBar">
    <div class="left-side">
      <a class="nav-title" href="" @click="onNavClick('/')">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="zhuzhan-icon"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
            fill="currentColor"
          ></path>
        </svg>
        <span>首页</span>
      </a>
      <div class="nav-item" @click="gotoUserSpace()">番剧</div>
      <div class="nav-item">直播</div>
      <div class="nav-item">游戏中心</div>
    </div>
    <div class="right-side">
      <img
        v-if="userInfo.isLogin()"
        class="avatar"
        @click="showModal = true"
        :src="userInfo.loginInfo.avatar"
      />
      <div v-else class="avatar empty-avatar" @click="showModal = true"">
        <span>登录</span>
      </div>
      <div class="nav-item-container" @click="onNavClick('/notification')">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="right-entry-icon"
        >
          <path
            d="M15.435 17.7717H4.567C2.60143 17.7717 1 16.1723 1 14.2047V5.76702C1 3.80144 2.59942 2.20001 4.567 2.20001H15.433C17.3986 2.20001 19 3.79943 19 5.76702V14.2047C19.002 16.1703 17.4006 17.7717 15.435 17.7717ZM4.567 4.00062C3.59327 4.00062 2.8006 4.79328 2.8006 5.76702V14.2047C2.8006 15.1784 3.59327 15.9711 4.567 15.9711H15.433C16.4067 15.9711 17.1994 15.1784 17.1994 14.2047V5.76702C17.1994 4.79328 16.4067 4.00062 15.433 4.00062H4.567Z"
            fill="currentColor"
          ></path>
          <path
            d="M9.99943 11.2C9.51188 11.2 9.02238 11.0667 8.59748 10.8019L8.5407 10.7635L4.3329 7.65675C3.95304 7.37731 3.88842 6.86226 4.18996 6.50976C4.48954 6.15544 5.0417 6.09699 5.4196 6.37643L9.59412 9.45943C9.84279 9.60189 10.1561 9.60189 10.4067 9.45943L14.5812 6.37643C14.9591 6.09699 15.5113 6.15544 15.8109 6.50976C16.1104 6.86409 16.0478 7.37731 15.6679 7.65675L11.4014 10.8019C10.9765 11.0667 10.487 11.2 9.99943 11.2Z"
            fill="currentColor"
          ></path>
        </svg>
        <div class="text">消息</div>
      </div>
      <div class="nav-item-container" @click="onNavClick('/video')">
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="right-entry-icon"
        >
          <g clip-path="url(#clip0)">
            <path
              d="M10 10.743C7.69883 10.743 5.83333 8.87747 5.83333 6.5763C5.83333 4.27512 7.69883 2.40964 10 2.40964V10.743Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            ></path>
            <path
              d="M10 10.743C10 13.0441 8.1345 14.9096 5.83333 14.9096C3.53217 14.9096 1.66667 13.0441 1.66667 10.743H10Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            ></path>
            <path
              d="M10 10.743C10 8.44182 11.8655 6.57632 14.1667 6.57632C16.4679 6.57632 18.3333 8.44182 18.3333 10.743H10Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            ></path>
            <path
              d="M9.99999 10.743C12.3012 10.743 14.1667 12.6085 14.1667 14.9096C14.1667 17.2108 12.3012 19.0763 9.99999 19.0763V10.743Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0">
              <rect
                width="20"
                height="20"
                fill="currentColor"
                transform="matrix(-1 0 0 1 20 0.742981)"
              ></rect>
            </clipPath>
          </defs>
        </svg>
        <div class="text">动态</div>
      </div>
    </div>
  </div>
  <n-modal v-model:show="showModal" style="max-width: 30vw">
    <n-card>
      <n-tabs
        class="card-tabs"
        default-value="signin"
        size="large"
        animated
        pane-wrapper-style="margin: 0 50px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input placeholder="请输入用户名" v-model:value="username" />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input placeholder="请输入密码" v-model:value="password" />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong @click="handleSubmit">
            登录
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input placeholder="请输入用户名" />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input placeholder="请输入密码" />
            </n-form-item-row>
            <n-form-item-row label="重复密码">
              <n-input placeholder="再次输入密码" />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong> 注册 </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-modal>
</template>
<style scoped>
.empty-avatar > span{
  font-size: 14px;
  color: #e8e6e3;
}
.empty-avatar{
  background-color: #00aeec;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-right: 24px;
}
.nav-item-container > .text {
  font-size: 14px;
  color: #fff;
  line-height: 14px;
  cursor: pointer;
  transition: all ease-in 0.5s;
}
.right-entry-icon {
  color: #fff;
  cursor: pointer;

  transition: all ease-in 0.5s;
}
.right-entry-icon:hover {
  animation: nav-item-anime 0.4s;
}
.avatar {
  border-radius: 9999px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  margin-right: 14px;
}
.right-side {
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;

  padding-right: 200px;
}
.left-side {
  height: 100%;
  width: 300px;
  display: flex;
  justify-content: start;
  padding-left: 16px;
}
.global-header {
  height: 64px;
  background-color: transparent;
  position: sticky;
  top: 0;
  z-index: 999;
  position: relative;

  transition: all ease-in 0.5s;
}
.nav-item {
  height: 64px;
  font-size: 14px;
  color: #ffffff;
  line-height: 64px;
  vertical-align: middle;
  margin-left: 20px;
  cursor: pointer;

  transition: all ease-in-out 0.5s;
}
.nav-item:hover {
  animation: nav-item-anime 0.3s;
}
.nav-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ffffff;
  text-decoration: none;

  transition: all ease-in-out 0.5s;
}

.global-header.alter {
  background-color: #ffffff;
  box-shadow: 0 2px 4px #00000014;
}
.global-header.alter .nav-item,
.global-header.alter .nav-title,
.global-header.alter .right-entry-icon {
  color: #18191c;
}
.global-header.alter .text {
  color: #61666d;
}

.zhuzhan-icon {
  margin-right: 10px;
}

@keyframes nav-item-anime {
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
