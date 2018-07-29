const http = require("../../../common/http.js");
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
  this.handleGetWallet()
  },
  //获取钱包详情
  handleGetWallet:function(){
    http.request({
      url:"/lxn/member/mobile/v1/find/balance/point",
      data:{}
      ,success:function(res){
        this.setData({
          wallet:res
        })
      }.bind(this)
    })
  },
  //跳转充值
  changeToMoney:function(){
    wx.navigateTo({
      url: './money/money',
    })
  },
  //跳转积分
  handleToScore:function(){
    wx.navigateTo({
      url: './score/score?score=' + this.data.wallet.memberPoint,
    })
  },
  //跳转明细
  handleToAccountList:function(){
    wx.navigateTo({
      url: './accountList/accountList?type=' + "money",
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