const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 打电话
function toCall(tel){
  wx.makePhoneCall({
    phoneNumber: tel, //仅为示例，并非真实的电话号码
    success:function(){
      console.log('唤醒打电话成功',tel)
    }
  })
}
import { ls } from '../utils/storage.js'
// 页面跳转
function toRouter(url, type = 'navigate'){
  if (ls.getter('loginStatus') || url == '/pages/home' || url == '/pages/point/city' || url.indexOf('/pages/point')>-1){
    var pages = getCurrentPages().length;
    console.log('pages', pages)
    if (pages == 5){
      wx.redirectTo({
        url: url
      })
    }else{
      switch (type) {
        // 保留当前页面，跳转到应用内的某个页面
        case 'navigate':
          wx.navigateTo({
            url: url
          })
          break;
        // 关闭当前页面，跳转到应用内的某个页面。
        case 'redirectTo':
          wx.redirectTo({
            url: url
          })
          break;
        // 关闭所有页面，打开到应用内的某个页面。
        case 'reLaunch':
          wx.reLaunch({
            url: url
          })
          break;
        // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
        case 'switchTab':
          wx.switchTab({
            url: url
          })
          break;
      }
    }
    
  }else{
    wx.navigateTo({
      url: '/pages/login'
    })
  }
 
}

// 确认提示框
function confirm(pars,confirmCall,cancelCall,type='Confirm'){
  wx.showModal({
    title: pars.title || '温馨提示',
    content: pars.content,
    cancelText: pars.cancelText || '取消',
    confirmText: pars.confirmText || '确认',
    cancelColor: pars.cancelColor || '#000000',
    confirmColor: pars.confirmColor || '#0271C3',
    showCancel: type === 'Confirm' ? true : false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        typeof confirmCall === 'function' && confirmCall()
      } else if (res.cancel) {
        console.log('用户点击取消')
        typeof cancelCall === 'function' && cancelCall()
      }
    }
  })
}

let sourceCode = 'PAGY'

module.exports = {
  formatTime, toCall, toRouter, confirm, sourceCode
}
