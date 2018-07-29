const http = require('../../../../common/http.js');
const constant = require('../../../../common/constant.js');
const upload = require("../../../../common/upload.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    previewImageArr: [],
    upLoadPreviewImageArr:[],
    inputContent:"",
    refundPrice:0,
    toatlPrice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsInfo = JSON.parse(options.goodsInfo);
    console.log(goodsInfo)
    this.setData({
      goodsInfo: goodsInfo,
      saleOrderRefundType: options.saleOrderRefundType,
      toatlPrice: Math.floor(goodsInfo.productPrice) * goodsInfo.saleOrderProductQty,
      refundPrice: Math.floor(goodsInfo.productPrice) * goodsInfo.saleOrderProductQty,
    })
  },
  handleRefundPrice:function(e){
    console.log(e)
    this.setData({
      refundPrice: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //图片选择
  previewImage: function (e) {
    let previewImageArr = this.data.previewImageArr
    var self = this;
    if (previewImageArr.length >= 6) {
      wx.showToast({
        title: '最多上传可以上传9张图片',
        mask: true,
        duration: 2000
      });
      return;
    }
    wx.chooseImage({
      count: 6 - previewImageArr.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        upload.uploadImage(res, function (result) {
          let previewImageArr = this.data.previewImageArr
          previewImageArr.push(result.tempFilePaths)
          let upLoadPreviewImageArr = this.data.upLoadPreviewImageArr
          upLoadPreviewImageArr.push(result.imageList[0].fileOriginalPath)
          this.setData({
            previewImageArr: previewImageArr,
            upLoadPreviewImageArr: upLoadPreviewImageArr
          })
      
        }.bind(this))

      }.bind(this)
    })
  },
  handleInputContent:function(e){
    this.setData({
      inputContent: e.detail.value
    })
  },
  handleSubmit:function(){
    http.request({
      url:"/lxn/sale/order/refund/mobile/v1/save/apply",
      data:{
        saleOrderId: this.data.goodsInfo.saleOrderId,
        saleOrderProductId: this.data.goodsInfo.saleOrderProductId,
        saleOrderRefundType: this.data.saleOrderRefundType,
        saleOrderRefundReason:this.data.inputContent,
        saleOrderRefundAmount: this.data.refundPrice,
        saleOrderRefundImageList: this.data.upLoadPreviewImageArr
      },success:function(res){
        if (res.result){
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../../order/order?index=0',
            })
          },1000)
        }
      }
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