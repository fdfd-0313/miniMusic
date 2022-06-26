// pages/music-player/index.js
import {
  getSongDetail,
  getSongLyric
} from "../../service/api_player"
import {
  parseLyric
} from "../../utils/parse-lyric"
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
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",

    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    lyricScrollTop: 0
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
    const deviceRadio = globalData.deviceRadio //比例
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    })
    // 4. 创建播放器
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

    // 5.audioContext的事件监听
    this.setupAudioContextListener()

  },
  // =======   网络请求   =======  
  getPageData(id) {
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })
    getSongLyric(id).then(res => {
      const lyricString = res.lrc.lyric
      const lyrics = parseLyric(lyricString)
      // console.log(lyrics);
      this.setData({
        lyricInfos: lyrics
      })
    })
  },

  // =======   audio监听   ======= 
  setupAudioContextListener() {
    audioContext.onCanplay(() => {
      audioContext.play()
    })
    audioContext.onTimeUpdate(() => {
      // 1. 获取当前时间
      const currentTime = audioContext.currentTime * 1000
      // 2. 根据当前时间修改currentTime/sliderValue
      if (!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          sliderValue,
          currentTime
        })
      }
      // 3. 根据当前时间去查找播放的歌词
      for (let i = 0; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          const currentIndex = i - 1
          if (this.data.currentLyricIndex !== currentIndex) {
            const currentLyricInfo = this.data.lyricInfos[currentIndex]
            // console.log(currentLyricInfo.text);
            this.setData({
              currentLyricText: currentLyricInfo.text,
              currentLyricIndex: currentIndex,
              lyricScrollTop: currentIndex * 35
            })
          }
          break
        }
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