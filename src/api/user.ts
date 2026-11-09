import { getRefreshToken, getToken } from "../constant";
import myAxios from "../request";

export const userLogin = async (un: any, pw: any) => {
  return myAxios.request({
    url: "/user/login",
    method: "POST",
    data: {
      username: un,
      password: pw,
    },
  });
};

export const refresh = async (refreshToken: string) => {
  return myAxios.request({
    url: "/user/refresh",
    method: "GET",
    params: {
      refreshToken,
    },
  });
};

/**
 * 验证token是否有效
 * @param token token或rToken
 * @param isRefresh 如果是rToken，为true
 * @returns 
 */
export const verifyToken = async (token: string,isRefresh:boolean) => {
  return myAxios.request({
    url: "/user/verify",
    method: "GET",
    params: {
      token: isRefresh? getRefreshToken() : getToken(),
      isRefresh,
    },
  });
};

export const getCurrentUser = async () => {
  return myAxios.request({
    url: "/user/getCurrentUser",
    method: "GET",
  });
};

export const userLogout = async () => {
  return myAxios.request({
    url: "/user/logout",
    method: "POST",
  });
};

export const userRegister = async (un: any, pw: any, cpw: any) => {
  return myAxios.request({
    url: "/user/register",
    method: "POST",
    data: {
      username: un,
      password: pw,
      checkPassword: cpw,
    },
  });
};

// 根据ID获取用户信息
export const getUserInfoById = async (id: number) => {
  return myAxios.request({
    url: "/user/one",
    method: "GET",
    params: {
      id,
    },
  });
};
