import type { AxiosResponse } from "axios";
import type {
  SendDanmuRequest,
  VideoCommentResponse,
} from "../model/TypeDefinition";
import myAxios from "../request";

export const getVideoList = async (count: number) => {
  return myAxios.request({
    url: "/video/video_list",
    method: "GET",
    params: {
      count,
    },
  });
};

export const getVideoByID = async (videoID: number) => {
  return myAxios.request({
    url: "/video/one",
    method: "GET",
    params: {
      videoID,
    },
  });
};

export const getVideoListByUserID = async (uid:number,count: number) => {
  return myAxios.request({
    url: "/video/user_video_list",
    method: "GET",
    params: {
      uid,
      count,
    },
  });
};

export const getAllComments = async (videoID: number) => {
  return myAxios.request<AxiosResponse<VideoCommentResponse[]>>({
    url: "/video/get_all_comment",
    method: "GET",
    params: {
      videoID,
    },
  });
};

export const sendComment = async (
  uid: number,
  video_id: number,
  parent_id: number,
  reply_to_uid: number,
  content: string,
) => {
  return myAxios.request({
    url: "/video/send_comment",
    method: "POST",
    data: {
      uid,
      video_id,
      parent_id,
      reply_to_uid,
      content,
    },
  });
};

export const getDanmu = async (videoID: number) => {
  return myAxios.request({
    url: "/video/danmu/v3/",
    method: "GET",
    params: {
      id: videoID,
    },
  });
};

export const sendDanmu = async (body: SendDanmuRequest) => {
  return myAxios.request({
    url: "/video/danmu/v3/",
    method: "POST",
    data: body,
  });
};
