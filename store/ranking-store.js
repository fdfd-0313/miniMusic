import {
  HYEventStore
} from 'hy-event-store'

import {
  getRankings
} from '../service/api_music'

const rankingStore = new HYEventStore({
  state: {
    hotRankings: {}
  },
  actions: {
    getRankingDataAction(ctx) {
      getRankings(3778678).then(res => {
        ctx.hotRankings = res
      })
    }
  }
})

export {
  rankingStore
}