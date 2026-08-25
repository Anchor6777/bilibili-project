import { defineStore } from "pinia";
import { ref } from "vue";

// 用于某些页面需要改变导航栏样式
export const useNavBarStore = defineStore("navBarStyle", {
  state: () => {
    // 0: 透明样式；else: 纯白样式 
    const navBarStyle = ref(0);
    // 是否随页面滑动改变样式
    const slideChange = ref(true);

    // 单独设置用户信息
    function setStyle(code: number) {
      navBarStyle.value = code;
    }

    function setSlideChange(turn: boolean){
      slideChange.value = turn
    }

    return { navBarStyle,setStyle,slideChange,setSlideChange };
  },
});
