import {
  HYEventStore
} from 'hy-event-store'

import {
  getRankings
} from '../service/api_music'

// 飙升榜、新歌榜、原创榜、热歌榜
const rankingNum = [19723756,3779629,2884035,3778678 ]
const rankingMap = ["upRankings","newRankings", "originRankings", "hotRankings"]
const rankingStore = new HYEventStore({
  state: {
    upRankings: {}, // 飙升
    newRankings: {}, // 新歌
    originRankings: {}, // 原创
    hotRankings: {}, // 热门
  },
  actions: {
    getRankingDataAction(ctx) {
      let j = 0;
      for (let i = 0; i < 4; i++) {
        getRankings(rankingNum[j]).then(res => {
          const rankingName = rankingMap[i]
          ctx[rankingName] = res
        })
        j++;
      }
    }
  }
})

export {
  rankingStore
}