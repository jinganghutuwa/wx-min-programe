//app.js
App({
  data: {
    url: "https://sd.ssdlqcfw.com/ShengDaJTFSWXX/jtfs"  //生产
    // url: "https://sd.auto1768.com/ShengDaJTFSWXX/jtfs"
  },
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onHide:function(){
    console.log('小程序隐藏')
    try {
      wx.removeStorageSync('city')
      wx.removeStorageSync('address')
      wx.removeStorageSync('location')
    } catch (e) {
      // Do something when catch error
      console.log('清除缓存报错',e)
    }
  },
  getSystemInfo: function (cb) {
    var that = this
    if (this.globalData.systemInfo) {
      typeof cb == "function" && cb(this.globalData.systemInfo)
    } else {
      //调用系统信息接口
      wx.getSystemInfo({
        success: function (res) {
          var windowWidth = res.windowWidth;
          var windowHeight = res.windowHeight;
          var system = res.system
          var systemInfo = {
            windowWidth: windowWidth,
            windowHeight: windowHeight,
            system: system
          }
          that.globalData.systemInfo = systemInfo
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})