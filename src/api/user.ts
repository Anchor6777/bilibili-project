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