const http = require('../../../../common/http.js');
const util = require('../../../../common/util.js');
const constant = require('../../../../common/constant.js');
const storage = require("../../../../common/storage.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost:constant.imageHost
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
     this.handleOrderList();
  }, 
  handleOrderList: function (saleOrderStatus) {
    this.setData({
      orderList: []
    })
    http.request({
      url: '/lxn/sale/order/mobile/v1/list',
      data: {
        saleOrderStatus: 4,
        pageIndex: 1,
        pageSize: 6
      },
      success: function (data) {
        let overTime = null;
        if (data.list.length > 0) {
          this.setData({
            orderList: data.list,
            swiperHeight: data.list.length * 205 + 80
          })
        }
      }.bind(this)
    })
  },
  changeToService: function (e) {
    let saleOrderId = e.currentTarget.dataset.saleorderid
    wx.navigateTo({
      url: '../../service/service?saleOrderId=' + saleOrderId + "&orderStatus=" + e.currentTarget.dataset.orderstatus ,
    })
  
  },
  changeToWillPay:function(index){
    wx.navigateTo({
      url: '../willPayOrder/willPayOrder?saleOrderId=' + index.currentTarget.dataset.saleorderid + "&orderStatus=" + index.currentTarget.dataset.orderstatus,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})