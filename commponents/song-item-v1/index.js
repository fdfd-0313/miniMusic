// commponents/song-item-v1/index.js
import {
  playerStore
} from "../../store/index"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick() {
      const id = this.properties.item.id
      wx.navigateTo({
        // 页面跳转
        // url: '/pages/music-player/index?id=' + id,
        url: `/pages/music-player/index?id=${id}`
      })
      // 对歌曲的数据请求和其他操作
      playerStore.dispatch("playMusicWithSongIdAction", {
        id
      })
    }
  }
})