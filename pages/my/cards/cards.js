const http = require('../../../common/http.js');
const util = require('../../../common/util.js');
const constant = require('../../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost:constant.imageHost,
    cardsKindSelect:0,
    cards: [{ title: "全场", num: 0, },{ title: "单品", num: 0,}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleSingleProductList();
    setTimeout(function () { this.handleCardsList();}.bind(this),1
    )
    
  },
  handeChangeCardsKind:function(e){
    this.setData({
      cardsKindSelect: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index === 1){
     
      this.handleSingleProductList();
    }else{
      this.handleCardsList()
    }
  },
  //获取单品优惠劵列表
  handleSingleProductList: function () {
    http.request({
      url: "/lxn/member/coupon/mobile/v1/type/list",
      data: {
        "couponType": "singleProduct"
      }, success: function (res) {
        let cards = "cards[1].num"
        for (var i = 0; i < res.list.length; i++) {
          res.list[i].couponValidTime = util.timestampToTime(res.list[i].couponValidTime);
          res.list[i].couponExpireTime = util.timestampToTime(res.list[i].couponExpireTime);
        }

        this.setData({
          cardsContent: res.list,
          [cards]:res.list.length
        })
       
      }.bind(this)
    })
  },
  //获取全场优惠劵列表
  handleCardsList:function(){
    http.request({
      url:"/lxn/member/coupon/mobile/v1/type/list",
      data:{
        "couponType":"allProduct"
      },success:function(res){
        let cards = "cards[0].num"
        for (var i = 0; i < res.list.length; i++) {
          res.list[i].couponValidTime = util.timestampToTime(res.list[i].couponValidTime);
          res.list[i].couponExpireTime = util.timestampToTime(res.list[i].couponExpireTime);
        }

        this.setData({
          cardsContent: res.list,
          [cards]: res.list.length
        })
      }.bind(this)
    })
  },
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