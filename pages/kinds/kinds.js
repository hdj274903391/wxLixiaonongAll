const http = require('../../common/http.js');
const constant = require('../../common/constant.js');
const storage = require('../../common/storage.js');
const QQMapWx = require('../../qqMapSdk/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    locationAddress:"",
    productCategoryId:0,
    navigationItem:[],
    selectNavigation:"",
    secondNavigationList:[],//二级分类导航
    kindsItemCurrent:0,//当前一级导航下标
    kindsItemImages:"../Img/banner3.jpg",
    current: 0,
    tuiJianNavigationList: [{ title: "预售", navigateTo: 'handleToWillSale' }, { title: "团购", navigateTo:'handleToGroup' }, { title: "充值" }, { title: "邀请好友" }, { title: "企业合作" }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: "true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    this.handleGetLocation()
    this.handleFirstNaviagation();
  },

  //跳转定位
  handleToOrigin: function () {
    wx.navigateTo({
      url: './origin/origin',
    })
  },
  //跳转搜索
  handleToSearch: function () {
    wx.navigateTo({
      url: '../index/search/search',
    })
  },
  //获取当前坐标
  handleGetLocation: function () {
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
            storage.setProvice(res.result.address_component.province);
           
          }.bind(this)

        });
      }.bind(this),
    })
  },
  //一级导航
  handleFirstNaviagation:function(){
    http.request({
      url: '/lxn/product/category/mobile/v1/list',
      data: {},
      success: function (data) {   
        data.splice(0,2);
        this.setData({
          productCategoryId: data[0].productCategoryId,
          navigationItem: data,
          selectNavigation: data[0].productCategoryName
        });
         this.handleSecondeNavigationList()
      }.bind(this)
    });
  },
  //点击一级导航
  handleChangeFirstNavigataion:function(e){
    this.setData({
      kindsItemImages: "../Img/banner3.jpg",
      kindsItemCurrent:e.currentTarget.dataset.index,
      productCategoryId: this.data.navigationItem[e.currentTarget.dataset.index].productCategoryId,
      selectNavigation: this.data.navigationItem[e.currentTarget.dataset.index].productCategoryName,
    })
    this.handleSecondeNavigationList();
  },
  //二级分类列表
  handleSecondeNavigationList:function(){
    http.request({
      url: '/lxn/product/category/mobile/v1/list/product/by/category/ids',
      data: {
        productCategoryParentId: this.data.productCategoryId,
      },
      success: function (data) {
        this.setData({
          secondNavigationList: data
        });
      }.bind(this)
    });
  },
  //二级分类跳转
  handleToSecondNavigation: function (e) {
    let currentIndex = 0;
    if (e.currentTarget.dataset.index) {
      currentIndex = e.currentTarget.dataset.index
    }
    wx.navigateTo({
      url: '../index/shopKinds/shopKinds?productCategoryParentId=' + this.data.productCategoryId + '&selectNavigation=' + this.data.selectNavigation + '&current=' + currentIndex,
    })
  },

  //跳转预售
  handleToWillSale: function () {
    wx.navigateTo({
      url: '../index/willSale/willSale?type=' + "preSale" + '&name=' + "商品预售",
    })
  },
  //跳转团购
  handleToGroup: function () {
    wx.navigateTo({
      url: '../index/willSale/willSale?type=' + "group" + '&name=' + "商品团购",
    })
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