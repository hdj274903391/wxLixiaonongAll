const http = require('../../../../common/http.js');
const constant = require('../../../../common/constant.js');
const util = require('../../../../common/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost:constant.imageHost,
    isUse:false,
    cardsList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.handleCardsList(options.goodsList);
  },
  handleIsUse:function(event){
    this.setData({
      isUse: !this.data.isUse
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var str = event.detail.value;
    prevPage.setData({
      cardsId: "",
      cardsName: "暂未使用优惠劵"
    });
    wx.navigateBack({
      delta: 1,
    })
   
  },
  handleCardsList: function (goodsList){
    let newGoodsList = JSON.parse(goodsList)
    http.request({
      url:"/lxn/member/coupon/mobile/v1/list/user/coupon",
      data:{
        saleOrderProductList: newGoodsList
      },
      success:function(res){
        for (var i = 0; i < res.length; i++) {
          res[i].couponValidTime = util.timestampToTime(res[i].couponValidTime);
          res[i].couponExpireTime = util.timestampToTime(res[i].couponExpireTime);
        }
        this.setData({
          cardsList:res
        })
      }.bind(this)
    })

    
  },
  handleToBack: function (event){ 
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var str = event.detail.value;
    prevPage.setData({
      cardsId: event.currentTarget.dataset.cardsid,
      cardsName: event.currentTarget.dataset.cardsname
    });
    wx.navigateBack({
      delta: 1,
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