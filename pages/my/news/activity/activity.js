const http=require("../../../../common/http.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [{ time: "2017.12.01 21:00", title: "12月12日促销活动", src: "", over: false, introduce:"限时秒杀，新鲜空运水果次日到货，购物满100 元再送好礼！"},
      { time: "2017.12.01 21:00", title: "12月12日促销活动", src: "", over: true, introduce: "限时秒杀，新鲜空运水果次日到货，购物满100 元再送好礼！" }],
      activityList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleInfoList();
  },
  //获取活动信息列表
  handleInfoList:function(){
      http.request({
        url:"/lixiaonong/activity/mobile/v1/list",
        data:{},
        success:function(res){
            this.setData({
              activityList:res
            })
        }.bind(this)
      })
  }, 
  //跳转活动详情
  handleToActivityDetail:function(){

  } ,
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