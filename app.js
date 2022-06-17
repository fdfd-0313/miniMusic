// app.js
import {
  getLoginCode
} from './service/api_login'
App({
  onLaunch: function () {
    // 让用户默认进行登录
    this.loginAction()
  },
  loginAction: async function () {
    // 1. 获取code
    const code = await getLoginCode()
    // console.log(code);
    // 2. 将code发送给服务器
  }

})