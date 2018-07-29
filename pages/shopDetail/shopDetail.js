// pages/shopDetail/shopDetail.js
const http=require("../../common/http.js")
const util = require("../../common/util.js")
const notification = require("../../common/notification.js")
const WxParse = require("../../wxParse/wxParse.js");
const storage = require("../../common/storage.js");
const constant = require('../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageLoading: "../Img/soFa.png",
    imageHost: constant.imageHost,
    bannerImgWidth:0,
      goods:{},
      tuijian:"1",
      shopsList:[],
      productType:"",
      productCategoryId: "",
      goodsSatisfactionDegree:{},
      evaluationList:[],
      cartsNum:0,
      login:false,
      isWillSell:false,
      isCollect:false,
      cardsList:false,
      cardsContent:[],
      goodsNum:1,
      changeGoodsNumDisplay:false,//sku列表显示
      skuIndex:0,
      groupNumView:false,//团购修改数量
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
    const token = storage.getToken("token");
    if(token){
      this.setData({
        login:true
      })
      this.handleCartsNum();
    }
    this.imgWidth();
   
    this.handleGetGoodsDetail(options);
  },
  onReady: function () {
    this.setData({
      loading:false
    })
  },
  //是否收藏
  // handleIsCollect:function(){
  //   this.setData({
  //     isCollect: !this.data.isCollect
  //   })
  // },
  //获取屏幕宽度
    imgWidth:function(){
      this.setData({
        bannerImgWidth: wx.getSystemInfoSync().windowWidth
      })
    },
  //获取商品详情
  handleGetGoodsDetail:function(e){

    http.request({
      url: '/lxn/product/mobile/v1/find',
      data: {
        "cityId": 310100,
        "productId": e.goodsId,
      }, success: function (res) {
        if(!res.productId){
          wx.showModal({
            title: '该商品已下架，请选择其他商品！',
            success: function (res) {

          
                wx.navigateBack({})
     
            },

          })
        }
        const productContent = res.productContent;
        let  overTime = null;
        setInterval(function () {
          if (res.grouponExpireTime){
           overTime = res.grouponExpireTime - Date.parse(new Date());
         }else{
            overTime = res.preSaleExpireTime - Date.parse(new Date());
         }
          let overTimeInfo = util.timeDifference(overTime).Day;
          this.setData({
            overTime: overTimeInfo
          })
        }.bind(this), 1000)
        WxParse.wxParse('productContent', 'html', productContent, this, 5) 
        this.setData({
          goods: res,
          productType: res.productType,
          productCategoryId: res.productCategoryId,
          productId: e.goodsId
        })

        if (res.productType != "groupon"){
          this.handleGetCards(e.goodsId)
        }else{
          this.handleGrouponList(e.goodsId)
        }
        // this.handleGoodsSatisfactionDegree();
        this.handleEvaluationList();
        this.handleSeeList(e.goodsCategoryId);
      }.bind(this)
    })
  },
  //组团列表，信息
  handleGrouponList: function (productId){
    http.request({
      url:"/lxn/groupon/activity/mobile/v1/list/activing",
      data:{
        productId:productId
      },
      success:function(res){
        let overTime = null;
        let lists = res.list
        if (res.list.length > 0){
          this.setData({
            groupList: lists,
            groupNum: res.total,
            groupListHeight: lists.length * 71
          })
          setInterval(function () {
            for (var i = 0; i < res.list.length; i++) {
              let overTimeInfo = res.list[i].grouponActivityExpireTime
              overTimeInfo = util.timeDifference(overTimeInfo - Date.parse(new Date())).day
              let time = "groupList" + "[" + i + "].grouponActivityExpireTime"
              this.setData({
                [time]: overTimeInfo,
              })
            }
           
          }.bind(this), 1000)
         
        }
      
       
      }.bind(this)
    })
  },
  //领取优惠券
  handleReceiveCards:function(e){
   
    http.request({
      url:'/lxn/memberCoupon/mobile/v1/save',
      data:{
    couponId: e.currentTarget.dataset.couponid
    },
      success:function(res){
        wx.showToast({
          title: '领取成功',
        })
      }.bind(this)
    })
  },
  //获取优惠劵信息
  handleGetCards: function (goodsId){
    http.request({
      url:'/lxn/coupon/mobile/v1/list/product/id',
      data:{
        productId: goodsId
      },success:function(res){
        for(var i = 0;i<res.length;i++){
          res[i].couponValidTime = util.timestampToTime(res[i].couponValidTime);
          res[i].couponExpireTime = util.timestampToTime(res[i].couponExpireTime);
        }
         
        this.setData({
          cardsContent:res
        })
      }.bind(this)
    })
  },
  //跳转商品详情
  handleGoodsDetail:function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../shopDetail/shopDetail?goodsId=' + goodsId + "&goodsCategoryId=" + this.data.goodsCategoryFirstId,
    })

  },
  //获取购物车数量
  handleCartsNum: function () {
    http.request({
      url: "/lxn/cart/mobile/v1/count",
      data: {},
      success: function (res) {
        this.setData({
          cartsNum: res.cartProductCount
        })
      }.bind(this)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //大家都在看
  handleSeeList: function (){
    http.request({
      url: '/lxn/product/mobile/v1/hot/list',
      data: {
        pageIndex: 1,
        pageSize: 5,
        productCategoryId: this.data.productCategoryId
      }, success: function (res){

        this.setData({
          shopsList: res.list
        })
      }.bind(this)
    })
  },
  //24小时热销
  handleQueryHotSellList:function(){
  
    http.request({
      url: '/lxn/product/mobile/v1/recommend/list',
       data: {
        pageIndex: 1,
        pageSize:5,
        productCategoryId: this.data.productCategoryId
      }, success: function (res) {
        this.setData({
          shopsList:res.list
        })

      }.bind(this)
    })
  },
  //加入购物车
  addToCar:function(){
    const token = wx.getStorageSync("token_1.0.0");
    if (!token){
      wx.showModal({
        title: '请您先登录！',
        success:function(res){
          if(res.confirm){
            wx.switchTab({
              url: '../my/my',
            })
          }
        }
      })
        
    }else{
      if (this.data.goods.productSkuList.length > 1){
        this.setData({
          changeGoodsNumDisplay:true
        })
      }else{
        http.request({
          url: '/lxn/cart/mobile/v1/save',
          data: {
            "productId": this.data.goods.productId,
            "productQuantity": this.data.goodsNum,
            "productSkuId": this.data.goods.productSkuList[0].productSkuId,
          }, success: function (res) {
            wx.showToast({
              title: '加入成功',
              success: function () {
                 this.handleCartsNum()
              }.bind(this)
            })

            notification.emit("member-add-cart", {});
          }.bind(this)
        })
      }
      
    }
  
  },
  //sku列表显示
  handleChangeGoodsNumDisplay:function(){

    this.setData({
      changeGoodsNumDisplay: !this.data.changeGoodsNumDisplay
    })
  },
  //sku加入购物车
  skuAddToCar:function(){
    const token = wx.getStorageSync("token_1.0.0");
    if (!token) {
      wx.showModal({
        title: '请您先登录！',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/my',
            })
          }
        }
      })

    } else {
   
        http.request({
          url: '/lxn/cart/mobile/v1/save',
          data: {
            "productId": this.data.goods.productId,
            "productQuantity": this.data.goodsNum,
            "productSkuId": this.data.goods.productSkuList[this.data.skuIndex].productSkuId,
          }, success: function (res) {
            wx.showToast({
              title: '加入成功',
              success: function () {
                this.setData({
                  changeGoodsNumDisplay: !this.data.changeGoodsNumDisplay
                })
                 this.handleCartsNum()
              }.bind(this)
            })

            notification.emit("member-add-cart", {});
          }.bind(this)
        })
      }

   
  },

  //商品好评率接口
  handleGoodsSatisfactionDegree:function(){
    http.request({
      url: '/lixiaonong/goods/evaluation/mobile/v1/goodsSatisfactionDegree',
      data:{
        goodsId: this.data.goods.goodsId
      },success:function(res){
        this.setData({
          goodsSatisfactionDegree:res
        })
      }.bind(this)
    })
  },
  //商品好评列表
  handleEvaluationList:function(){
    http.request({
      url: '/lxn/saleOrderProductComment/mobile/v1/list',
      data:{
        productId: this.data.goods.productId,
        pageIndex:1,
        pageSize:1
      },success:function(res){
        if (res.saleOrderProductCommentList.length > 0){
          res.saleOrderProductCommentList[0].systemCreateTime = util.formatTimeReturn(res.saleOrderProductCommentList[0].systemCreateTime /1000, "Y.M.D h:m")
           res.saleOrderProductCommentList[0].saleOrderProductCommentImageList = JSON.parse(res.saleOrderProductCommentList[0].saleOrderProductCommentImageList)
           console.log(res.saleOrderProductCommentList[0].saleOrderProductCommentImageList)
        }
      
        this.setData({
          evaluationList: res.saleOrderProductCommentList,
          evaluationNum: res.total,
          evaluationRate: res.rate.toFixed(4) * 100
        })
  
      }.bind(this)
    })
  },
  //大家都在看，24小时热销导航切换
  changeTuijian:function(e){
    const index = e.currentTarget.dataset.tuijian;
    this.setData({
      tuijian: index
    })
    if(index == 1){
      this.handleSeeList();
    }else{
      this.handleQueryHotSellList();
    }
  },
  //跳转至评论
  handleToEvaluate:function(){
    wx.navigateTo({
      url: './evaluate/evaluate?productId=' + this.data.goods.productId ,
    })
  },
