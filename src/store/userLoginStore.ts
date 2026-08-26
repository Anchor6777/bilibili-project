import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "../model/TypeDefinition";

export const useLoginStore = defineStore("loginInfo", {
  state: () => {
    const loginInfo = ref<User>({
      id: 0,
      username: "未登录",
      gender: 0,
      phone: "",
      avatar: "",
      email: "",
    });

    // 设置用户信息
    function setLoginInfo(newLoginInfo: any) {
      loginInfo.value = newLoginInfo;
    }

    // 判断用户是否登录
    function isLogin() {
      return loginInfo.value.id !== 0;
    }

    // 重置用户信息
    function resetLoginInfo() {
      loginInfo.value = {
        id: 0,
        username: "未登录",
        gender: 0,
        phone: "",
        avatar: "",
        email: "",
      };
    }

    return { loginInfo, setLoginInfo, resetLoginInfo, isLogin };
  },
  persist: true,
});
