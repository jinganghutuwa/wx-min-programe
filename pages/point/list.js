// pages/point/list.js
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
    curIdx:0,
    shopList:[],
    defaultImg: '../../images/icon_logo.png',
    loadingText:'加载中...',
    isHiddenLoading:true,
    isShowList:true,
    markers: [],
    curShopInfo:null,
    centerMapLoc:{},
    isShowNoData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _ = this
    wx.setNavigationBarTitle({
      title: '门店查询'
    })
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'SADBZ-QYEC5-W4NIK-Q3UEC-GRD6S-WYBZQ'
    });
    _.toast = _.selectComponent("#toast");
    console.log('页面携带的参数',options)
    _.cityName = options.cityname
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function () {
    let _ = this
    
    console.log('获取所在城市', wx.getStorageSync('city'))
    if (!(wx.getStorageSync('city') && wx.getStorageSync('location').lat && wx.getStorageSync('location').lng)) {
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
    }else{
      _.getShopList()
      _.setData({
        centerMapLoc: wx.getStorageSync('location')
      })
    }
    _.getCityList()
  },
  // 获取经纬度 地址信息
  getLocInfo() {
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
            _.getShopList()
            _.setData({
              centerMapLoc: locInfo.location
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
      data: {
        cityName: _.cityName || wx.getStorageSync('city')
      }
    }
    _ajaxApi(pars).then(res => {
      let clist = res.shopSiteAreaTreeVO.filter(i => { return i.type == 2 })
      clist.unshift({ areaId:null,name:'全城'})
      clist = clist.map((i,index)=>{
        i.idx = index
        return i
      })
      _.setData({
        cityList: clist
      })
      console.log('获取的城市列表为：',_.data.cityList)
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  curAreaId: null, // 存储当前选择的区域id
  pageNum:1,
  isEnd: false,
  // 切换区域
  chooseAera: function (e) {
    console.log('picker发送选择改变，携带值为', e)
    let _ = this
    _.setData({
      curIdx: e.detail.value
    })
    let curIndex = Number(_.data.curIdx)
    let cityList = _.data.cityList
    _.curAreaId = cityList[curIndex].areaId
    console.log('选择的区域obj', _.curAreaId, cityList[curIndex])
    qqmapsdk.geocoder({
      address: _.cityName + cityList[curIndex].name,
      region: _.cityName,
      success(res){
        console.log(res)
        _.setData({
          centerMapLoc: res.result.location
        })
      },
      fail(err){
        _.setData({
          centerMapLoc: wx.getStorageSync('location')
        })
      }
    })
    _.isEnd = false
    _.setData({
      isHiddenLoading:true,
      loadingText:'加载中...',
      shopList:[],
      markers:[],
      curShopInfo:null,
      isShowNoData:false
    })
    _.getShopList()
  },
  // 获取网点列表
  getShopList(){
    let _ = this
    if (!(wx.getStorageSync('location').lat && wx.getStorageSync('location').lng)){
      _.onReady()
    }
    if ( _.isEnd ) return
    let pars = {
      url: '/csp/shopList',
      data: {
        cityName: _.cityName || wx.getStorageSync('city'),
        areaId: _.curAreaId,
        coordinate: wx.getStorageSync('location').lng + ',' + wx.getStorageSync('location').lat,
        pageNo: _.pageNum,
        pageSize: 10,
        sourceCode: util.sourceCode
      }
    }
    _ajaxApi(pars).then(res => {
      let { totalCount, shopSiteVO } = res
      _.setData({
        isHiddenLoading: true
      })
      if (_.pageNum * 10 < totalCount){
        _.isEnd = false
        
      }else{
        _.isEnd = true
        _.setData({
          isHiddenLoading: false,
          loadingText:'我也是有底线的哦~'
        })
      }
      if (!shopSiteVO || (shopSiteVO && shopSiteVO.length == 0)){
        _.setData({
          isShowNoData: true
        })
      }else{
        shopSiteVO = shopSiteVO.map(i => {
          i.shopDistance = i.shopDistance.toLowerCase()
          return i
        })

        _.setData({
          shopList: _.data.shopList.concat(shopSiteVO)
        })
        console.log('获取的网点列表', _.data.shopList)
        let markers = _.data.shopList.map((i, idx) => {
          let m = {}
          m.id = idx
          m.latitude = Number((i.coordinate.split(',')[1]) || 0)
          m.longitude = Number((i.coordinate.split(',')[0]) || 0)
          m.iconPath = '../../images/map_icon2.png'
          m.width = '52rpx'
          m.height = '82rpx'
          m.alpha = 0.6
          return m
        })
        _.setData({
          markers
        })
        console.log('获取的markers', _.data.markers)
      }
      
    }).catch(err => {
      if (err && err.resultDesc) {
        _.toast.showToast(err.resultDesc);
      }
    })
  },
  toCall(e){
    let { tel } = e.target.dataset || e.currentTarget.dataset
    util.toCall(tel)
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
    console.log('触底了')
    let _ = this
    if (!_.data.isShowList) return
    _.setData({
      isHiddenLoading:false
    })
    // setTimeout(()=>{
      _.pageNum++
      _.getShopList()
    // },2000)
    
  },
  // d导航
  toNav(e){
    let _ = this
    let { name, address, coordinate } = e.target.dataset || e.currentTarget.dataset
    console.log('当前选择的网点信息', name, address, coordinate)
    wx.openLocation({
      latitude: Number(coordinate.split(',')[1]) || wx.getStorageSync('location').lat,
      longitude: Number(coordinate.split(',')[0]) || wx.getStorageSync('location').lng,
      scale: 18,
      name,
      address
    })
  },
  // 切换地图和列表
  checkMap(){
    let _ = this
    _.setData({
      isShowList: !_.data.isShowList
    })
    console.log('点击选则')
  },
  // 点击标注
  getMarkerInfo(e){
    let _ = this
    let curMar = e.markerId
    
    let { markers, shopList } = _.data
    markers = markers.map((i,idx)=>{
      i.iconPath = '../../images/map_icon2.png'
      if (curMar == idx){
        i.iconPath = '../../images/map_icon1.png'
      }
      return i
    })
    let curShopInfo = shopList[curMar]
    _.setData({
      markers, curShopInfo,
      centerMapLoc: { 
        lat: curShopInfo.coordinate.split(',')[1] || '',
        lng: curShopInfo.coordinate.split(',')[0] || '',
      
      }
    })

    console.log('获取到的当前商户信息', curMar, curShopInfo)
  }
})