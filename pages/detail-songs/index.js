// pages/detail-songs/index.js
import {
  getRankings,
} from '../../service/api_music'
import {
  playerStore
} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    Name: "",
    songsDetail: [],
    rankingName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type
    if (type === "menu") {
      const id = options.id
      const name = options.name
      this.getSongsTetail(id)
      this.setData({
        type: "menu",
        Name: name
      })
    } else if (type === "rank") {
      const rankingid = options.rankingid
      const rankingname = options.rankingname
      // 发送网络请求
      this.getSongsTetail(rankingid)
      this.setData({
        rankingName: rankingname
      })
      this.setData({
        type: "rank"
      })
    }
  },

  /**
   * 页面相关事件处理函数-上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  getSongsTetail(id) {
    getRankings(id, 200, 0).then(res => {
      this.setData({
        songsDetail: res.songs
      })
    })
  },
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.songsDetail)
    playerStore.setState("playListIndex", index)

  }
})