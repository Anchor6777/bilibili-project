import type { Router } from "vue-router";
import { verifyToken } from "../api/user";
import { getToken } from "../constant";
export function setupAuthRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (!to.meta.requiresAuth) return true;

    try {
      let access_token = getToken();
      if (!access_token) {
        // 重定向到主页
        return { name: "home"};
      }
      // aToken过期，rToken有效，返回 40100 会在这里被拦截器接住
      // 自动换新 token 后重放，守卫拿到的已是重放结果
      const res = await verifyToken(access_token,false);
      if (res.data.code === 200) {
        return true;
      } else {
        return { name: "home"};
      }
    } catch (error) {
      // 网络异常 / 5xx：不因为连不上就登出用户，交给页面自己报错
      console.error("[guard] 报错", error);
      return false;
    }
  });
}
