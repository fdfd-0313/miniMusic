// commponents/song-munu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认歌单"
    },
    songMemu: {
      type: Array,
      value: []
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
    handleMnnuItemClick(event) {
      const item = event.currentTarget.dataset.item
      // console.log(item);
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${item.id}&name=${item.name}&&type=menu`,
      })
    }
  }
})