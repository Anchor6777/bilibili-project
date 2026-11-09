import axios from "axios";
import { refresh } from "./api/user";
import { useLoginStore } from "./store/userLoginStore";
import { getRefreshToken, getToken } from "./constant";

const myAxios = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
  withCredentials: true,
});

// 请求拦截器，在请求头添加 Authorization 字段
myAxios.interceptors.request.use((config) => {
  let str = localStorage.getItem("tokenInfo");
  if (!str) {
    return config;
  }
  let tokenInfo = JSON.parse(str);
  config.headers.Authorization = "Bearer " + tokenInfo.token;
  return config;
});

myAxios.interceptors.response.use(async (response) => {
  let { data, config } = response;
  if (
    localStorage.getItem("tokenInfo") &&
    data.code === 40100 &&
    !config.url?.includes("/user/refresh")
  ) {
    let refreshToken = getRefreshToken();
    let res = await refresh(refreshToken);
    if (res.data.code === 200 && res.data.data) {
      // 保存token
      let tokenInfo = {
        token: res.data.data.token,
        refreshToken: res.data.data.refreshToken,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };
      localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
      // 当调用verify验证token/rToken时，token过期->刷新token->重新发起请求
      // 在重新发起请求时，要更改参数为更新后的token/rToken，否则会死循环，语义也不对。
      if(config.url?.startsWith("/user/verify")){
        if(config.params.isRefresh === true){
          config.params.token = getRefreshToken();
        }else{
          config.params.token = getToken();
        }
      }
      return myAxios(config);
    } else {
      // refreshToken失效，置空用户登录信息，提示用户重新登陆
      let userInfo = useLoginStore();
      userInfo.resetLoginInfo();
    }
  }
  return response;
});

export default myAxios;
