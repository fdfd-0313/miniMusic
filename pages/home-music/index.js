// pages/home-music/index.js
import {
  rankingStore
} from '../../store/index'
import {
  getBanners
} from '../../service/api_music'
import queryRect from '../../utils/query_rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000)
Page({
  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: []
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
  },
  // 网络请求
  getPageData() {
    getBanners().then(res => {
      this.setData({
        banners: res.banners
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

  }
})