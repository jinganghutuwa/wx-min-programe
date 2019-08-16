// pages/home.js
const util = require('../utils/util.js')
import { _ajaxApi } from '../utils/apiAjax.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remainNum:['0']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast");
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
    _.getRemainNum()
  },
  
  toPersonal(){
    console.log('执行')
    util.toRouter('/pages/personal')
  },
  toOrder(){
    util.toRouter('/pages/order/home')
  },
  toPoint(){
    util.toRouter('/pages/point/city')
  },
  toQiang(){
    util.toRouter('/pages/service/home')
  },
  getRemainNum(){
    let _ = this
    let pars = {
      url:'/order/dequeOrderNumber',
      method:'GET'
    }
    _ajaxApi(pars).then(res=>{
      console.log('/order/dequeOrderNumber请求结果',res)
      _.setData({
        remainNum:res ? String(res).split('') : ['0']
      })
    }).catch(err=>{
      if (err && err.resultDesc){
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '中原银行洗车服务',
      path: '/page/home',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})