//跳转至购物车
  changeToShopCars:function(){
    wx.switchTab({
      url: '../shop/shop',
    })
  },
  handleCardsListDisplay:function(){
    this.setData({
      cardsList:false
    })
  },
  //数量减少
  numReduce:function(){
    let goodsNum = this.data.goodsNum;
   
    if (goodsNum <= 1){
      this.setData({
        goodsNum:1
      })
    }else{ 
      goodsNum--
      this.setData({
        goodsNum: goodsNum
      })
    }
  },
  //数量增加
  numAdd:function(){
    let goodsNum = this.data.goodsNum ;
    goodsNum ++
    this.setData({
      goodsNum: goodsNum
    })
    
  },
  handleChangeSkuNone:function(){
    this.setData({
      groupNumView: !this.data.groupNumView,
    })
  },
  //团购数量显示
  handleChangeSku:function(e){
    this.setData({
      groupNumView: !this.data.groupNumView,
      groupTypeNum: e.currentTarget.dataset.grouptypenum,
      gouponactivityId: e.currentTarget.dataset.gouponactivityid
    })
  },
  handleGroupPay:function(){
    switch (this.data.groupTypeNum){
      case "2":
        this.handleToNewOrder()
        break;
      case "1":
        this.handleToNewOrderNormal()
        break;
      default:
        this.handleToNewOrder(this.data.gouponactivityId)
    }
  },
  //跳转订单
  handleToNewOrder: function (gouponactivityid){
    if (gouponactivityid == undefined){
      gouponactivityid = ""
    }
    if(this.data.login){
      if (this.data.productType === "groupon" || this.data.productType === "preSale"){
        let carts = [];
        carts.push(this.data.goods)
        let cartsList = carts.map(item => {
          let useGoodsPrice = ""
          if (item.grouponPrice){
            useGoodsPrice = item.grouponPrice
          }else{
            useGoodsPrice = item.productPrice
          }
          return {
            productSkuId: item.productSkuList[0].productSkuId,
            productId: item.productId,
            productName: item.productName,
            productPrice: useGoodsPrice ,
            productImagePath: item.productImagePath,
            productUnit: item.productUnit,
            productWeight: item.productWeight,
            productQuantity: this.data.goodsNum,
            preSaleDeliveryTime: item.preSaleDeliveryTime,
            preSaleId: item.preSaleId,
            gouponactivityId: gouponactivityid
          }
        })
        wx.navigateTo({
          url: '../shop/newOrder/newOrder?carts=' + JSON.stringify(cartsList) + '&totalPrice=' + this.data.goods.productPrice + "&shopType=" + this.data.productType,
        })
      }
    }else{
      wx.switchTab({
        url: '../my/my',
      })
    }

  },
  //跳转正常订单
  handleToNewOrderNormal:function(){
    if (this.data.login) {
        let carts = [];
        carts.push(this.data.goods)
        let cartsList = carts.map(item => {
          return {
            productSkuId: item.productSkuList[0].productSkuId,
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            productImagePath: item.productImagePath,
            productUnit: item.productUnit,
            productWeight: item.productWeight,
            productQuantity: this.data.goodsNum,  
          }
        })
        wx.navigateTo({
          url: '../shop/newOrder/newOrder?carts=' + JSON.stringify(cartsList) + '&totalPrice=' + this.data.goods.productPrice + "&shopType=" + "normal",
        })
     
    } else {
      wx.switchTab({
        url: '../my/my',
      })
    }
  },
  handleCardsListTrue:function(){
    this.setData({
      cardsList:true
    })
  },
  //参团
  handleGoGroup:function(e){
    wx.showModal({
      title: '确认参加该团么？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          this.handleToNewOrder(e.currentTarget.dataset.gouponactivityid)
        }
    }.bind(this)
    })
  },
  //团购详情
  handleToGroup:function(e){
    wx.navigateTo({
      url: '../groupShopDetail/groupShopDetail?gouponActivityId=' + e.currentTarget.dataset.gouponactivityid,
    })
  },
  //选择sku
  selectSku:function(e){
   
    this.setData({
      skuIndex:e.currentTarget.dataset.index
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    
    }
    return {
      title: this.data.goods.productName,
      path: '/pages/shopDetail/shopDetail?goodsId=' + this.data.productId,
      success: function (res) {
        // 转发成功
      
      },
      fail: function (res) {
      
      }
    }
  }
})