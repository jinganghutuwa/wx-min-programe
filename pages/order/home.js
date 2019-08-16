// pages/order/home.js
import drawQrcode from '../../libs/weapp.qrcode.esm.js'
const util = require('../../utils/util.js')
import { ls } from '../../utils/storage.js'
import { _ajaxApi } from '../../utils/apiAjax.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHiddenQrCode:true,
    orderType: '0',   //0.未使用  1已使用 
    orderTypeList: [
      { oType: '0', oName: '未消费' },
      { oType: '5', oName: '已消费' },
    ],
    orderList:[],
    isShowNoData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
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
    _.getOrderList()
    
  },
  // 获取订单列表
  getOrderList() {
    let _ = this
    let { orderType } = _.data
    let pars = {
      url: '/order/selectOrder',
      // 5表示消费，非5表示未消费
      data:{
        token:ls.getter('loginStatus'),
        status: orderType
      }
    }
    _ajaxApi(pars).then(res => {
      console.log('/order/selectOrder', res)
      // status 1:正常  8 已过期 5 已消费
      if(!res || (res && res.length == 0)){
        _.setData({
          isShowNoData: true
        })
      }else{
        _.setData({
          orderList: res
        })
      }
      
      wx.stopPullDownRefresh()
    }).catch(err => {
      wx.stopPullDownRefresh()
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  // 退款
  rebackMoney(){
    let pars = {
      title: '温馨提示',
      content: '请确认此笔订单是否要退款？',
      confirmText:'确认退款',
      cancelText:'我再想想'
    }
    util.confirm(pars, () => {
      console.log('退出登录')
      
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  changeType(e){
    let _ = this
    let { otype } = e.target.dataset || e.currentTarget.dataset
    _.setData({
      orderType: otype,
      orderList:[],
      isShowNoData:false
    })
    _.getOrderList()
  },
  toCity() {
    util.toRouter('/pages/point/city')
  },
  closeQrCode(){
    let _ = this
    _.setData({
      isHiddenQrCode:true
    })
  },
  openQrCode(e){
    let _ = this
    let { matrixcontent } = e.target.dataset || e.currentTarget.dataset
    console.log('获取到的二维码值', matrixcontent)
    drawQrcode({
      width: 150,
      height: 150,
      canvasId: 'myQrcode',
      text: matrixcontent,
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: '../../images/suncar.png',
        dx: 50,
        dy: 50,
        dWidth: 50,
        dHeight: 50
      }
    })
    _.setData({
      isHiddenQrCode:false
    })
  },
  cancelBubble(){
    console.log('阻止冒泡')
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
    let _ = this
    _.getOrderList()
  },


})