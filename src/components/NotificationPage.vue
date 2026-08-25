<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { getOneChatRecord, getRecentChatRecord } from "../api/notification";
import type { ChatRecord } from "../model/TypeDefinition";
import { useLoginStore } from "../store/userLoginStore";
import { useNotification } from "naive-ui";
import { useNavBarStore } from "../store/navBarStore";
import { useRoute, useRouter } from "vue-router";
import { WebSocketClient } from "../WebSocketClient";

const notification = useNotification();
const userInfo = useLoginStore();
const route = useRoute();
const router = useRouter();

// 聊天信息数据源
const chat_records: Ref<ChatRecord[]> = ref([]);
// id -> ChatRecord 的Map。用于接受新消息时，根据id获取ChatRecord实例
const chat_records_map: Map<number, ChatRecord> = new Map();
// 选中的会话条目（chat_records数组的索引）
const selectIndex = ref(-1);
const chatRecordPromise = getRecentChatRecord(userInfo.loginInfo.id);
// 消息列表元素
const msgListRef = ref<HTMLElement>();

// 改变导航栏样式
const navBarStore = useNavBarStore();
onMounted(() => {
  navBarStore.setStyle(1);
});

// 通过路由参数params保存选中的数组索引
watch(
  () => route.params.selectIndex,
  (idxStr) => {
    chatRecordPromise.then(() => {
      selectIndex.value = Number(idxStr);
      console.log(selectIndex.value);
    });
  },
  { immediate: true },
);

chatRecordPromise.then((res) => {
  // 将一个数组添加到另一个数组时，要用"..."（展开运算符）
  chat_records.value.push(...res.data.data);
  chat_records.value.forEach((record) => {
    chat_records_map.set(record.user.id, record);
  });

  // 从其他页面点击"发消息"跳转过来
  if (route.params.another_id) {
    let anotherId = Number(route.params.another_id);
    // 如果已经有和another_id对应用户的ChatRecord，则移动到数组头部
    if (chat_records_map.get(anotherId)) {
      const index = chat_records.value.indexOf(
        chat_records_map.get(anotherId)!,
      );
      chat_records.value.unshift(chat_records.value.splice(index, 1)[0]);
    } else {
      // 否则就获取another_id对应的ChatRecord，添加到数组头部
      getOneChatRecord(userInfo.loginInfo.id, anotherId).then((res) => {
        const record: ChatRecord = res.data.data;
        chat_records.value.unshift(record);
        chat_records_map.set(record.user.id, record);
      });
    }

    // 选中该ChatRecord
    selectIndex.value = 0;
    console.log(selectIndex.value);
  }
});

const onSenderItemClick = (index: number) => {
  router.replace({
    name: "notification",
    params: {
      selectIndex: index,
    },
  });
};

// 打开websocket
let ws: WebSocket;
let wsURL = "ws://localhost:8080/new_chat";
let socketClient: WebSocketClient;

const startNewWebSocket = () => {
  socketClient = new WebSocketClient(wsURL);
  socketClient.onmessage(async (ev: any) => {
    const typedMsg = JSON.parse(ev.data);

    // type值的含义
    // 1."chat_msg"，普通聊天消息
    switch (typedMsg.type) {
      case "chat_msg":
        // 将新消息添加到消息列表
        const record =
          chat_records_map.get(typedMsg.data.sender_id) ||
          chat_records_map.get(typedMsg.data.receiver_id);
        // // 消息列表中不存在该用户，创建新的条目插入到数组头部
        // if (!record) {
        //   const res = await getOneChatRecord(typedMsg.data.sender_id);
        //   chat_records.value.unshift(res.data.data);
        //   return;
        // }
        // 存在该用户，直接插入到消息列表
        record?.msgList.push({
          id: -1,
          sender_id: typedMsg.data.sender_id,
          receiver_id: typedMsg.data.receiver_id,
          content: typedMsg.data.content,
        });
        // 滑动消息列表到最底部
        let msgList = msgListRef.value;
        // 等待DOM更新完毕
        await nextTick();
        msgList?.scrollTo({
          top: msgList.scrollHeight,
          behavior: "smooth",
        });
        break;
      default:
        break;
    }
  });
  socketClient.startWS();
};
startNewWebSocket();

