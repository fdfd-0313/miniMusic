import hyRequest from './index'
// 启动项目时候自动登录

export function getBanners() {
  return hyRequest.get('/banner', {
    type: 2
  })
}
export function getRankings(id, limit, offset) {
  return hyRequest.get("/playlist/track/all", {
    id,
    offset,
    limit
  })
}
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return hyRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}
export function getPeakList() {
  return hyRequest.get("/toplist")
}