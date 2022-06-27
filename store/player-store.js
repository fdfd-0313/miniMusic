import {
  HYEventStore
} from "hy-event-store"

import {
  getSongDetail,
  getSongLyric
} from "../service/api_player"
import {
  parseLyric
} from "../utils/parse-lyric"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",
    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
    isPlaying:false
  },
  actions: {
    playMusicWithSongIdAction(ctx, {
      id
    }) {
      // 1. 根据id发送网络请求
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })
      // 2. 播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      // 3. 监听audioContext一些事件
      this.dispatch("setupAudioContextListenerAction")
    },
    setupAudioContextListenerAction(ctx) {
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 2. 监听时间改变
      audioContext.onTimeUpdate(() => {
        // 2.1 获取当前时间
        const currentTime = audioContext.currentTime * 1000
        // 2.2 根据当前时间修改currentTime
        ctx.currentTime = currentTime
        // 2.3 根据当前时间去查找播放的歌词
        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            const currentIndex = i - 1
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfos[currentIndex]
              ctx.currentLyricIndex = currentIndex
              ctx.currentLyricText = currentLyricInfo.text
            }
            break
          }
        }
      })
    },
    changeMusicPlayStatusAction(ctx) {
      ctx.isPlaying = !ctx.isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    }
  }
})
export {
  audioContext,
  playerStore
}