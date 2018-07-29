const http = require('../../../../common/http.js');
const constant = require('../../../../common/constant.js');
const util = require('../../../../common/util.js');
const notification = require('../../../../common/notification.js');
const storage = require("../../../../common/storage.js");
Page({


  data: {
    imageHost: constant.imageHost,
    orderId:"",
    youLikeList:[],
    orderInfo:{},
    pageIndex: 1,
    pageSize: 4,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: "true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    this.setData({
      orderStatus: options.orderStatus,
      saleOrderId: options.saleOrderId
    })
    console.log(this.data.orderStatus)
    this.handleYouLike();
    this.handleOrderDetail()
  },
  //获取订单详情
  handleOrderDetail:function(){
   
    http.request({
      url:"/lxn/sale/order/mobile/v1/find",
      data:{
        saleOrderId: this.data.saleOrderId,
      },
      success:function(res){

        res.saleOrderDistributionStartTime = util.formatTimeReturn(res.saleOrderDistributionStartTime / 1000, "Y.M.D h:m")
        res.saleOrderDistributionEndTime = util.formatTimeReturn(res.saleOrderDistributionEndTime / 1000, "h:m")
        res.systemCreateTime = util.formatTimeReturn(res.systemCreateTime / 1000 , "Y.M.D h:m" )
      this.setData({
        orderInfo:res,
        goodsList: res.saleOrderProductList,
        goodType: res.saleOrderType
      })
      }.bind(this)
    })
  },
  //猜你喜欢
  handleYouLike:function(){
    http.request({
      url:"/lxn/product/mobile/v1/guest/list",
      data:{
        productCategoryId:"",
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
      },
      success: function (res) {
        let youLikeList = this.data.youLikeList;
        youLikeList = youLikeList.concat(res.list)

        this.setData({
          youLikeList: youLikeList,
          goodsTotal: res.total
        });

      }.bind(this)
      
    })
  },
  //跳转商品详情
  handleToShopDetail: function (e) {
    var goodsId = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../../../shopDetail/shopDetail?goodsId=' + goodsId,
    })
  },
  //取消订单接口
  handleCancleOrder:function(){
    wx.showModal({
      title: '您确定取消此订单？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          http.request({
            url:"/lxn/sale/order/mobile/v1/cancel",
            data:{
              saleOrderId: this.data.saleOrderId
            },
            success: function (res) {
              if (res.isCancle){
                wx.showToast({
                  title: '取消成功！',
                })
               setTimeout(function(){
                 wx.navigateTo({
                   url: '../order?index=0',
                 })
               },500)
              }
            }.bind(this)
          })
        }
    }.bind(this)
    })
 
  },
  //客服电话
  handleCall:function(){
    wx.makePhoneCall({
      phoneNumber: '400-821-6094',
      success: function (){
      },
      fail: function () {
      }
    })
  },
  changeToEvaluate: function () {
    let goodsList = this.data.goodsList;
    goodsList = goodsList.map(item=>{
      return{
        productId: item.productId,
        productImagePath: item.productImagePath,
        productName: item.productName,
        productTitle: item.productTitle,
        productUnit: item.productUnit,
        productWeight: item.productWeight,
        productSkuId: item.productSkuId,
        productPrice: item.productPrice,
        saleOrderProductId: item.saleOrderProductId,
        saleOrderId: item.saleOrderId
      }
    })
    wx.navigateTo({
      url: '../evaluate/evaluate?goodsList=' + JSON.stringify(goodsList),
    })
  },
  //付款按钮
  handleToPay: function () {
    let saleOrderId = this.data.saleOrderId
    http.request({
      url: "/lxn/sale/order/mobile/v1/pay/order",
      data: {
        saleOrderId: saleOrderId
      },
      success: function (res) {
        this.handlePay(res.saleOrderId, res.saleOrderPayAmount);
      }.bind(this)
    })
  },
  //支付
  handlePay: function (orderId, totalFee) {
    http.request({
      url: '/wechat/wechat/pay/mobile/v2/unified/order',
      data: {
        openId: storage.getOpenId(),
        tradeType: "JSAPI",
        outTradeNo: orderId,
        wechatPayItemType:0,
        body: "梨小农-订单",
        totalFee: totalFee * 100,
        attach: JSON.stringify({ saleOrderId: orderId })
      },
      success: function (data) {
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.packageStr,
          'signType': data.signType,
          'paySign': data.paySign,
          'appId': data.appId,
          'success': function (res) {
            wx.navigateTo({
              url: '../order?index=1',
            })
          },
          'fail': function (res) {
          wx.navigateTo({
            url: '../order?index=1',
          })
          }.bind(this)
        })
      }.bind(this)
    })
  },
//跳转售后
  handleToService:function(e){
    let index = e.currentTarget.dataset.index;
    let goodsInfo = this.data.orderInfo.saleOrderProductList[index];
    console.log(goodsInfo)
    wx.navigateTo({
      url: '../../service/service?goodsInfo=' + JSON.stringify(goodsInfo),
    })
  },
  //提醒发货
  handleSendBtn: function (e) {
    let saleOrderId = e.currentTarget.dataset.saleorderid;
    http.request({
      url: "/lxn/sale/order/notice/mobile/v1/save",
      data: {
        saleOrderId: saleOrderId
      }, success: function (res) {
        if (res.result) {
          wx.showToast({
            title: '已提醒发货！',
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../order?index=2',
            })
          }, 500)
        }
      }
    })

  },
  //确认收货
  //确认收货
  handleGetBtn: function (e) {
    let saleOrderId = e.currentTarget.dataset.saleorderid;
    http.request({
      url: "/lxn/sale/order/mobile/v1/confirm",
      data: {
        saleOrderId: saleOrderId
      }, success: function (res) {
        if (res.saleOrderIsConfirm) {
          wx.showToast({
            title: '确认收货成功！',
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../order?index=3',
            })
          }, 500)
        }
      }
    })

  },
  changeToService: function () {
    wx.navigateTo({
      url: '../../service/service',
    })

  },
  //删除订单
  handleDelateOrder: function () {
    let saleOrderId = this.data.saleorderid;
    wx.showModal({
      title: '您确定取消此订单？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          http.request({
            url: "/lxn/sale/order/mobile/v1/delete",
            data: {
              saleOrderId: saleOrderId
            },
            success: function (res) {
              if (res.flag) {
                wx.showToast({
                  title: '删除成功！',
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../order?index=0',
                  })
                }, 500)
              }
            }.bind(this)
          })
        }
      }.bind(this)
    })
  },
  //再次购买
  handleBuyAgain:function(){
    http.request({
      url:"/lxn/sale/order/mobile/v1/again",
      data:{
        saleOrderId: this.data.saleOrderId
      },success:function(res){
        console.log(res)
        if (res.productType == "groupon" || res.productType == "preSale" ){
          wx.navigateTo({
            url: '../../../shopDetail/shopDetail?goodsId=' + res.productId,
          })
        }else{
          wx.showToast({
            title: '已加入购物车！',
          })
          notification.emit("member-add-cart", {});
          setTimeout(function(){
            wx.switchTab({
              url: '../../../shop/shop',
            })
          },500)
        }
      }
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
  onReachBottom: function () {
    var pageIndex = this.data.pageIndex;
    var pageSize = this.data.pageSize;
    var total = this.data.goodsTotal;
    if (pageIndex * pageSize >= total) {
      return;
    }
    pageIndex++;
    this.setData({
      pageIndex: pageIndex
    })
    this.handleYouLike();
  },
  //跳转地址界面
  changeToAddress:function(){
    wx.navigateTo({
      url: '../../address/address',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})