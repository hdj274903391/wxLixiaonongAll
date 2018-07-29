// pages/shopDetail/evaluate/evaluate.js
const http = require("../../../common/http.js");
const constant = require("../../../common/constant.js")
const util = require("../../../common/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    activeStar: 4,
    typeSelect: 1,
    isExistsPic:1,
    goodsId:"",
    score:0,
    total:0,
    noPicTotal:0,
    picTotal:0,
    listDisplay:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     productId: options.productId,
     success:function(res){
     }
   })
   //this.handleGoodsSatisfactionDegree(this.data.goodsId);
   this.handleList(this.data.isExistsPic);
   

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
  //评论类型点击事件
  handlechangeType:function(e){
    const typeSelect = parseInt(e.currentTarget.dataset.typeselect)
    switch (typeSelect){
      case 1:
      this.setData({
        typeSelect:1,
        listDisplay:this.data.listAll
      })
      break;
      case 2:
        this.setData({
          typeSelect:2,
          listDisplay: this.data.listImg
        })
        break;
      default:
        this.setData({
          typeSelect:3,
          listDisplay: this.data.listFont
        })
    }

  },
  //评价列表接口
  handleList:function(index){
    let indexs = parseInt(index)
    http.request({
      url: '/lxn/saleOrderProductComment/mobile/v1/list',
      data: {
        productId: this.data.productId,
        pageIndex:1,
        pageSize:5
      }, success: function (res) {
        res.saleOrderProductCommentList = res.saleOrderProductCommentList.map(item=>{
          return{
            memberAvatarPath: item.memberAvatarPath,
            memberId: item.memberId,
            memberNickName: item.memberNickName,
            productId: item.productId,
            productSkuId: item.productSkuId,
            saleOrderId: item.saleOrderId,
            saleOrderProductCommentContent: item.saleOrderProductCommentContent,
            saleOrderProductCommentId: item.saleOrderProductCommentId,
            saleOrderProductCommentImageList: JSON.parse(item.saleOrderProductCommentImageList),
            saleOrderProductCommentSatisfaction: item.saleOrderProductCommentSatisfaction,
            saleOrderProductId: item.saleOrderProductId,
            systemCreateTime: util.formatTimeReturn(item.systemCreateTime / 1000, "Y.M.D h:m")

        }})
        res.rate = res.rate.toFixed(4)
        let listAll = res.saleOrderProductCommentList;
        let listImg = res.saleOrderProductCommentList.filter(cart => cart.saleOrderProductCommentImageList != "");
        let listFont = res.saleOrderProductCommentList.filter(cart => cart.saleOrderProductCommentImageList == "");
        this.setData({
          evaluateInfo:res,
          listDisplay: listAll,
          listAll: listAll,
          listImg: listImg,
          listFont: listFont
        })
        if (res.rate >= 0.8){
          this.setData({
            activeStar:5
          })
        }else{
          this.setData({
            activeStar: 4
          })
        }
      }.bind(this)
    })
  },
  onHide: function () {
  
  },
//返回上级（商品详情）
  handleToBack:function(){
    wx.navigateBack({})
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