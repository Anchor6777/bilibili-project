import myAxios from "../request";

// 关注
export const userFocus = async (id: number, toId: number) => {
  return myAxios.request({
    url: "/relation/focus",
    method: "POST",
    data: {
      id,
      toId,
    },
  });
};

// 取关
export const userUnfocus = async (id: number, toId: number) => {
  return myAxios.request({
    url: "/relation/unfocus",
    method: "POST",
    data: {
      id,
      toId,
    },
  });
};

// 粉丝数
export const getFansCount = async (id: number) => {
  return myAxios.request({
    url: "/relation/fans_count",
    method: "GET",
    params: {
      id,
    },
  });
};

// 关注数
export const getFollowsCount = async (id: number) => {
  return myAxios.request({
    url: "/relation/follows_count",
    method: "GET",
    params: {
      id,
    },
  });
};

// 获取关注信息（ID为'id'的用户，是否关注了ID为'toId'的用户）
export const getFocusInfo = async (id: number, toId: number) => {
  return myAxios.request({
    url: "/relation/get_focus_info",
    method: "GET",
    params: {
      id,
      toId,
    },
  });
};
