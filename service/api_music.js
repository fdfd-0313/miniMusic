import hyRequest from './index'
// 启动项目时候自动登录

export function getBanners() {
  return hyRequest.get('/banner', {
    type: 2
  })
}
export function getRankings(id, limit = 10, offset = 1) {
  return hyRequest.get("/playlist/track/all", {
    id,
    offset,
    limit
  })
}