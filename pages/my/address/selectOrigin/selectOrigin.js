const QQMapWx = require('../../../../qqMapSdk/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var demo = new QQMapWx({
      key: 'KSRBZ-465WP-4OSDD-VL75D-GGTG7-P7FZD' // 必填
    });
    this.moveToLocation(); 
  },
  //移动选点
  moveToLocation: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
  
    wx.chooseLocation({
      success: function (res) {
        prevPage.setData({
          state: 1,
          info: res
        }) 
        //选择地点之后返回到原来页面
        wx.navigateBack({
          delta: 1,
        })
      }.bind(this),
      fail: function (err) {
      }
    });
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