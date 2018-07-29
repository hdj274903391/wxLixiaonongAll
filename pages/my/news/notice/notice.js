const http = require("../../../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //content: [{ time: "昨天 12:00", title: "【有奖调研】您对犁小农还满意吗", introduce: "最近您对犁小农的印象如何？参与调研可获得奖励"}],
    content:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleNoticeList()
  },
  //获取通知信息列表
  handleNoticeList: function () {
    http.request({
      url: "/lxn/membernotice/mobile/v1/list",
      data: {},
      success: function (res) {
      }.bind(this)
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