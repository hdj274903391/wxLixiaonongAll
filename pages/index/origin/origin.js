const http =require("../../../common/http.js");
const QQMapWx = require('../../../qqMapSdk/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseAddress:false,
    nowOrigin:"上海",
    locationAddress:"",
    chooseRecent: [{ name: '上海' }, { name: '河南'}],
    hotOrigin: [{ name: '上海' }, { name: '河南' }],
    defaultAddress: {},
    serviceList:[],//服务城市
    displayDefaultAddress: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetLocation()
    this.handleDefaultAddress();
    this.handleServiceCity();
  },
  //获取当前坐标
  handleGetLocation:function(){
    var demo = new QQMapWx({
      key: 'KSRBZ-465WP-4OSDD-VL75D-GGTG7-P7FZD' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            this.setData({
              locationAddress: res.result.address
            })
           
          }.bind(this)
        });
      }.bind(this),
    })


  },
  //挑选位置
  handleChooseAddress:function(){
    this.setData({
      chooseAddress: !this.data.chooseAddress
    })
  },
  //改变默认位置
  handleChangeInput:function(e){
      this.setData({
        nowOrigin: e.currentTarget.dataset.index
      })
  },
  //获取默认地址
  handleDefaultAddress:function(){
    http.request({
      url:"/lixiaonong/member/address/mobile/v1/find/default",
      data:{},
      success:function(res){
          this.setData({
            defaultAddress: res
          })
      }.bind(this)
    })
  },
  //获取服务城市
  handleServiceCity:function(){
    http.request({
      url:'/common/district/mobile/v1/city/list',
      data:{},
      success:function(res){
      } 
    })
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
  handeleToAddAddress:function(){
    wx.navigateTo({
      url: '../../my/address/addAddress/addAddress',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})