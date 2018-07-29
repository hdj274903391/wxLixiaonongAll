const http = require('../../../common/http.js');
const constant = require('../../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsInfo = JSON.parse(options.goodsInfo)
    console.log(goodsInfo)
    this.setData({
      goodsInfo: goodsInfo
    })
    // this.handleOrderDetail()
  },
  //获取订单详情
  handleOrderDetail: function () {

    http.request({
      url: "/lxn/sale/order/mobile/v1/find",
      data: {
        saleOrderId: this.data.saleOrderId,
      },
      success: function (res) {
        console.log(res)
        res.saleOrderDistributionStartTime = util.formatTimeReturn(res.saleOrderDistributionStartTime / 1000, "Y.M.D h:m")
        res.saleOrderDistributionEndTime = util.formatTimeReturn(res.saleOrderDistributionEndTime / 1000, "h:m")
        res.systemCreateTime = util.formatTimeReturn(res.systemCreateTime / 1000, "Y.M.D h:m")
        this.setData({
          orderInfo: res,
          goodsList: res.saleOrderProductList,
          goodType: res.saleOrderType
        })
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
  //跳转退款页面
  changeToRefund:function(e){
    wx.navigateTo({
      url: './refund/refund?goodsInfo=' + JSON.stringify(this.data.goodsInfo) + "&saleOrderRefundType=" + e.currentTarget.dataset.index ,
    })
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