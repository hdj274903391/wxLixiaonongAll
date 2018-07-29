// pages/cardpackage/cardpackage.js
const http = require('../../../common/http.js');
const util = require('../../../common/util.js');
const constant = require('../../../common/constant.js');
const notification = require('../../../common/notification.js');
const storage = require("../../../common/storage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    bottomColor: "transparent",
    showfilterindex: 0,
    navigationItem: [{ text: "全部" }, { text: "待付款" }, { text: "待发货" }, { text: "待收货" }, { text: "待评价" }],
    orderList: [],
    willPayList:[],
    willSendList:[],
    willGetList:[],
    willEvaluateList:[],
    getTimeList: [{ time: "2月21日", choose: false }, { time: "2月21日", choose: false }, { time: "2月21日", choose: false }],
    getTime:false,
    pageIndex: 1,
    pageSize: 5,
    saleOrderStatus:null,
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
    notification.on("member-orderList", this, function (data) {
    
    })
    this.setData({
      showfilterindex: parseInt(options.index)
    }) 
    // this.handleOrderList();
    this.handleLoad();
  },
  changeNavigation: function (e) {
    this.setData({
      showfilterindex: e.currentTarget.dataset.findex
    })
  },
  handleLoad() {
    var that = this;
    var index = this.data.showfilterindex;
    let saleOrderStatus = null;
    
    if(index != 0){
      saleOrderStatus = index - 1;
      this.setData({
        saleOrderStatus: saleOrderStatus
      })
    }else{
      this.setData({
        saleOrderStatus: saleOrderStatus
      })
      this.handleOrderList()
    }
    
    
  },
  handleOrderList: function () {
    http.request({
      url: '/lxn/sale/order/mobile/v1/list',
      data: {
        saleOrderStatus: this.data.saleOrderStatus,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      success: function (data) {
        console.log(data.list.length)
        let overTime = null;
        let newOrderList = this.data.orderList;
        if (data.list.length>0){
          let orderList = data.list

          for (var i = 0; i < orderList.length;i++){
             orderList[i].imageList = orderList[i].saleOrderProductList.length;
             if (orderList[i].imageList>=2){
               orderList[i].imageList = 3
             }else{
               orderList[i].imageList = orderList[i].imageList
             }
          }
          newOrderList = newOrderList.concat(orderList)
          this.setData({
            orderList: newOrderList,
            swiperHeight: newOrderList.length * 205 + 80,
            goodsTotal: data.total,
          })
        }
      }.bind(this)
    })
  },
  //取消订单
  handleCancleOrder:function(e){
    let _this= this;
    wx.showModal({
      title: '您确定取消此订单？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          http.request({
            url: "/lxn/sale/order/mobile/v1/cancel",
            data: {
              saleOrderId: e.currentTarget.dataset.orderid
            },
            success: function (res) {
              let orderList = _this.data.orderList
            
              if (res.isCancle){
                orderList.splice(e.currentTarget.dataset.index, 1);
                _this.setData({
                  orderList: orderList
                })
                wx.showToast({
                  title: '取消成功！',
                })
              }
            }.bind(this)
          })
        }
      }
    })         
 
  },
  //跳转拼团详情
  handleGroupDetail:function(e){
    let saleOrderId = e.currentTarget.dataset.saleorderid;
    wx.navigateTo({
      url: './groupShopDetail/groupShopDetail?saleOrderId=' + saleOrderId + "&share=" + false,
    })
  },
  //送达日期
  getTime:function(){
    this.setData({
      getTime:!this.data.getTime
    })
  },
  //日期选择
  chooseTime:function(e){

    const _this=this;
 
    const index = e.currentTarget.dataset.index;
    const getTimeList = _this.data.getTimeList;
    getTimeList[index].choose = !_this.data.getTimeList[index].choose;

    _this.setData({
      getTimeList: getTimeList
    })
  },

  changeToWillPay:function(index){
  
    wx.navigateTo({
      url: './willPayOrder/willPayOrder?saleOrderId=' + index.currentTarget.dataset.saleorderid + "&orderStatus=" + index.currentTarget.dataset.orderstatus,
    })
  },
  //跳转待评价商品详情
  changeToWillEvaluate:function(){
    wx.navigateTo({
      url: './willEvaluate/willEvaluate',
    })
  },
