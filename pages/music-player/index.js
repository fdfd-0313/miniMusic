// pages/music-player/index.js
import {
  getSongDetail
} from "../../service/api_player"
import {
  audioContext
} from "../../store/index"
Page({

  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,
    sliderValue: 0,
    isSliderChanging: false,

    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
  },

  onLoad(options) {
    // 1. 获取传入的id
    const id = options.id
    // 2. 根据id获取歌曲
    this.getPageData(id)
    // 3. 动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    const deviceRadio = globalData.deviceRadio
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    })
    // 4. 创建播放器
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`


    // 5.audioContext的事件监听
    this.setupAudioContextListener()
    audioContext.pause()
  },
  // =======   网络请求   =======  
  getPageData(id) {
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })
  },

  // =======   audio监听   ======= 
  setupAudioContextListener() {
    audioContext.onCanplay(() => {
      audioContext.play()
    })
    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime * 1000
      if (!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          sliderValue,
          currentTime
        })
      }
    })
  },
  // =======    事件处理  ======= 
  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({
      currentPage: current,
    })
  },
  handleSliderChanging: function (event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      isSliderChanging: true,
      currentTime,
      sliderValue: value
    })
  },
  handleSliderChange(event) {
    // 获取slider变化的值
    const value = event.detail.value

    // 2. 计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100

    // 3. 设置context 播放currentTime位置音乐
    audioContext.pause()
    audioContext.seek(currentTime / 1000)

    // 4. 记录最新的sliderValue
    this.setData({
      sliderValue: value,
      isSliderChanging: false
    })
  },
  rebackHomemusic() {
    wx.navigateBack()
  },
  onUnload() {},

})