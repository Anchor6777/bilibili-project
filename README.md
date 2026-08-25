# bilibili-project

仿写B站web网页端的个人前端项目

本仓库为前端部分，后端参见[bilibili-project-backend]([Anchor6777/bilibili-project: 仿写b站web端的个人前端项目](https://github.com/Anchor6777/bilibili-project))

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



#### 1.2 仿b站首页头图的视差效果

给不同的图层添加不同的变换效果（平移、旋转、缩放），形成视差效果，画面会变得栩栩如生 : ）

实现方式：给图片添加鼠标事件监听（mouseMove、mouseEnter、mouseLeave），根据鼠标的水平偏移距离计算css transform属性。

演示：

https://github.com/user-attachments/assets/a8809864-62c7-45a6-9ffe-e0a0aae196bf



#### 1.3 推荐视频列表

基于 Naive UI 的 Infinite Scroll 和 Skeleton 组件实现滚动加载和骨架屏效果

演示：

https://github.com/user-attachments/assets/e29ab562-84fe-442e-b485-184306963ee7

