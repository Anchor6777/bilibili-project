<script setup lang="ts">
// @ts-ignore
import DPlayer from "dplayer";
import { computed, onMounted, ref, watch, type Ref } from "vue";
import {
  getAllComments,
  getDanmu,
  getVideoByID,
  getVideoList,
  sendComment,
  sendDanmu,
} from "../api/video";
import type {
  NamedVideo,
  User,
  Video,
  VideoComment,
  VideoCommentResponse,
} from "../model/TypeDefinition";
import { useNavBarStore } from "../store/navBarStore";
import { getUserInfoById } from "../api/user";
import { useLoginStore } from "../store/userLoginStore";
import { useNotification } from "naive-ui";
import {
  getFansCount,
  getFocusInfo,
  userFocus,
  userUnfocus,
} from "../api/relation";
import { useRoute, useRouter } from "vue-router";
import { formatPlayCount, formatPlayTime } from "../constant";

const userLoginStore = useLoginStore();
const notification = useNotification();
const router = useRouter();
const route = useRoute();

const navBarStore = useNavBarStore();
navBarStore.setStyle(1);
navBarStore.setSlideChange(false);

// 视频信息
const videoInfo: Ref<Video | undefined> = ref();
let videoID = Number(route.params.videoID);
if (!videoID) videoID = 1;
onMounted(async () => {
  const res = await getVideoByID(videoID);
  videoInfo.value = res.data.data;
  const dp = new DPlayer({
    container: document.querySelector(".video-box"),
    video: {
      url: videoInfo.value?.source_url,
    },
    danmaku: {
      id: videoID, //视频id, 会拼接在url中
      api: "http://localhost:8080/video/danmu/", //必填，叫后台提供
      user: userLoginStore.isLogin()
        ? userLoginStore.loginInfo.username
        : "未登录", //弹幕作者
      bottom: "15%",
      unlimited: true,
      // DPlayer发送弹幕的请求不支持设置cookie，只支持通过token登录。
      // token: "123",
    },
  });
});

// 视频作者信息
const authorInfo: Ref<User | undefined> = ref();
// 视频作者的粉丝数
const authorFansCount = ref(0);
watch(videoInfo, async (v) => {
  const res = await getUserInfoById(v!.uid);
  authorInfo.value = res.data.data;
});

const tagList = computed(() => {
  let tags: string[] = videoInfo.value ? videoInfo.value.tags.split(";") : [];
  return tags;
});

// 用户是否关注了视频作者
const focusStatus = ref(false);
watch(authorInfo, async (author) => {
  if (!author) {
    return;
  }
  if (userLoginStore.isLogin()) {
    const res = await getFocusInfo(userLoginStore.loginInfo.id, author.id);
    focusStatus.value = res.data.data;
    const res2 = await getFansCount(author.id);
    authorFansCount.value = res2.data.data;
  }
});

