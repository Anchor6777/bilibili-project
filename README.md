# bilibili-project

仿写B站web网页端的个人前端项目

本仓库为前端部分，后端部分参见[bilibili-project-backend](https://github.com/Anchor6777/bilibili-project-backend)

目前项目跑在本地，没有部署到服务器，readme文件中的图片/演示视频的图床是Github Issue，加载需要一点时间。

## 技术栈

- 语言：TS + JS
- 框架/脚手架：Vue3 + Vite
- 路由：Vue-Router
- 网络请求库：Axios
- 组件库：Naive UI
- 状态管理：Pinia
- 图床：PicGo
- 其他第三方库：DPlayer（视频播放器）、lodash.js（工具库，提供防抖、节流等工具函数）、dayjs（日期处理库）

## 主要页面/功能介绍

### 1. 首页

#### 1.1 登录：

采用双Token登录机制（token、refreshToken），避免基于session的登录方式的两个缺点：

1. 服务端需要保存状态信息，不支持分布式系统，A服务器保存了session对象，但B服务器没有。
2. 服务器重启后，登录信息全部失效，因为内存被清空

演示：

https://github.com/user-attachments/assets/292a7ca9-a52e-4e68-88d0-d9e5b9b7f250



#### 1.2 仿b站首页头图的视差交互效果

给不同的图层添加不同的变换效果（平移、旋转、缩放），形成视差效果，画面会变得栩栩如生 : ）

实现方式：给图片添加鼠标事件监听（mouseMove、mouseEnter、mouseLeave），根据鼠标的水平偏移距离计算css transform属性。

演示：

https://github.com/user-attachments/assets/a8809864-62c7-45a6-9ffe-e0a0aae196bf



#### 1.3 推荐视频列表

基于 Naive UI 的 Infinite Scroll 和 Skeleton 组件实现滚动加载和骨架屏效果。

目前没有做推荐算法，因为数据库中视频条目不多，以及没学过相关知识。

演示：

https://github.com/user-attachments/assets/e29ab562-84fe-442e-b485-184306963ee7

---

### 2. 视频详情页

#### 2.1 视频播放 / 发送弹幕

基于DPlayer API实现，自己在后端搭的弹幕接口。

右侧弹幕列表使用了虚拟列表优化性能。

一条视频可能有成千上万条弹幕，如果一次性全渲染出来，布局和渲染的时间会很长，可能会造成性能问题。通过虚拟列表，只去渲染可见的弹幕，可以很好地解决这个问题。

演示：

https://github.com/user-attachments/assets/00ff9b79-c215-415f-9351-7e509073ac67



#### 2.2 视频评论

仿照B站的视频评论设计，将评论分为两级（视频的评论为一级评论，评论的评论为二级评论）。

存在多条二级评论时，可以展开收起二级评论列表。

演示：

https://github.com/user-attachments/assets/76191350-83ff-4c37-8b83-ef06a4635df1



#### 2.3 相关视频列表

通过`position: sticky`实现了吸顶效果，滑动评论列表时会一直挂在页面顶部。

目前没有做推荐算法，因为数据库中视频条目不多，以及没学过相关知识。

演示：

https://github.com/user-attachments/assets/05f97d23-068b-4ee4-8a4f-3a134cde1971

---

### 3. 聊天消息页

#### 3.1 实时聊天

基于websocket实现实时聊天功能，演示：

https://github.com/user-attachments/assets/59201dfd-bf4e-46f1-b0ca-7814a68c2b8f

并且实现了心跳保活、断线重连机制：

- **心跳保活机制**：主流服务器例如tomcat在管理ws连接时，如果一段时间内没有消息往返，就会释放连接导致连接断开。通过定时器定期发送心跳消息保活
- **断线重连机制**：监听到ws的close事件后，关闭旧连接，不断尝试创建新连接。采取指数退避策略，重连间隔呈指数级增长，同时设置最大重连次数

---

### 4. 屏幕适配

基于vw/vh视口单位实现屏幕适配。通过 postcss-px-to-viewport 插件，将css样式表中的px单位转换为视口单 位实现屏幕适配。

演示：

https://github.com/user-attachments/assets/d18149b1-2590-4569-aa8d-f4aebd1e3aaf
