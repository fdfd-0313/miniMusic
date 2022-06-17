export default function queryRect(seletor) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(seletor).boundingClientRect()
    query.exec(resolve)
    // query.exec((res) => {
    //  resolve(res)
    // })
  })
}