const onFocusBtnClick = async () => {
  // 未登录
  if (!userLoginStore.isLogin()) {
    notification["error"]({
      content: "错误",
      meta: "请先登录",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  // 作者信息未加载完成
  if (!authorInfo.value) {
    notification["error"]({
      content: "错误",
      meta: "正在加载作者信息，请稍等",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  // 不能关注自己
  if (userLoginStore.loginInfo.id === authorInfo.value.id) {
    notification["error"]({
      content: "错误",
      meta: "不能关注自己",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  // 已经关注了，取关
  if (focusStatus.value) {
    const res = await userUnfocus(
      userLoginStore.loginInfo.id,
      authorInfo.value!.id,
    );
    if (res.data.code === 200 && res.data.data === true) {
      focusStatus.value = false;
    } else {
      notification["error"]({
        content: "错误",
        meta: res.data.description,
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  } else {
    // 关注
    const res = await userFocus(
      userLoginStore.loginInfo.id,
      authorInfo.value!.id,
    );
    if (res.data.code === 200 && res.data.data === true) {
      focusStatus.value = true;
    } else {
      notification["error"]({
        content: "错误",
        meta: res.data.description,
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  }
  // 重新获取作者粉丝数
  const res = await getFansCount(authorInfo.value.id);
  authorFansCount.value = res.data.data;
};

const commentInputValue = ref("");
const commentInfo: Ref<VideoCommentResponse[]> = ref([]);
// 子评论展开/收起的标识
const spreadFlags: Ref<Boolean[]> = ref([]);
watch(videoInfo, async (v) => {
  const res = await getAllComments(v!.id);
  commentInfo.value = res.data.data;
  spreadFlags.value = new Array(commentInfo.value.length).fill(false);

  // 假数据
  // for (let i = 0; i < 10; i++) {
  //   commentInfo.value[0].childComments.push(res.data.data[0].comment);
  // }
});

// '点击查看'字样的点击事件
const onCheckClick = (index: number) => {
  spreadFlags.value[index] = !spreadFlags.value[index];
  document.querySelector(".reply-info > span")?.innerHTML;
};

// 发送一级评论
const onSendComment = async () => {
  if (!userLoginStore.isLogin()) {
    notification["error"]({
      content: "错误",
      meta: "请先登录",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  if (commentInputValue.value === "") {
    notification["error"]({
      content: "错误",
      meta: "评论信息不能为空哦",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  const res = await sendComment(
    userLoginStore.loginInfo.id,
    videoInfo.value!.id,
    0,
    0,
    commentInputValue.value,
  );
  if (res.data.code === 200) {
    // 直接插入到评论数组头部
    commentInfo.value = [res.data.data, ...commentInfo.value];
  } else {
    notification["error"]({
      content: "错误",
      meta: res.data.description,
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  commentInputValue.value = "";
};

const onMessageClick = () => {
  if (!userLoginStore.isLogin()) {
    notification["error"]({
      content: "错误",
      meta: "请先登录",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  if (userLoginStore.loginInfo.id === videoInfo.value!.id) {
    notification["error"]({
      content: "错误",
      meta: "不能给自己发消息",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  router.push({
    name: "notification",
    params: {
      selectIndex: -1,
      another_id: videoInfo.value!.uid,
    },
  });
};

// 回复评论的索引
const replyBoxIndex = ref(-1);
// 回复用户的id
let replyUid = 0;
// 回复框的placeholder文字
const replyBoxPlaceHolder = ref("");
const replyInputValue = ref("");
/**
 * 回复按钮的点击事件
 * @param index 回复评论的一级评论的索引
 * @param replyComment 回复的评论
 */
const onReplyClick = (index: number, replyComment: VideoComment) => {
  replyBoxIndex.value = index;
  replyBoxPlaceHolder.value = `回复 @${replyComment.username}: `;
  replyUid = replyComment.uid;
};

// 发送二级回复（二级评论）
const onSendReply = async () => {
  if (!userLoginStore.isLogin()) {
    notification["error"]({
      content: "错误",
      meta: "请先登录",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  if (replyInputValue.value === "") {
    notification["error"]({
      content: "错误",
      meta: "评论信息不能为空哦",
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }

  const res = await sendComment(
    userLoginStore.loginInfo.id,
    videoInfo.value!.id,
    commentInfo.value[replyBoxIndex.value].comment.id,
    replyUid,
    replyInputValue.value,
  );
  if (res.data.code === 200) {
    const response = res.data.data as VideoCommentResponse;
    // 如果发送的是一级评论，直接插入到评论数组头部；二级评论则插入到父评论的二级评论数组头部
    commentInfo.value.forEach((parent) => {
      if (parent.comment.id === response.comment.parent_id) {
        parent.childComments = [response.comment, ...parent.childComments];
      }
    });
  } else {
    notification["error"]({
      content: "错误",
      meta: res.data.description,
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
  replyInputValue.value = "";
};

const onDanmuClick = () => {
  let div = document.querySelector(".danmu-header") as HTMLElement;
  div.classList.toggle("spread");
};

const danmuList = ref<any[]>([]);
getDanmu(videoID).then((res) => {
  console.log(res.data.data);
  danmuList.value = res.data.data;
});

const recommend_videos: Ref<NamedVideo[]> = ref([]);
getVideoList(15).then((res) => {
  recommend_videos.value = res.data.data;
});
</script>

<template>
  <div id="video-detail-page">
    <div class="left-side">
      <h1 class="video-title single-line">{{ videoInfo?.title }}</h1>
      <div class="video-info-box">
        <svg
          class="view-icon"
          style="width: 20px; height: 20px; color: #9499a0; margin-right: 4px"
          data-v-0c3641b4=""
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 20 20"
          width="20"
          height="20"
        >
          <path
            d="M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z"
            fill="currentColor"
          ></path>
          <path
            d="M12.23275 9.1962C12.851516666666667 9.553483333333332 12.851516666666667 10.44665 12.232683333333332 10.803866666666666L9.57975 12.335600000000001C8.960983333333335 12.692816666666667 8.1875 12.246250000000002 8.187503333333334 11.531733333333333L8.187503333333334 8.4684C8.187503333333334 7.753871666666667 8.960983333333335 7.307296666666667 9.57975 7.66456L12.23275 9.1962z"
            fill="currentColor"
          ></path>
        </svg>
        <span class="video-play-count">{{
          formatPlayCount(videoInfo?.play_count)
        }}</span>
        <svg
          class="dm-icon"
          style="width: 20px; height: 20px; color: #9499a0; margin-right: 4px"
          data-v-0c3641b4=""
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 20 20"
          width="20"
          height="20"
        >
          <path
            d="M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z"
            fill="currentColor"
          ></path>
          <path
            d="M13.291666666666666 8.833333333333334L8.166666666666668 8.833333333333334C7.890526666666666 8.833333333333334 7.666666666666666 8.609449999999999 7.666666666666666 8.333333333333334C7.666666666666666 8.057193333333334 7.890526666666666 7.833333333333334 8.166666666666668 7.833333333333334L13.291666666666666 7.833333333333334C13.567783333333335 7.833333333333334 13.791666666666668 8.057193333333334 13.791666666666668 8.333333333333334C13.791666666666668 8.609449999999999 13.567783333333335 8.833333333333334 13.291666666666666 8.833333333333334z"
            fill="currentColor"
          ></path>
          <path
            d="M14.541666666666666 12.166666666666666L9.416666666666668 12.166666666666666C9.140550000000001 12.166666666666666 8.916666666666666 11.942783333333333 8.916666666666666 11.666666666666668C8.916666666666666 11.390550000000001 9.140550000000001 11.166666666666668 9.416666666666668 11.166666666666668L14.541666666666666 11.166666666666668C14.817783333333335 11.166666666666668 15.041666666666668 11.390550000000001 15.041666666666668 11.666666666666668C15.041666666666668 11.942783333333333 14.817783333333335 12.166666666666666 14.541666666666666 12.166666666666666z"
            fill="currentColor"
          ></path>
          <path
            d="M6.5 8.333333333333334C6.5 8.609449999999999 6.27614 8.833333333333334 6 8.833333333333334L5.458333333333333 8.833333333333334C5.182193333333334 8.833333333333334 4.958333333333334 8.609449999999999 4.958333333333334 8.333333333333334C4.958333333333334 8.057193333333334 5.182193333333334 7.833333333333334 5.458333333333333 7.833333333333334L6 7.833333333333334C6.27614 7.833333333333334 6.5 8.057193333333334 6.5 8.333333333333334z"
            fill="currentColor"
          ></path>
          <path
            d="M7.750000000000001 11.666666666666668C7.750000000000001 11.942783333333333 7.526140000000001 12.166666666666666 7.25 12.166666666666666L6.708333333333334 12.166666666666666C6.432193333333334 12.166666666666666 6.208333333333334 11.942783333333333 6.208333333333334 11.666666666666668C6.208333333333334 11.390550000000001 6.432193333333334 11.166666666666668 6.708333333333334 11.166666666666668L7.25 11.166666666666668C7.526140000000001 11.166666666666668 7.750000000000001 11.390550000000001 7.750000000000001 11.666666666666668z"
            fill="currentColor"
          ></path>
        </svg>
        <span class="video-play-time">{{ danmuList.length }}</span>
      </div>
      <div class="video-box"></div>
      <div class="video-desc">{{ videoInfo?.video_desc }}</div>
      <div class="video-tag-container">
        <template v-for="(item, index) in tagList">
          <div class="video-tag">
            {{ item }}
          </div>
        </template>
      </div>
      <div class="comment-container">
        <div class="comment-count">评论<span>188</span></div>
        <div class="comment-input-container">
          <img :src="userLoginStore.loginInfo.avatar" />
          <n-input
            v-model:value="commentInputValue"
            type="textarea"
            placeholder="万水千山总是情，评论两句行不行"
            maxlength="300"
            show-count
            clearable
          />
        </div>
        <div class="submit-btn-container">
          <n-button type="info" @click="onSendComment" class="submit-btn"
            >发布
          </n-button>
        </div>

        <template v-for="(item, index) in commentInfo" :key="item.comment.id">
          <div class="comment-card">
            <img :src="item.comment.avatar" />
            <div class="comment-card-right">
              <div class="comment-author-name">
                {{ item.comment.username }}
              </div>
              <div class="comment-content">{{ item.comment.content }}</div>
              <div class="comment-publish-time">
                {{ item.comment.create_time
                }}<span @click="onReplyClick(index, item.comment)">回复</span>
              </div>

              <template v-if="item.childComments.length > 0">
                <template v-if="!spreadFlags[index]">
                  <div class="child-comment-card">
                    <img :src="item.childComments[0].avatar" />
                    <div class="child-card-right">
                      <div class="child-card-right-content">
                        <div class="child-author-name">
                          {{ item.childComments[0].username }}
                        </div>
                        <div class="child-content">
                          {{ item.childComments[0].content }}
                        </div>
                      </div>
                      <div class="child-publish-time">
                        {{ item.childComments[0].create_time
                        }}<span
                          @click="onReplyClick(index, item.childComments[0])"
                          >回复</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <template
                    v-for="(childItem, childIndex) in item.childComments"
                  >
                    <div class="child-comment-card">
                      <img :src="childItem.avatar" />
                      <div class="child-card-right">
                        <div class="child-card-right-content">
                          <div class="child-author-name">
                            {{ childItem.username }}
                          </div>
                          <div class="child-content">
                            {{ childItem.content }}
                          </div>
                        </div>
                        <div class="child-publish-time">
                          {{ childItem.create_time
                          }}<span @click="onReplyClick(index, childItem)"
                            >回复</span
                          >
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <div class="reply-info">
                  {{ `共${item.childComments.length}条回复，`
                  }}<span @click="onCheckClick(index)">{{
                    spreadFlags[index] ? "收起" : "点击查看"
                  }}</span>
                </div>
              </template>
              <div class="reply-input-box" v-if="replyBoxIndex === index">
                <div class="comment-input-container">
                  <img :src="userLoginStore.loginInfo.avatar" />
                  <n-input
                    v-model:value="replyInputValue"
                    type="textarea"
                    :placeholder="replyBoxPlaceHolder"
                    maxlength="300"
                    show-count
                    clearable
                  />
                </div>
                <div class="submit-btn-container">
                  <n-button type="info" @click="onSendReply" class="submit-btn"
                    >发布
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="right-side">
      <div class="author-container">
        <img class="author-avatar" :src="authorInfo?.avatar" />
        <div class="author-right-side">
          <div class="author-name-container">
            <span class="author-name">{{ authorInfo?.username }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              style="
                width: 14px;
                height: 14px;
                margin-right: 4px;
                color: #61666d;
              "
            >
              <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z"
                fill="currentColor"
              ></path>
            </svg>
            <span
              style="font-size: 14px; color: #61666d; cursor: pointer"
              @click="onMessageClick"
              >发消息</span
            >
          </div>
          <div class="author-desc single-line">...</div>
          <div
            :class="{
              'focus-btn': true,
              unfocus: !focusStatus,
              focused: focusStatus,
            }"
            @click="onFocusBtnClick"
          >
            {{ focusStatus ? "已关注" : "+ 关注"
            }}<span>{{ authorFansCount }}</span>
          </div>
        </div>
      </div>
      <div class="danmu-header" @click="onDanmuClick()">
        <div>弹幕列表</div>
        <span class="danmu-more">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-pointer="none"
            viewBox="0 0 4 14"
            width="14px"
            height="14px"
          >
            <path
              fill-rule="evenodd"
              d="M.5 2C.5 1.15 1.15.5 2 .5s1.5.65 1.5 1.5S2.85 3.5 2 3.5.5 2.85.5 2Zm0 5c0-.85.65-1.5 1.5-1.5s1.5.65 1.5 1.5S2.85 8.5 2 8.5.5 7.85.5 7Zm0 5c0-.85.65-1.5 1.5-1.5s1.5.65 1.5 1.5-.65 1.5-1.5 1.5S.5 12.85.5 12Z"
            ></path>
          </svg>
        </span>
        <span class="danmu-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
            data-pointer="none"
            viewBox="0 0 16 16"
            width="16px"
            height="16px"
            color="#757575"
          >
            <path
              d="m9.188 7.999-3.359 3.359a.75.75 0 1 0 1.061 1.061l3.889-3.889a.75.75 0 0 0 0-1.061L6.89 3.58a.75.75 0 1 0-1.061 1.061l3.359 3.358z"
            ></path>
          </svg>
        </span>
      </div>
      <div class="danmu-list">
        <div class="danmu-info-header">
          <div class="danmu-info-time">时间</div>
          <div class="danmu-info-content">弹幕内容</div>
          <div class="danmu-info-publish">发送时间</div>
        </div>
        <div class="danmu-item" v-for="item in danmuList">
          <div class="danmu-item-time">
            {{ formatPlayTime(Math.floor(item[0])) }}
          </div>
          <div class="danmu-item-content">{{ item[4] }}</div>
          <div class="danmu-item-publish">{{ item[5] }}</div>
        </div>
      </div>
      <div class="recommend-video-list">
        <div
          class="recommend-video-item"
          v-for="(item, index) in recommend_videos"
          :key="item.video.id"
        >
          <img :src="item.video.cover_url" class="recommend-video-cover" />
          <div class="recommend-video-right">
            <div class="recommend-video-title">
              {{ item.video.title }}
            </div>
            <div class="recommend-video-authorname">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                class="recommend-video-svg"
              >
                <path
                  d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"
                  fill="currentColor"
                ></path>
                <path
                  d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"
                  fill="currentColor"
                ></path>
                <path
                  d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                  fill="currentColor"
                ></path>
              </svg>
              {{ recommend_videos[0].username }}
            </div>
            <div class="video-info-box" style="margin-top: 3px">
              <svg
                class="view-icon"
                style="
                  width: 20px;
                  height: 20px;
                  color: #9499a0;
                  margin-right: 4px;
                "
                data-v-0c3641b4=""
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 20 20"
                width="20"
                height="20"
              >
                <path
                  d="M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z"
                  fill="currentColor"
                ></path>
                <path
                  d="M12.23275 9.1962C12.851516666666667 9.553483333333332 12.851516666666667 10.44665 12.232683333333332 10.803866666666666L9.57975 12.335600000000001C8.960983333333335 12.692816666666667 8.1875 12.246250000000002 8.187503333333334 11.531733333333333L8.187503333333334 8.4684C8.187503333333334 7.753871666666667 8.960983333333335 7.307296666666667 9.57975 7.66456L12.23275 9.1962z"
                  fill="currentColor"
                ></path>
              </svg>
              <span class="video-play-count">{{
                formatPlayCount(item.video.play_count)
              }}</span>
              <svg
                class="dm-icon"
                style="
                  width: 20px;
                  height: 20px;
                  color: #9499a0;
                  margin-right: 4px;
                "
                data-v-0c3641b4=""
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 20 20"
                width="20"
                height="20"
              >
                <path
                  d="M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z"
                  fill="currentColor"
                ></path>
                <path
                  d="M13.291666666666666 8.833333333333334L8.166666666666668 8.833333333333334C7.890526666666666 8.833333333333334 7.666666666666666 8.609449999999999 7.666666666666666 8.333333333333334C7.666666666666666 8.057193333333334 7.890526666666666 7.833333333333334 8.166666666666668 7.833333333333334L13.291666666666666 7.833333333333334C13.567783333333335 7.833333333333334 13.791666666666668 8.057193333333334 13.791666666666668 8.333333333333334C13.791666666666668 8.609449999999999 13.567783333333335 8.833333333333334 13.291666666666666 8.833333333333334z"
                  fill="currentColor"
                ></path>
                <path
                  d="M14.541666666666666 12.166666666666666L9.416666666666668 12.166666666666666C9.140550000000001 12.166666666666666 8.916666666666666 11.942783333333333 8.916666666666666 11.666666666666668C8.916666666666666 11.390550000000001 9.140550000000001 11.166666666666668 9.416666666666668 11.166666666666668L14.541666666666666 11.166666666666668C14.817783333333335 11.166666666666668 15.041666666666668 11.390550000000001 15.041666666666668 11.666666666666668C15.041666666666668 11.942783333333333 14.817783333333335 12.166666666666666 14.541666666666666 12.166666666666666z"
                  fill="currentColor"
                ></path>
                <path
                  d="M6.5 8.333333333333334C6.5 8.609449999999999 6.27614 8.833333333333334 6 8.833333333333334L5.458333333333333 8.833333333333334C5.182193333333334 8.833333333333334 4.958333333333334 8.609449999999999 4.958333333333334 8.333333333333334C4.958333333333334 8.057193333333334 5.182193333333334 7.833333333333334 5.458333333333333 7.833333333333334L6 7.833333333333334C6.27614 7.833333333333334 6.5 8.057193333333334 6.5 8.333333333333334z"
                  fill="currentColor"
                ></path>
                <path
                  d="M7.750000000000001 11.666666666666668C7.750000000000001 11.942783333333333 7.526140000000001 12.166666666666666 7.25 12.166666666666666L6.708333333333334 12.166666666666666C6.432193333333334 12.166666666666666 6.208333333333334 11.942783333333333 6.208333333333334 11.666666666666668C6.208333333333334 11.390550000000001 6.432193333333334 11.166666666666668 6.708333333333334 11.166666666666668L7.25 11.166666666666668C7.526140000000001 11.166666666666668 7.750000000000001 11.390550000000001 7.750000000000001 11.666666666666668z"
                  fill="currentColor"
                ></path>
              </svg>
              <span class="video-play-time">{{ danmuList.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.comment-container{
  position: sticky;
  top: 100px;
}
.recommend-video-list {
  max-height: 80vh;
  margin-top: 24px;
  position: sticky;
  top: 100px;

  overflow-y: scroll;

  &::-webkit-scrollbar{
    display: none;
  }
}
.recommend-video-authorname {
  font-size: 14px;
  color: #9499a0;
  margin-top: 2px;
}
.recommend-video-title {
  font-weight: 500;
  font-size: 16px;
  color: #18191c;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  line-height: 1.1;
}
.recommend-video-svg {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.recommend-video-item {
  display: flex;
  margin-bottom: 16px;
}
.recommend-video-cover {
  min-width: 189px;
  height: 107px;
  object-fit: cover;
  margin-right: 12px;
  border-radius: 6px;
}
.danmu-header.spread + .danmu-list {
  max-height: 580px;
}
.danmu-list {
  max-height: 0px;
  overflow-y: scroll;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.danmu-list::-webkit-scrollbar {
  display: none;
}
.danmu-item {
  display: flex;
  align-items: center;
  color: #61666d;
  font-size: 12px;
  padding: 4px 8px;
}

.danmu-item-time,
.danmu-info-time {
  width: 48px;
}

.danmu-info-publish {
  margin-right: 10px;
}

.danmu-item-content,
.danmu-info-content {
  margin-left: 28px;
}

.danmu-item-publish,
.danmu-info-publish {
  margin-left: auto;
}
.danmu-info-header {
  display: flex;
  align-items: center;
  color: #61666d;
  font-size: 12px;
  padding: 4px 8px;
}
.danmu-more {
  line-height: 14px;
  transform: translateY(1px);
  margin-left: 8px;
}
.danmu-arrow > svg {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: transform 0.3s ease-in-out;
}
.spread > .danmu-arrow > svg {
  transform: rotate(90deg);
}
.danmu-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
}
.danmu-header {
  color: #18191c;
  background-color: #f1f2f3;
  border-radius: 6px;

  transition: height 0.5s ease-in-out;
  display: flex;
  align-items: center;

  height: 44px;
  font-size: 15px;
  padding: 0 16px;
  margin-top: 16px;
  cursor: pointer;
  caret-color: transparent;
}
.reply-input-box {
  margin-bottom: 10px;
}
.submit-btn-container {
  display: flex;
  justify-content: end;
}
.submit-btn {
  width: 70px;
  height: 32px;
  margin-top: 12px;
  margin-bottom: 36px;
}
.reply-input-box .submit-btn {
  margin-bottom: 10px;
}
.reply-info {
  margin: 10px 0;
  color: #9499a0;
  font-size: 13px;

  & > span {
    cursor: pointer;
  }
  & > span:hover {
    color: #00aeec;
  }
}
.child-card-right-content {
  display: flex;
  align-items: center;
}
.child-publish-time {
  color: #9499a0;
  font-size: 13px;

  height: 25.5px;
  line-height: 25.5px;
  margin-top: 3px;
}
.comment-publish-time > span,
.child-publish-time > span {
  margin-left: 16px;
  cursor: pointer;
  &:hover {
    color: #00aeec;
  }
}
.child-content {
  color: #18191c;
  font-size: 15px;

  height: 26px;
  line-height: 26px;
}
.child-author-name {
  color: #61666d;
  font-size: 14px;
  font-weight: 500;

  height: 30px;
  line-height: 30px;
  margin-right: 12px;
}
.child-card-right {
}
.child-comment-card {
  display: flex;

  & > img {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    margin-right: 12px;
    margin-top: 3px;
  }
}
.comment-card {
  display: flex;
  margin-bottom: 18px;

  & > img {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    margin-right: 12px;
  }
}
.comment-card-right {
  flex: 1;
  display: flex;
  flex-direction: column;

  border-bottom: 1px solid #e3e5e7;
}
.comment-author-name {
  color: #61666d;
  font-size: 14px;
  font-weight: 500;

  height: 30px;
  line-height: 30px;
}
.comment-content {
  color: #18191c;
  font-size: 16px;

  height: 26px;
  line-height: 26px;
}
.comment-publish-time {
  color: #9499a0;
  font-size: 13px;

  height: 25.5px;
  line-height: 25.5px;
  margin-top: 3px;
  margin-bottom: 10px;
}

.comment-input-container {
  display: flex;
  padding-top: 18px;

  & > img {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    margin-right: 12px;
  }
}
.comment-count {
  color: #18191c;
  font-size: 24px;
  font-weight: 500;
  margin-top: 12px;

  & > span {
    font-size: 14px;
    color: #9499a0;
    padding-left: 6px;
    font-weight: 400;
  }
}
.focused {
  color: #9499a0;
  background-color: #e3e5e7;
}
.unfocus {
  color: #ffffff;
  background-color: #00aeec;
}
.focus-btn > span {
  margin-left: 6px;
}
.focus-btn {
  width: 230px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border-radius: 6px;
  margin-top: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.author-desc {
  height: 16px;
  font-size: 14px;
  color: #9499a0;
}
.author-right-side {
  margin-left: 12px;
}
.author-name-container {
  display: flex;
  align-items: center;
}
.author-name {
  font-size: 16px;
  color: #18191c;
  margin-right: 10px;
}
.author-container {
  display: flex;
  align-items: center;

  padding-top: 12px;
}
.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
}
.video-info-box {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.video-tag-container {
  border-bottom: 1px solid #e3e5e7;
  padding-bottom: 24px;
}
.video-desc {
  font-size: 16px;
  color: #18191c;
  margin: 24px 0;
}
.video-tag {
  padding: 0 12px;
  font-size: 14px;
  color: #61666d;
  background-color: #f1f2f3;
  display: inline-block;
  margin-right: 12px;
  border-radius: 16px;

  height: 32px;
  line-height: 32px;
}
.divide-line {
  height: 1px;
  background-color: #9499a0;
  margin-top: 24px;
}
.single-line {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 用省略号表示溢出文本 */
}
.video-play-count,
.video-play-time {
  color: #9499a0;
  font-size: 13px;
  margin-right: 8px;
}
.video-title {
  font-size: 22px;
  font-weight: 500;
  color: #18191c;
}
.left-side {
  flex: 3;
  height: max-content;
  padding-right: 36px;
}
.right-side {
  flex: 1;
  min-height: 100%;
}
#video-detail-page {
  display: flex;
  justify-content: center;
  padding: 0 10%;
  margin-top: 64px;
}
.video-box {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</style>
