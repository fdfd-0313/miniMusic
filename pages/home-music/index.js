// pages/home-music/index.js
import {
  rankingStore
} from '../../store/index'
import {
  getBanners,
  getSongMenu,
  getPeakList
} from '../../service/api_music'
import queryRect from '../../utils/query_rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000)
Page({
  data: {
    swiperHeight: 0, //轮播图高度=图片高度
    banners: [],
    recommendSongs: [],
    // 歌单里数据
    hotSongMenu: [],
    recommendSongMenu: [],
    // 榜单数据
    rankings: [],
    PeaKList: []

  },

  /**
   * 生命周期函数
   */
  onLoad(options) {
    // 获取页面数据
    this.getPageData()

    // 发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")
    // 从 store 获取共享数据
    rankingStore.onState("hotRankings", (res) => {
      if (!res.songs) return
      const recommendSongs = res.songs.slice(0, 6)
      this.setData({
        recommendSongs
      })
    })
    rankingStore.onState("upRankings", this.getRankingHandler(0))
    rankingStore.onState("newRankings", this.getRankingHandler(1))
    rankingStore.onState("originRankings", this.getRankingHandler(2))

  },
  // 网络请求
  getPageData() {
    getBanners().then(res => {
        this.setData({
          banners: res.banners
        })
      }),
      getSongMenu().then(res => {
        this.setData({
          hotSongMenu: res.playlists
        })
      }),
      getSongMenu("华语").then(res => {
        this.setData({
          recommendSongMenu: res.playlists
        })
      }),
      getPeakList().then(res => {
        const newPeakList = res.list.slice(0, 4)
        const peakInfo = []
        for (let i = 0; i < 3; i++) {
          const name = newPeakList[i].name
          const playCount = newPeakList[i].playCount
          const coverImgUrl = newPeakList[i].coverImgUrl
          const newList = {
            name,
            playCount,
            coverImgUrl
          }
          peakInfo.push(newList)
        }
        this.setData({
          PeaKList: peakInfo
        })
      })
  },

  // 事件处理
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleSwiperImageLoaded() {
    // 获取图片高度
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({
        swiperHeight: rect.height
      })
    })

  },
  getRankingHandler(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const songList = res.songs.slice(0, 3)
      const originRankings = [...this.data.rankings]
      originRankings.push(songList)
      // const newRankings = {
      //   ...this.data.rankings,
      //   [idx]: songList
      // }
      this.setData({
        rankings: originRankings
      })
    }
  }
})