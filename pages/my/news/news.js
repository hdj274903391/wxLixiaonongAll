const http = require("../../../common/http.js");
const constant = require("../../../common/constant.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    content: [{iconSrc: "", title: "我的客服", introduce: "查看我与客服的沟通记录", bindtap: "changeToService", newsNum:"newsNum"},
      { iconSrc: "", title: "物流助手", introduce: "订单485893245已发货", bindtap: "changeToLogistics", newsNum: "2"},
      { iconSrc: "", title: "通知消息", introduce: "您有1件商品未付款", bindtap: "changeToNotice", newsNum: "3"}],
    logisticsCount:0,
    activityCount:0,
    noticeCount:0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.handleActivityCount();
    // this.handleLogisticsCount();
    this.handleNoticeCount();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //获取活动未读数目
  handleActivityCount:function(){
    http.request({
      url:"/lixiaonong/activity/mobile/v1/not/read/count",
      data:{},
      success:function(res){
          
          this.setData({
            activityCount:res.count
          })
      }.bind(this)
    })
  },
  //获取物流助手
  handleLogisticsCount:function(){
    http.request({
      url: "/lixiaonong/logistics/assistant/mobile/v1/not/read/count",
      data: {},
      success: function (res) {
        this.setData({
          logisticsCount: res.count
        })
      }.bind(this)
    })
  },
  //获取通知消息条数
  handleNoticeCount: function () {
    http.request({
      url: "/lxn/membernotice/mobile/v1/not/read/count",
      data: {},
      success: function (res) {
        this.setData({
          noticeCount: res.count
        })
      }.bind(this)
    })
  },
  //跳转客服
  changeToActivity:function(){
    wx.navigateTo({
      url: './activity/activity',
    })
  },
  //跳转物流
  changeToLogistics:function(){
    wx.navigateTo({
      url: './logistics/logistics',
    })
  },
  //跳转通知
  changeToNotice:function(){
    wx.navigateTo({
      url: './notice/notice',
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