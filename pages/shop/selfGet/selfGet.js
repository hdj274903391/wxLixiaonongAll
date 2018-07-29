// pages/my/address/address.js
const notification = require("../../../common/notification.js")
const http = require('../../../common/http.js');
const QQMapWx = require('../../../qqMapSdk/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    locationProvinces:"",
    locationArea: "",
    locationCity: "",
    latitude:0,
    longitude:0,
  },
  //获取用户当前中文地址
  handleGetLocation:function(){
    var demo = new QQMapWx({
      key: 'KSRBZ-465WP-4OSDD-VL75D-GGTG7-P7FZD' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(data) {
        demo.reverseGeocoder({
          location: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          success: function (res) {
            this.setData({
              locationProvinces: res.result.address_component.province,
              locationArea: res.result.address_component.district,
              locationCity: res.result.address_component.city,
              latitude: data.latitude,
              longitude: data.longitude
            })
            this.handleAddressList()
          }.bind(this)
        });
      }.bind(this),
    })
   
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetLocation()
   

  },
  //获取地址列表
  handleAddressList: function () {
    http.request({
      url: '/lxn/merchantStore/mobile/v1/list',
      data: {
        "userLatitude": this.data.latitude,
        "userLongitude": this.data.longitude
      }, success: function (data) {
        this.setData({
          addressList:data
        })
      }.bind(this)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //设置默认自提门店
  handleChangeFault: function (e) {
    let addressList = this.data.addressList
    const index = e.currentTarget.dataset.index
    const storeId = e.currentTarget.dataset.storeid
    http.request({
      url:"/lxn/merchantStore/mobile/v1/update",
      data:{
        storeId: storeId
      },success:function(res){
          if (res.result){
            wx.showToast({
              title: '设置成功！',
            })
            notification.emit("member-store-setDefalut",{})
            setTimeout(function(){
              wx.navigateBack({})
            },500)
          
          }
      }.bind(this)
    })
  },
 
  setDefault: function (e) {
    const _this = this
    const index = e.currentTarget.dataset.index
    const first = _this.data.addressList.splice(index, 1)
    _this.data.addressList.unshift(first[0])
    wx.request({
      url: 'http://192.168.1.156:8080/member/shipping/mobile/v1/set/default',
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        appId: _this.data.appId,
        memberId: _this.data.appId,
        memberShippingId: _this.data.addressList[index].memberShippingId
      }, success: function (data) {
        _this.setData({
          addressList: _this.data.addressList
        })

      }
    })



  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})