//付款按钮
  handleToPay:function(e){
    let saleOrderId = e.currentTarget.dataset.saleorderid
    http.request({
      url:"/lxn/sale/order/mobile/v1/pay/order",
      data:{
        saleOrderId: saleOrderId
      },
      success:function(res){
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
        body: "梨小农-订单",
        wechatPayItemType:0,
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
            this.handleOrderList();
          }.bind(this),
          'fail': function (res) {
            this.setData({
              orderList:[]
            })
            this.handleOrderList();
          }.bind(this)
        })
      }.bind(this)
    })
  },
  //待付款接口
  willPay:function(){
    http.request({
      url: '/lixiaonong/order/mobile/v1/list',
      data: {
        orderStatus: 0,
        pageIndex: 1,
        pageSize: 6
      }, 
      success: function (data) {
        this.setData({
          willPayList: data.list
        })
      }.bind(this)
    })
  },
  //代发货接口
  willSend:function(){
    http.request({
      url: '/lixiaonong/order/mobile/v1/list',
      data: {
        orderStatus: 1,
        pageIndex: 1,
        pageSize: 6
      },
      success: function (data) {
        this.setData({
          willSendList: data.list
        })
      }.bind(this)
    })
  },
  //待收货接口
  willGet:function(){
    http.request({
      url: '/lixiaonong/order/mobile/v1/list',
      data: {
        orderStatus: 2,
        pageIndex: 1,
        pageSize: 6
      },
      success: function (data) {
        this.setData({
          willGetList: data.list
        })
      }.bind(this)
    })
  },
  //待评价接口
  willEvaluate:function(){
    http.request({
      url: '/lixiaonong/order/mobile/v1/list',
      data: {
        orderStatus: 3,
        pageIndex: 1,
        pageSize: 6
      },
      success: function (data) {
        this.setData({
          willEvaluateList: data.list
        })
      }.bind(this)
    })
  },
  //跳转待发货订单
  changeToWillSend:function(){
    wx.navigateTo({
      url: './willSend/willSend',
    })
  },
  //跳转待收货订单
  changeToWillGet:function(){
    wx.navigateTo({
      url: './willGet/willGet',
    })
  },
  //提醒发货
  handleSendBtn: function (e) {
    let saleOrderId = e.currentTarget.dataset.saleorderid;
    http.request({
      url:"/lxn/sale/order/notice/mobile/v1/save",
      data:{
        saleOrderId: saleOrderId
      },success:function(res){
        if (res.result){
          wx.showToast({
            title: '已提醒发货！',
          })
          this.handleOrderList();
        }
      }.bind(this)
    })
   
  },
  //确认收货
  handleGetBtn: function (e) {
    let saleOrderId = e.currentTarget.dataset.saleorderid;
    http.request({
      url: "/lxn/sale/order/mobile/v1/confirm",
      data: {
        saleOrderId: saleOrderId
      }, success: function (res) {
        if (res.saleOrderIsConfirm){
          wx.showToast({
            title: '确认收货成功！',
          })
          this.handleOrderList();
        }
      }.bind(this)
    })
   
  },
  changeToEvaluate: function (e) {
    let goodsList = this.data.orderList[e.currentTarget.dataset.index].saleOrderProductList;
    goodsList = goodsList.map(item => {
      return {
        productId: item.productId,
        productImagePath: item.productImagePath,
        productName: item.productName,
        productTitle: item.productTitle,
        productUnit: item.productUnit,
        productWeight: item.productWeight,
        productSkuId: item.productSkuId,
        productPrice: item.productPrice,
        saleOrderProductId: item.saleOrderProductId,
        saleOrderId: this.data.orderList[e.currentTarget.dataset.index].saleOrderId
      }
    })
    wx.navigateTo({
      url: './evaluate/evaluate?goodsList=' + JSON.stringify(goodsList),
    })
  },
  handleChangeNavigation:function(e){
    this.setData({
      showfilterindex: e.detail.current,
      orderList:[],
      pageIndex:1
    })
    if (e.detail.current >= 1){
        this.setData({
          saleOrderStatus: e.detail.current - 1
        }) 
    }else{
      this.setData({
        saleOrderStatus: null
      })
    }
    this.handleOrderList()
   
  },
  //删除订单
  handleDelateOrder: function (e){
    let saleOrderId = e.currentTarget.dataset.saleorderid;
    let _this = this;
    wx.showModal({
      title: '您确定删除此订单？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          http.request({
            url: "/lxn/sale/order/mobile/v1/delete",
            data: {
              saleOrderId: saleOrderId
            },
            success: function (res) {
             
              let orderList = _this.data.orderList

              if (res.flag) {
                orderList.splice(e.currentTarget.dataset.index, 1);
                _this.setData({
                  orderList: orderList
                })
                wx.showToast({
                  title: '删除成功！',
                })
              }
            }.bind(this)
          })
        }
      }
    })  
   
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
    this.handleOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})