const inputContent = ref("");
const onSubmit = () => {
  if (inputContent.value === "") {
    notification["warning"]({
      content: `发送内容不能为空`,
      meta: `发送内容不能为空`,
      duration: 2500,
      keepAliveOnHover: true,
    });
    return;
  }
  socketClient.send(
    JSON.stringify({
      type: "chat_msg",
      data: {
        sender_id: userInfo.loginInfo.id,
        receiver_id: chat_records.value[selectIndex.value].user.id,
        content: inputContent.value,
      },
    }),
  );
  inputContent.value = "";
};

// 清理副作用，包括定时器、ws连接等等
onUnmounted(() => {
  socketClient.close();
});
</script>

<template>
  <div id="notification-page">
    <aside class="side-bar">
      <div class="side-title">
        <svg viewBox="0 0 16 12">
          <path
            d="M15.6386295,4.17014918 C16.454219,4.39885202 15.6343208,5.07824066 15.6343208,5.07824066 L12.8711365,7.09359077 L4.27181047,2.64580413 C4.27181047,2.64580413 10.0809335,6.55511522 11.8533103,7.76666817 L5.86501964,11.7253113 C4.91770244,12.2710516 4.67094307,11.8350769 4.67094307,11.8350769 L4.25489009,10.97071 L0.0325132718,0.704758608 C-0.125784343,0.348173789 0.320384239,-0.0596727945 0.798575886,0.00727624935 L15.6386295,4.17014918 Z M10.2454612,9.59252937 C10.230576,9.58092963 10.2174075,9.56728156 10.2063473,9.55199119 C10.14161,9.46249359 10.1616822,9.3374615 10.2511798,9.27272421 L11.7512731,8.18764499 C11.7871922,8.16166319 11.8307257,8.14835156 11.875033,8.14980177 C11.9854308,8.15341518 12.0719967,8.24583954 12.0683833,8.35623737 L11.9964408,10.5542479 C11.995057,10.5965255 11.9803043,10.6372757 11.9543032,10.6706411 C11.8864076,10.757767 11.7607379,10.7733563 11.673612,10.7054607 L10.2454612,9.59252937 Z"
            id="纸飞机"
            transform="translate(8.000000, 6.000000) scale(-1, 1) translate(-8.000000, -6.000000)"
            fill="currentColor"
          ></path>
        </svg>
        <span class="side-title-text">消息中心</span>
      </div>
      <div class="side-item side-mine">· 我的消息</div>
      <div class="side-item side-reply">· 回复我的</div>
    </aside>
    <main class="chat-container">
      <div class="chat-title">我的消息</div>
      <div class="chat-card">
        <div class="chat-user">
          <span>最近消息</span>
          <div class="sender-list">
            <div
              v-for="(item, index) in chat_records"
              :class="{
                select: selectIndex === index,
                'sender-list-item': true,
              }"
              :key="item.user.id"
              @click="onSenderItemClick(index)"
            >
              <img :src="item.user.avatar" class="sender-item-avatar" />
              <div class="sender-item-right">
                <span class="sender-username">{{ item.user.username }}</span>
                <span class="sender-desc" v-if="item.msgList.length > 0">{{
                  item.msgList[item.msgList.length - 1].content
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectIndex >= 0" class="chat-box">
          <div class="msg-list-container" ref="msgListRef">
            <span class="msg-list-username">{{
              chat_records[selectIndex].user.username
            }}</span>
            <div class="msg-list">
              <div
                v-for="(item, index) in chat_records[selectIndex].msgList"
                :class="{
                  reverse: item.sender_id === userInfo.loginInfo.id,
                  'msg-card': true,
                }"
              >
                <template v-if="item.sender_id !== userInfo.loginInfo.id">
                  <img
                    :src="chat_records[selectIndex].user.avatar"
                    class="msg-card-avatar"
                  />
                  <span class="msg-content">{{ item.content }}</span>
                </template>
                <template v-else>
                  <span class="msg-content">{{ item.content }}</span>
                  <img
                    :src="userInfo.loginInfo.avatar"
                    class="msg-card-avatar"
                  />
                </template>
              </div>
            </div>
          </div>
          <div class="type-box" @keydown.enter="onSubmit">
            <n-input
              v-model:value="inputContent"
              type="text"
              placeholder="请输入消息内容"
              class="type-box-input"
            />
            <n-button @click="onSubmit" class="submit-btn">发送</n-button>
          </div>
        </div>
        <div v-else class="go-chat">
          <img src="../assets/gochat.png" />
          <span>快找小伙伴聊天吧 ( ゜- ゜)つロ</span>
        </div>
      </div>
    </main>
  </div>
</template>
<style scoped>
.msg-list-username {
  /* font-size: 14px; */
}
.msg-list-container {
  flex: 1;
  overflow-y: auto;
}
.submit-btn {
  width: 90px;
  height: 32px;
  position: absolute;
  right: 16px;
  bottom: 16px;

  color: #18191c;
  background-color: #ffffff;
}
.type-box-input {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;

  border: none;
  outline: none;
  background-color: transparent;
  padding: 16px;
}
.type-box {
  height: 163px;
  flex-shrink: 0;
  border-top: 1px solid #c6c9ce;
  position: relative;
}
.msg-list {
  flex: 1;
  padding-top: 40px;

  box-sizing: border-box;
  overflow: hidden;
}
.msg-content {
  display: inline-block;
  font-size: 14px;
  color: #18191c;
  margin-left: 12px;
  border-radius: 0 16px 16px 16px;
  background-color: #ffffff;
  padding: 8px 16px;
}
.reverse > .msg-content {
  border-radius: 16px 0 16px 16px;
  background-color: #00aeec;
  color: #ffffff;
  margin-right: 12px;
}
.msg-card-avatar {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 999px;
}
.msg-card {
  display: flex;
  justify-content: start;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
}

.msg-card.reverse {
  justify-content: end;
}
.go-chat {
  flex-grow: 1;
  flex-shrink: 0;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  & > img {
    width: 402px;
    object-fit: cover;
  }
  & > span {
    color: #8d9fb9;
    font-size: 14px;
  }
}
.chat-box {
  flex-grow: 1;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;

  & > span {
    width: auto;
    height: 12px;
    color: #18191c;
    font-size: 14px;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #c6c9ce;
  }
}
.sender-username {
  display: block;
  width: auto;
  height: 22px;
  font-size: 14px;
  color: #18191c;
}
.sender-desc {
  display: block;
  width: 155px;
  height: 18px;
  font-size: 12px;
  color: #9499a0;
}
.sender-item-right {
  flex: 1;
  margin-left: 8px;
}
.sender-item-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 999px;
}
.sender-list-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 19px 12px 19px 24px;
  &:hover,
  &.select {
    background-color: rgb(241, 242, 243);
  }
  cursor: pointer;
}
.chat-card {
  flex: 1;
  display: flex;

  max-height: calc(100% - 52px);
  box-shadow: 0 2px 4px #7992b98a;
}
.chat-user {
  width: 240px;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #c6c9ce;

  & > span {
    width: auto;
    height: 12px;
    color: #61666d;
    font-size: 12px;
    padding: 10px 20px;
    display: block;
    border-bottom: 1px solid #c6c9ce;
  }
}
.chat-title {
  flex: 0 0 42px;
  width: auto;
  color: #61666d;
  font-size: 15px;
  padding: 0 16px;
  margin-bottom: 10px;
  background-color: #ffffff;
  height: 42px;
  box-shadow: 0 2px 4px #7992b98a;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.side-item {
  color: #61666d;
  font-size: 14px;
  margin-left: 20px;
  cursor: pointer;
  margin-bottom: 20px;
}
.side-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px auto 40px;
}
.side-title > svg {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
.side-title > span {
  color: #18191c;
  font-size: 14px;
  font-weight: 700;
}
#notification-page {
  padding-top: 64px;
  width: 100%;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  background-image: url(../assets/light_bg.jpg);
  background-size: cover;
  position: fixed;

  display: flex;
  justify-content: center;
}
.side-bar {
  width: 140px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  font-weight: 700;
}
.chat-container {
  width: 1000px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
