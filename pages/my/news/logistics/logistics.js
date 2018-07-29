const http = require("../../../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:[],
    // content: [{ time: "昨天 12:00", title: "订单52341236已发货", shopName: "美国华盛顿甜脆红地厘蛇…", shopNum: "1", unit:"6个  1.20kg"}],
    logisticsList:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleLogisticsList()
  },

 
    //获取活动信息列表
  handleLogisticsList: function () {
    http.request({
      url: "/lixiaonong/logistics/assistant/mobile/v1/list",
      data: {},
      success: function (res) {
      }.bind(this)
    })
  }, 
  handleToIndex:function(){
    wx.switchTab({
      url: '../../../index/index',
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