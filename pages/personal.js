// pages/personal.js
const util = require('../utils/util.js')
import { _ajaxApi } from '../utils/apiAjax.js'
import { ls } from '../utils/storage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    this.toast = this.selectComponent("#toast");
  },
  toTel(e){
    let tel = e.target.dataset.tel || e.currentTarget.dataset.tel
    console.log('获取到的电话号码',tel)
    util.toCall(tel)
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
    _.getUserInfo()
  },
  getUserInfo() {
    let _ = this
    let pars = {
      url: '/login/userInfo',
      data:{
        token: ls.getter('loginStatus')
      }
    }
    _ajaxApi(pars).then(res => {
      let { telphone } = res
      telphone = telphone ? _.telChange(telphone) : 'SSDL'
      _.setData({
        userTel: telphone
      })
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  // 格式化手机号码
  telChange(tel){
    let telphone = ''
    telphone = tel.substr(0, 3) + '****' + tel.substr(7)
    return telphone
  },
  loginOut(){
    let pars = {
      title:'系统提示',
      content:'确认是否要退出登录？'
    }
    util.confirm(pars,()=>{
      console.log('退出登录')
      ls.del('loginStatus')
      util.toRouter('/pages/home','reLaunch')
    })
  },

})