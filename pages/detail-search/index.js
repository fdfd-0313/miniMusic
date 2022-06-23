// pages/detail-search/index.js
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult
} from "../../service/api_search"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/string2nodes"
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)
Page({

  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: ""
  },

  onLoad(options) {
    // 1.获取页面的数据
    this.getPageData()
  },
  // 网络请求
  getPageData: function () {
    getSearchHot().then(res => {
      this.setData({
        hotKeywords: res.result.hots
      })
    })
  },
  // 事件处理
  handleSearchChange(event) {
    //1. 获取输入的关键词
    const searchValue = event.detail
    // 2. 保存关键字
    this.setData({
      searchValue: searchValue
    })
    // 3.判断关键字为空处理逻辑
    if (!searchValue.length) {
      this.setData({
        suggestSongs: [],
        resultSongs: []
      })
      debounceGetSearchSuggest.cancel()
      return
    }
    // 4. 根据关键字搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // 4.1 获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({
        suggestSongs
      })
      // 如果没有歌曲推荐-->return
      if (!suggestSongs) return

      // 4.2 转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = [] //初始化新数组
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({
        suggestSongsNodes
      })
    })
  },
  handeleSearchAction() {
    // 保存一下searchValue
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({
        resultSongs: res.result.songs
      })
    })
  },
  handleKeywordItemClick(event) {
    // 1. 获取点击关键字
    const keyword = event.currentTarget.dataset.keyword
    // 2. 将关键字设置到搜索框的value中
    this.setData({
      searchValue: keyword
    })
    // 3. 发送网络请求
    this.handeleSearchAction()
  }
})