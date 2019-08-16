let isTest = true
let baseUrlDomain = isTest ? 'http://192.168.162.212:20015/ShengDaZYYHHD':''

function _ajaxApi(pars){
  wx.showLoading({
    title: '加载中',
  })
  console.log('入参信息',pars)
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrlDomain+pars.url, //仅为示例，并非真实的接口地址
      data: pars.data,
      method: pars.method || 'POST',
      header: {
        "Content-Type": pars.contentType || 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log('执行成功',res.data)
        if (res.data.resultCode === '0000') resolve(res.data.data)
        else reject(res.data)
      },
      fail: function (err) {
        wx.hideLoading()
        console.log('执行失败', err)
        if (err && err.errMsg === 'request:fail timeout'){
          wx.showModal({
            title: '系统提示',
            content: '网络出小差了，请稍后重试！',
            showCancel:false,
            confirmColor:'#0271C3',            
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else reject(err)
      }
    })
  })
  
}
module.exports = { _ajaxApi }