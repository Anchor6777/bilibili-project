import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcsspxtoviewport from "postcss-px-to-viewport";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: "px", // 需要转换的单位，默认为'px'
          viewportWidth: 1920, // 基准视口宽度（对应设计稿的宽度）
          // viewportHeight: 667, // 视口高度（可选）
          unitPrecision: 5, // px转换为vw的小数位数（很多情况下用5）
          propList: ["*"], // 指定需要转换的属性，'*'表示全部转换，'font-size'表示只转换font-size属性
          viewportUnit: "vw", // 指定需要转换成的视口单位，默认vw
          fontViewportUnit: "vw", // 字体使用的视口单位，默认vw
          selectorBlackList: [], // 指定不转换为视口单位的类名，用逗号隔开
          minPixelValue: 1, // 小于或等于1px不转换为视口单位，默认1
          mediaQuery: false, // 允许在媒体查询中转换px
          replace: true, // 是否直接替换而不是添加后缀
          exclude: [/node_modules/,/GlobalHeader\.vue/,/NotificationPage\.vue/], // 设置忽略文件，用正则表达式匹配路径
        }),
      ],
    },
  },
});
