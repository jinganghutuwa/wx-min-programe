// pages/point/city.js
let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
let qqmapsdk;
const util = require('../../utils/util.js')
import { _ajaxApi } from '../../utils/apiAjax.js'
import { ls } from '../../utils/storage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList:[],
    locText:'定位中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择城市'
    })
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'SADBZ-QYEC5-W4NIK-Q3UEC-GRD6S-WYBZQ'
    });
    this.toast = this.selectComponent("#toast");
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _ = this
    _.getCityList()
    console.log('获取所在城市', wx.getStorageSync('city'))
    if (wx.getStorageSync('city')){
      _.setData({
        locText: wx.getStorageSync('city')
      })
    }else{
      wx.getSetting({
        success(getSettingres) {
          if (getSettingres.authSetting['scope.userLocation']) {
            console.log('已授权', getSettingres)
            _.getLocInfo()
          } else {
            console.log('未授权', getSettingres)
            wx.authorize({
              scope: 'scope.userLocation',
              success(resLoc) {
                console.log('resLoc', resLoc)
                _.getLocInfo()
              },
              fail(errLoc) {
                console.log('errLoc', errLoc)
                let pars = {
                  title: '系统提示',
                  content: '请允许小程序使用地理位置权限，否则无法享受服务',
                  confirmText: '立即开启'
                }
                util.confirm(pars, () => {
                  wx.openSetting({
                    success(openres) {
                      console.log(openres.authSetting)
                      openres.authSetting = {
                        "scope.userLocation": true
                      }
                    },
                    fail(e) {
                      console.log(e)
                    }
                  })
                }, '', 'Alert')
              },
            })
          }

        }
      })
    }
    
  },
  // 获取经纬度 地址信息
  getLocInfo(){
    let _ = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          coord_type: 1,
          success: function (result) {
            console.log('获取到的位置信息', result);
            let locInfo = result.result
            wx.setStorageSync('city', locInfo.address_component.city)
            wx.setStorageSync('address', locInfo.address)
            wx.setStorageSync('location', locInfo.location)
            _.setData({
              locText: locInfo.address_component.city
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
      },
      fail(err) {
        console.log('失败', err)
      }
    })
  },
  // 获取城市列表
  getCityList() {
    let _ = this
    let pars = {
      url: '/csp/AreaList',
      data:{
        sourceCode: util.sourceCode
      }
    }
    _ajaxApi(pars).then(res => {
      console.log('/order/dequeOrderNumber请求结果', res)
      var data = res.shopSiteAreaTreeVO;
      var _proObj = [];
      var _allCityDate = new Object();
      for (var j = 0, len = data.length; j < len; j++) {
        if (data[j]['type'] == '0') {
          _allCityDate = new Object();
          _allCityDate.pId = data[j]['id'];
          _allCityDate.name = data[j]['name'];
          _allCityDate.list = new Array();
          _proObj.push(_allCityDate)
        }
      }
      for (var j = 0, len = data.length; j < len; j++) {
        if (data[j]['type'] == '1') {
          for (var z = 0; z < _proObj.length; z++) {
            if (data[j]['pId'] == _proObj[z]['pId']) {
              _proObj[z]['list'].push(data[j])
            }
          }
        }
      }
      console.log('cityList', _proObj) 
      _.setData({
        cityList: _proObj
      })
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  toPoint(e){
    let _ = this
    let { cityname } = e.target.dataset || e.currentTarget.dataset
    console.log('当前选择的城市', cityname)
    util.toRouter('/pages/point/list?cityname=' + cityname)
  },


})