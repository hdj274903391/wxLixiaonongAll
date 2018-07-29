// pages/shop/newOrder/newOrder.js
const http = require("../../../common/http.js");
const notification = require("../../../common/notification.js");
const storage = require("../../../common/storage.js");
const constant = require('../../../common/constant.js');
const util = require('../../../common/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    selectGetType:1,
    orderStatus:true,
    selectPay: true,
    goodsList: [],
    defaultAddress: {},
    login:true,
    sendTime: [["2月5号", "2月6号"], ["07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00","19:00-20:00"]],
    timeIndex: [0, 0],
    totalPrice:0,
    orderIsInvoice:false,//开具发票
    usePointIs:true,//是否使用积分
    latitude:0,
    longitude:0,
    storeId:"",//门店Id
    storeName:"",//门店名称
    sendDay:"",//发货日期
    sendStartTimes:"07:00",//发货时间
    sendEndTime:"08:00",//发货截止时间
    shopType:"",//购买类型：团购，预售，正常....
    cardsId:"",
    isSend:true,//是否配送
    cardsName:"暂未使用优惠劵",
    cardsNum:0,//可用优惠劵数目
    invoicesInfo: { invoiceHeader:"0", saleOrderInvoiceCardNumber: "", saleOrderInvoiceCompanyName: "", saleOrderInvoiceUserName:""}//发票信息
  },
  onLoad: function (options) {
   
    const latitude = storage.getLatitude(latitude);
    const longitude = storage.getLongitude(longitude);
    let thisTommorow = "sendTime[" + 0 + "][" + 0 + "]";
    let thisTommorowDay = "sendTime[" + 0 + "][" + 1 + "]";
    let tommorow = null;
    let tommorowDay = null;
    let sendDay = null;
    wx.showLoading({
      title: '加载中',
      mask: "true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000) 
    notification.on("member-add-address", this, function (data) {
      this.handleDefaultAddress();
    });
    notification.on("member-store-setDefalut", this, function (data) {
      this.handleGetgoods();
    });
    if (storage.getToken("token")) {
      this.setData({
        login: true
      })
      if (options.carts) {
        var carts = JSON.parse(options.carts);
        this.handleDefaultAddress();
        this.setData({
          latitude: latitude,
          longitude: longitude,
          goodsList: carts,
          shopType: options.shopType
        })
        if (options.shopType != "preSale") {
          tommorow = util.getDateStr(null, 1).year;
          
          tommorowDay = util.getDateStr(null, 2).year;
          sendDay = util.getDateStr(null, 1).year
        } else {
          tommorow = util.formatTimeReturn(this.data.goodsList[0].preSaleDeliveryTime / 1000, "Y-M-D");
          tommorowDay = util.getDateStr(tommorow, 1).year;
          sendDay = tommorow;
          let preSaleDeliveryTime = util.formatTimeReturn(this.data.goodsList[0].preSaleDeliveryTime / 1000, "Y-M-D h:00");
          this.setData({
            preSaleDeliveryTime: preSaleDeliveryTime
          })
          console.log(this.data.preSaleDeliveryTime)
        }
        this.setData({
          sendDay: sendDay,
          [thisTommorow]: tommorow,
          [thisTommorowDay]: tommorowDay
        })
        switch (options.shopType){
          case "groupon":
            this.handleGroupTotalPrice()
            break;
          case "normal":
            this.handleCardsNum()
            this.handleNormalTotalPrice()
            break;
          default:
            this.handlePreSaleTotalPrice();
        }
      }
    } else {
      this.setData({
        login: false,

      })
    }
  },
  //选择收货方式
  handleToSelectGetType: function (e){
    const selectGetType = parseInt(e.currentTarget.dataset.selectgettype)
    this.setData({
      selectGetType: selectGetType
    })
    if (selectGetType === 1){
      this.handleDefaultAddress();
      this.setData({
        isSend:true
      })
    }else{
      this.handleGetgoods();
      this.setData({
        isSend: false
      })
    }
    switch (this.data.shopType) {
      case "groupon":
        this.handleGroupTotalPrice()
        break;
      case "normal":
        this.handleNormalTotalPrice()
        break;
      default:
        this.handlePreSaleTotalPrice();
    }
  },
  //获取默认收货地址
  handleDefaultAddress: function () {
    http.request({
      url: '/lxn/member/address/mobile/v1/find/default',
      data: {},
      success: function (res) {
        this.setData({
          defaultAddress: res,
          storeId: "",
          storeName: "",
        })
       
      }.bind(this),
    })
  },
  //获取默认的自提门店
  handleGetgoods: function () {
    http.request({
      url: "/lxn/member/store/mobile/v1/find",
      data: {
        lat: this.data.latitude,
        lng: this.data.longitude
      }, success: function (res) {
        if (res.result) {
          let defaultAddress = {
            memberAddressArea: res.storeArea,
            memberAddressCity: res.storeCity,
            memberAddressIsDefault: true,
            memberAddressMobile: res.storeTel,
            memberAddressName: res.storeName,
            memberAddressProvince: res.storeProvinces,
            memberAddressDetail: "",
            memberAddressId: "",
          };
          this.setData({
            defaultAddress: defaultAddress,
            storeId: res.storeId,
            storeName: res.storeName
          })
        } else {
          this.setData({
            defaultAddress: "",
            storeId: "",
            storeName: ""
          })
        }

      }.bind(this)
    })
  },
  //选着支付方式
  selectPay: function () {
    
   this.setData({
     selectPay: !this.data.selectPay
   })
   switch (this.data.shopType){
     case "groupon":
       this.handleGroupTotalPrice()
       break;
     case "normal":
       this.handleNormalTotalPrice()
       break;
      default:
       this.handlePreSaleTotalPrice()

   }
   
  },
  //正常商品价格
  handleNormalTotalPrice:function(){
    let productList = this.data.goodsList;
   let  productLists = productList.map(item =>{
      return{
        productId: item.productId ,
        productSkuId:item.productSkuId,
        saleOrderProductQty: item.productQuantity,
        
      }
    })
   
  http.request({
    url:"/lxn/sale/order/mobile/v1/cal/amount",
    data:{
      usePointIs: this.data.usePointIs,
      productList: productLists,
      couponId: this.data.cardsId,
      useIsBalance: this.data.selectPay,
      expressEnable:this.data.isSend,
      saleOrderDistributionStartTime: this.data.sendDay + " " + this.data.sendStartTimes,
      saleOrderDistributionEndTime: this.data.sendDay + " " + this.data.sendEndTime
    }, success: function (res) {
      this.setData({
        scoreInfo: res,
        totalPrice: res.saleOrderPayAmount
      })
    }.bind(this)
  })
  },
  //团购商品价格
  handleGroupTotalPrice:function(){
    http.request({
      url:"/lxn/sale/order/groupon/mobile/v1/cal/groupon/price",
      data:{
        usePointIs: this.data.usePointIs,
        useIsBalance: this.data.selectPay,
        productId: this.data.goodsList[0].productId,
        productSkuId: this.data.goodsList[0].productSkuId,
        saleOrderProductQty: this.data.goodsList[0].productQuantity,
        expressEnable: this.data.isSend,
        saleOrderDistributionStartTime: this.data.sendDay + " " + this.data.sendStartTimes,
        saleOrderDistributionEndTime: this.data.sendDay + " " + this.data.sendEndTime
      },success:function(res){
        if (res.saleOrderPointAmount == "0"){
          this.setData({
            usePointIs:false
          })
        }
        this.setData({
          scoreInfo:res,
          totalPrice: res.saleOrderPayAmount
        })
      }.bind(this)
    })
  },
  //预售商品价格
  handlePreSaleTotalPrice:function(){
    http.request({
      url: "/lxn/sale/order/pre/sale/mobile/v1/cal/pre/price",
      data: {
        usePointIs: this.data.usePointIs,
        useIsBalance: this.data.selectPay,
        productId: this.data.goodsList[0].productId,
        productSkuId: this.data.goodsList[0].productSkuId,
        saleOrderProductQty: this.data.goodsList[0].productQuantity,
        expressEnable: this.data.isSend,
        saleOrderDistributionStartTime: this.data.preSaleDeliveryTime,
        saleOrderDistributionEndTime: this.data.sendDay +"" + " 20:00" 
      }, success: function (res) {
        this.setData({
          scoreInfo: res,
          totalPrice: res.saleOrderPayAmount,
      
        })
      }.bind(this)
    })
  },


  //送货日期选择
  handleSureTime: function (e) {
    let indexD = e.detail.value[0];
    let indexM = e.detail.value[1];
   
    let sendStartTime = this.data.sendTime[1][indexM];
  
    let w = sendStartTime.indexOf("-")
   let sendStartTimes = sendStartTime.slice(0, w);
   let sendEndTime = sendStartTime.slice(w + 1)
    let tommorow = null;
    if (indexD === 0){
      tommorow = this.data.sendTime[0][0];
    }else{
      tommorow = this.data.sendTime[0][1];
    }
    this.setData({
      timeIndex: e.detail.value,
      sendDay: tommorow,
      sendStartTimes: sendStartTimes,
      sendEndTime: sendEndTime
    })
    switch (this.data.shopType) {
      case "groupon":
        this.handleGroupTotalPrice()
        break;
      case "normal":
        this.handleNormalTotalPrice()
        break;
      default:
        this.handlePreSaleTotalPrice();
    }
  },

 
  //授权按钮点击
  handlerChangeButton:function(e){
   
    wx.setStorage({
      key: 'userInfo',
      data:e.detail.userInfo,
    })
    this.setData({
      login: true
    })
  },
  // 创建订单
  handleCreateOrder: function () { 
    if(this.data.orderStatus){
      var thisGoodsList = [];
      if (this.data.goodsList.length === 0) {
        return false;
      } else {
        thisGoodsList = this.data.goodsList.map((item) => {
          return {
            cartProductId: item.cartProductId,
            productId: item.productId,
            productSkuId: item.productSkuId,
            saleOrderProductQty: item.productQuantity,
            preSaleDeliveryTime: item.preSaleDeliveryTime,
            preSaleId: item.preSaleId,
            gouponactivityid: item.gouponactivityId
          }
        })
        this.setData({
          usedGoodsList: thisGoodsList,
        })
      }
      switch (this.data.shopType) {
        case "groupon":
          this.hanleGroupOrder(thisGoodsList)
          break;
        case "normal":
          this.handleNormalOrder(thisGoodsList)
          break;
        default:
          this.handlePreSaleOrder(thisGoodsList)
      }
    }else{
      wx.showToast({
        title: '下单中请等待！',
      })
    }
  },
  //团购商品订单
  hanleGroupOrder: function (thisGoodsList){
    let grouponActiveType = 0;
    if (thisGoodsList[0].gouponactivityid === ""){
      thisGoodsList[0].gouponactivityid = ""
    }else{
      grouponActiveType = 1
    }
    http.request({
      url: '/lxn/sale/order/groupon/mobile/v1/save',
      data: {
        saleOrderPlatform: "wechatMini",
        productList: thisGoodsList,
        grouponActivityId: thisGoodsList[0].gouponactivityid ,
        saleOrderType: "groupon",   //订单类型
        saleOrderTotalQuantity: 1,//商品数量
        saleOrderTotalAmount: this.data.scoreInfo.saleOrderTotalAmount,//总金额
        saleOrderPointAmount: this.data.scoreInfo.saleOrderPointAmount,  //积分优惠金额
        saleOrderExpressAmount: 0, //快递费金
        saleOrderPayAmount: this.data.scoreInfo.saleOrderPayAmount,  //实付金额
        saleOrderPayType: 1,   //支付方式
        couponId:this.data.cardsId,//优惠劵编号 memberCouponId
        saleOrderReceiveType: "", // 收货类型 
        saleOrderReceiveName: this.data.defaultAddress.memberAddressName,//收货姓名
        saleOrderReceiveMobile: this.data.defaultAddress.memberAddressMobile, //收货电话
        saleOrderReceiveProvince: this.data.defaultAddress.memberAddressProvince, //收货省
        saleOrderReceiveCity: this.data.defaultAddress.memberAddressCity,// 收货城市
        saleOrderReceiveArea: this.data.defaultAddress.memberAddressArea,// 收货区
        saleOrderReceiveAddress: this.data.defaultAddress.memberAddressDetail + "," + this.data.defaultAddress.memberAddressPositionDetail, //收货详细地址
        saleOrderIsInvoice: this.data.orderIsInvoice,//是否开发票
        saleOrderInvoiceType: this.data.invoicesInfo.invoiceHeader,  //发票类型个人公司
        saleOrderInvoiceUserName: this.data.invoicesInfo.saleOrderInvoiceUserName, //发票人姓名
        saleOrderInvoiceCompanyName: this.data.invoicesInfo.saleOrderInvoiceCompanyName, //发票公司名称
        saleOrderInvoiceCompanyTax: "", //发票税号
        saleOrderInvoiceContent: "明细", //发票内容
        saleOrderInvoiceEmail: "", //发票email
        merchantStoreId: this.data.storeId, //门店编号
        merchantStoreName: this.data.storeName,//门店名称
        saleOrderDistributionStartTime: this.data.sendDay + " " + this.data.sendStartTimes, //配送开始时间
        saleOrderDistributionEndTime: this.data.sendDay + " " + this.data.sendEndTime, //配送结束时间
        grouponId: "",//团购活动ID
        useIsBalance: this.data.selectPay,//是否使用余额
        usePointIs: this.data.usePointIs, //是否使用积分
        grouponActiveType: grouponActiveType, //拼团类型(0 代表开团， 1代表参团)
      }, success: function (data) {
        if (data.saleOrderPayAmount != 0) {
          this.handlePay(data.saleOrderId, data.saleOrderPayAmount);
        }else{
          wx.showToast({
            title: '支付成功！',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../../my/order/order?index=0',
            })
          },500)
         
        }
      }.bind(this)
    });
  },
  //正常商品订单
  handleNormalOrder: function (thisGoodsList){
    http.request({
      url: '/lxn/sale/order/mobile/v1/save',
      data: {
        saleOrderPlatform: "wechatMini",
        productList: thisGoodsList,
        grouponActivityId: "",
        saleOrderType: "normal",   //订单类型
        saleOrderTotalQuantity: 1,//商品数量

        saleOrderPayType: 1,   //支付方式
        couponId:this.data.cardsId,//优惠劵编号memberCouponId
        saleOrderReceiveType: "", // 收货类型 
        saleOrderReceiveName: this.data.defaultAddress.memberAddressName,//收货姓名
        saleOrderReceiveMobile: this.data.defaultAddress.memberAddressMobile, //收货电话
        saleOrderReceiveProvince: this.data.defaultAddress.memberAddressProvince, //收货省
        saleOrderReceiveCity: this.data.defaultAddress.memberAddressCity,// 收货城市
        saleOrderReceiveArea: this.data.defaultAddress.memberAddressArea,// 收货区
        saleOrderReceiveAddress: this.data.defaultAddress.memberAddressDetail + "," + this.data.defaultAddress.memberAddressPositionDetail, //收货详细地址
        saleOrderIsInvoice: this.data.orderIsInvoice,//是否开发票
        saleOrderInvoiceType: this.data.invoicesInfo.invoiceHeader,  //发票类型个人公司
        saleOrderInvoiceUserName: this.data.invoicesInfo.saleOrderInvoiceUserName, //发票人姓名
        saleOrderInvoiceCompanyName: this.data.invoicesInfo.saleOrderInvoiceCompanyName, //发票公司名称
        saleOrderInvoiceCompanyTax: "", //发票税号
        saleOrderInvoiceContent: "明细", //发票内容
        saleOrderInvoiceEmail: "", //发票email
        useIsBalance: this.data.selectPay,//是否使用余额
        merchantStoreId: this.data.storeId, //门店编号
        merchantStoreName: this.data.storeName,//门店名称
        saleOrderDistributionStartTime: this.data.sendDay + " " + this.data.sendStartTimes, //配送开始时间
        saleOrderDistributionEndTime: this.data.sendDay + " " + this.data.sendEndTime, //配送结束时间
        usePointIs: this.data.usePointIs, //是否使用积分
      }, success: function (data) {
        if (data.saleOrderPayAmount!= 0){
          this.handlePay(data.saleOrderId, data.saleOrderPayAmount);
        } else {
          wx.showToast({
            title: '支付成功！',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../../my/order/order?index=0',
            })
          }, 500)
        }
        
      }.bind(this)
    });
  },
  //预售商品订单
  handlePreSaleOrder: function (thisGoodsList){
    let preSaleDeliveryTime = thisGoodsList[0].preSaleDeliveryTime;
     let newPreSaleDeliveryTime = util.formatTimeReturn(preSaleDeliveryTime / 1000,"Y-M-D h:m");
    http.request({
      url: '/lxn/sale/order/pre/sale/mobile/v1/save',
      data: {
        saleOrderPlatform: "wechatMini",
        productList: thisGoodsList,
        grouponActivityId: "",
        preSaleId: thisGoodsList[0].preSaleId,
        saleOrderType: "groupon",   //订单类型
        saleOrderTotalQuantity: 1,//商品数量
        saleOrderTotalAmount: this.data.scoreInfo.saleOrderTotalAmount,//总金额
        saleOrderPointAmount: this.data.scoreInfo.saleOrderPointAmount,  //积分优惠金额
        saleOrderExpressAmount: 0, //快递费金
        saleOrderPayAmount: this.data.scoreInfo.saleOrderPayAmount,  //实付金额
        saleOrderPayType: 1,   //支付方式
        couponId: this.data.cardsId,//优惠劵编号 memberCouponId
        saleOrderReceiveType: "", // 收货类型 
        saleOrderReceiveName: this.data.defaultAddress.memberAddressName,//收货姓名
        saleOrderReceiveMobile: this.data.defaultAddress.memberAddressMobile, //收货电话
        saleOrderReceiveProvince: this.data.defaultAddress.memberAddressProvince, //收货省
        saleOrderReceiveCity: this.data.defaultAddress.memberAddressCity,// 收货城市
        saleOrderReceiveArea: this.data.defaultAddress.memberAddressArea,// 收货区
        saleOrderReceiveAddress: this.data.defaultAddress.memberAddressDetail + "," + this.data.defaultAddress.memberAddressPositionDetail, //收货详细地址
        saleOrderIsInvoice: this.data.orderIsInvoice,//是否开发票
        saleOrderInvoiceType: this.data.invoicesInfo.invoiceHeader,  //发票类型个人公司
        saleOrderInvoiceUserName: this.data.invoicesInfo.saleOrderInvoiceUserName, //发票人姓名
        saleOrderInvoiceCompanyName: this.data.invoicesInfo.saleOrderInvoiceCompanyName, //发票公司名称
        saleOrderInvoiceCompanyTax: "", //发票税号
        saleOrderInvoiceContent: "明细", //发票内容
        saleOrderInvoiceEmail: "", //发票email
        useIsBalance: this.data.selectPay,//是否使用余额
        merchantStoreId: this.data.storeId, //门店编号
        merchantStoreName: this.data.storeName,//门店名称
        saleOrderDistributionStartTime: this.data.preSaleDeliveryTime, //配送开始时间
        saleOrderDistributionEndTime: this.data.sendDay + "" + " 20:00", //配送结束时间
        grouponId: "",//团购活动ID
        usePointIs: this.data.usePointIs, //是否使用积分
        grouponActiveType: 0, //拼团类型(0 代表开团， 1代表参团)
      }, success: function (data) {
        if (data.saleOrderPayAmount != 0) {
          this.handlePay(data.saleOrderId, data.saleOrderPayAmount);
        } else {
          wx.showToast({
            title: '支付成功！',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../../my/order/order?index=0',
            })
          }, 500)
        }
      }.bind(this)
    });
  },
  //开具发票

  switch1Change:function(){
        this.setData({
          orderIsInvoice: !this.data.orderIsInvoice
        }) 
  },
  //获取优惠劵数目
  handleCardsNum: function () {
    let saleOrderProductList = this.data.goodsList;
    saleOrderProductList = saleOrderProductList.map(item => {
      return {
        productSkuId: item.productSkuId,
        productId: item.productId,
        saleOrderProductQty: item.productQuantity
      }
    })
    http.request({
      url: "/lxn/member/coupon/mobile/v1/list/user/coupon",
      data: {
        saleOrderProductList: saleOrderProductList
      },
      success: function (res) {
        this.setData({
          cardsNum: res.length
        })
      }.bind(this)
    })
  },
  //跳转优惠劵列表
  handleToCards:function(){

    let saleOrderProductList = this.data.goodsList;
    saleOrderProductList = saleOrderProductList.map( item=>{
      return{
        productSkuId: item.productSkuId,
        productId: item.productId,
        saleOrderProductQty: item.productQuantity
      }
    })

    wx.navigateTo({
      url: '../../my/cards/cardsList/cardsList?goodsList=' + JSON.stringify(saleOrderProductList) ,
    })
  },
  //是否使用积分
  handleuserScore:function(e){
    if (e.detail.value) {
      this.setData({
        usePointIs:true,
      })
    }else{
      this.setData({
        usePointIs:false
      })
    }
    switch (this.data.shopType) {
      case "groupon":
        this.handleGroupTotalPrice()
        break;
      case "normal":
        this.handleNormalTotalPrice()
        break;
      default:
        this.handlePreSaleTotalPrice();
    }
  },
  //支付
  handlePay: function (orderId,totalFee){
    http.request({
      url:"/wechat/wechat/pay/mobile/v2/unified/order",
      data: {
        openId: storage.getOpenId(),
        tradeType: "JSAPI",
        outTradeNo: orderId,
        body: "梨小农-订单",
        wechatPayItemType:0,
        totalFee: this.data.totalPrice * 100,
        attach: JSON.stringify({ saleOrderId: orderId})
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
            wx.showToast({
              title: '支付成功！',
            })
            setTimeout(function(){
              wx.redirectTo({
                url: '../../my/order/order?index=0',
              })
            },500)
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '../../my/order/willPayOrder/willPayOrder?saleOrderId=' + orderId + "&orderStatus=" + "0",
            })
          }
        })
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (this.data.shopType === "normal"){
      this.handleNormalTotalPrice()
    }
  },
  handleToInvoice:function(){
    wx.navigateTo({
      url: './invoices/invoices',
    })
  },
  //跳转收货地址选择界面
  changeToAddress:function(){
    if (this.data.selectGetType === 1){
      wx.navigateTo({
        url: '../../my/address/address?select=' + true,
      })
    }else{
      wx.navigateTo({
        url: '../selfGet/selfGet',
      })
    }
   
  },
  //跳转商品详情
  handleToShopDetail: function (e) {
    const goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '../../shopDetail/shopDetail?goodsId=' + goodsId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})