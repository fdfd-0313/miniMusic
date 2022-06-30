// pages/music-player/index.js
import {
  audioContext,
  playerStore

} from "../../store/index"

const playModeNames = ["order", "repeat", "random"]
Page({

  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],
    sliderValue: 0,
    isSliderChanging: false,

    isPlaying: true,
    playingName: "pause",

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    lyricScrollTop: 0,

    playModeIndex: 0,
    playModeName: "order"
  },

  onLoad(options) {
    // 1. 获取传入的id
    const id = options.id
    this.setData({
      id
    })
    // 单独测试播放页的时候解开
    // playerStore.dispatch("playMusicWithSongIdAction", {
    //   id
    // })

    // 2. 根据id获取歌曲
    // this.getPageData(id)
    this.setupPlayerStoreListener()

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
  handleModeBtnClick() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0
    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick() {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick() {
    playerStore.dispatch("changeNewMusicAction")
  },

  setupPlayerStoreListener: function () {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({
        currentSong
      })
      if (durationTime) this.setData({
        durationTime
      })
      if (lyricInfos) this.setData({
        lyricInfos
      })
    })
    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          currentTime,
          sliderValue
        })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({
          currentLyricIndex,
          lyricScrollTop: currentLyricIndex * 35
        })
      }
      if (currentLyricText) {
        this.setData({
          currentLyricText
        })
      }
    })
    // 2. 监听播放模式相关数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({
      playModeIndex,
      isPlaying
    }) => {
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeNames[playModeIndex]
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? "pause" : "resume"
        })
      }
    })
  },
  onUnload() {},

})