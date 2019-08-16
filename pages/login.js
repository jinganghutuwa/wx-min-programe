// pages/login.js
const util = require('../utils/util.js')
import { _ajaxApi } from '../utils/apiAjax.js'
import { ls } from '../utils/storage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCodeText:'发送验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录'
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
    
  },
  // 获取输入的身份证号码
  cardId:null,
  getCardId: function (e) {
    let _ = this
    _.cardId = e.detail.value
  },
  // 获取输入的手机号码
  tel:null,
  getTel: function (e) {
    let _ = this
    _.tel = e.detail.value
  },
  // 获取输入验证码
  dCode:null,
  getDCodeInput: function (e) {
    let _ = this
    _.dCode = e.detail.value
  },
  // 获取验证码
  getDCode() {
    let _ = this
    let { getCodeText } = _.data
    if (getCodeText != '发送验证码') return
    if (!_.cardId){
      _.toast.showToast('请输入身份证号！')
      return
    }
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(_.cardId)){
      _.toast.showToast('请输入正确格式的身份证号！')
      return
    }
    if (!_.tel){
      _.toast.showToast('请输入您的手机号！')
      return
    }
    if (!/^1\d{10}$/.test(_.tel)){
      _.toast.showToast('请输入正确格式的手机号！')
      return
    }
    let pars = {
      url: '/login/getCheckCode',
      data:{
        telphone:_.tel
      }
    }
    _ajaxApi(pars).then(res => {
      console.log('/login/getCheckCode', res)
      wx.showToast({
        title: '已发送',
        icon: 'success',
        duration: 2000
      })
      _.countDown()
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  
  // 发送短信验证码倒计时
  count: 120, //间隔函数
  curCount:null, //当前剩余秒数
  countDown(){
    let _ = this
    _.setData({
      getCodeText: `${_.count}s后重发`
    })
    if (_.count == 0){
      _.setData({
        getCodeText:'发送验证码'
      })
      console.log('执行完毕')
      return
    }else{
      _.count--
    }
    setTimeout(()=>{
      _.countDown()
    },1000)
  },
  // 登录
  submitLogin(){
    let _ = this
    if (!_.cardId) {
      _.toast.showToast('请输入身份证号！')
      return
    }
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(_.cardId)) {
      _.toast.showToast('请输入正确格式的身份证号！')
      return
    }
    if (!_.tel) {
      _.toast.showToast('请输入您的手机号！')
      return
    }
    if (!/^1\d{10}$/.test(_.tel)) {
      _.toast.showToast('请输入正确格式的手机号！')
      return
    }
    console.log('请输入验证码！', _.dCode)
    if (!_.dCode) {
      _.toast.showToast('请输入验证码！')
      return
    }
    let pars = {
      url: '/login/login',
      data: {
        idCard:_.cardId,
        telphone: _.tel,
        code: _.dCode
      }
    }
    _ajaxApi(pars).then(res => {
      console.log('/login/login', res)
      ls.setter('loginStatus', res.token, 30 * 24 * 60 * 60 * 1000)
      util.toRouter('/pages/home','reLaunch')
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
})