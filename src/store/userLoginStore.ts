import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "../model/TypeDefinition";
import { getCurrentUser } from "../api/user";

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

    // 远程获取登录用户信息
    const fetchLoginInfo = async () => {
      const res = await getCurrentUser();
      if (res.data !== "") {
        loginInfo.value = res.data;
      }
    };

    // 单独设置用户信息
    function setLoginInfo(newLoginInfo: any) {
      loginInfo.value = newLoginInfo;
    }

    // 用户是否登录
    function isLogin() {
      return loginInfo.value.id !== 0;
    }

    return { loginInfo, fetchLoginInfo, setLoginInfo,isLogin };
  },
  persist: true,
});
