// pages/service/result.js
import drawQrcode from '../../libs/weapp.qrcode.esm.js'
const util = require('../../utils/util.js')
import { _ajaxApi } from '../../utils/apiAjax.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    let _ = this
    wx.setNavigationBarTitle({
      title: '支付成功'
    })
    _.orderVal = opts.orderId
    _.toast = this.selectComponent("#toast");
    console.log('页面携带的参数',opts)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _ = this
    console.log('获取的oderId为', _.orderVal)
    _.getOrderInfo(_.orderVal)
    
  },
  // 获取订单详情
  getOrderInfo(val) {
    let _ = this
    let pars = {
      url: '/order/orderDetails',
      data:{
        orderId: val
      }
    }
    _ajaxApi(pars).then(res => {
      
      drawQrcode({
        width: 130,
        height: 130,
        canvasId: 'myQrcode',
        text: res.matrixContent,
        // v1.0.0+版本支持在二维码上绘制图片
        image: {
          imageResource: '../../images/suncar.png',
          dx: 40,
          dy: 40,
          dWidth: 50,
          dHeight: 50
        }
      })
      _.setData({
        orderInfo:res
      })
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  toIndex(){
    util.toRouter('/pages/home', 'reLaunch')
  },
  toCity(){
    util.toRouter('/pages/point/city', 'redirectTo')
  },
})