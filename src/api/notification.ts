import myAxios from "../request";

export const getRecentChatRecord = async (id: number) => {
  return myAxios.request({
    url: "/new_msg/recent",
    method: "GET",
    params: {
      id,
    },
  });
};

export const getOneChatRecord = async (uid:number,anotherId: number) => {
  return myAxios.request({
    url: "/new_msg/one",
    method: "GET",
    params: {
      uid,
      anotherId,
    },
  });
};
