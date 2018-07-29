const notification = require('../../../common/notification.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  changeToAboutUs:function(){
  wx.navigateTo({
    url: './aboutUs/aboutUs',
  })
  },
  changeToSuggest:function(){
wx.navigateTo({
  url: './suggest/suggest',
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  goOut:function(){
    wx.showModal({
      title: '',
      content: '确认退出？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          notification.emit("member-info-storage",{})
          wx.switchTab({
            url: '../../index/index',
          })
        } else { }
      }
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
    return {
      title: '犁小农',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})