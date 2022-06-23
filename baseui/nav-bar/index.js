import stringToNodes from "../../utils/string2nodes";

// baseui/nav-bar/index.js
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },

  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    navBarHeight: getApp().globalData.navBarHeight

  },

  lifetimes: {
    // 获取设备状态栏高度
    // ready() {
    //   const info = wx.getSystemInfo({
    //     success: (res) => {
    //       console.log(res);
    //     },
    //   })
    // }
  },

  methods: {
    rebackHome(){
      this.triggerEvent("click")
    }
  }
})