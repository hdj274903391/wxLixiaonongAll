const http = require("../../../../common/http.js");
const util = require("../../../../common/util.js");
const constant = require("../../../../common/constant.js");
const storage = require("../../../../common/storage.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo:{},
    share:true,
    imageHost: constant.imageHost,
    groupNumView:false,
    goodsNum:1,
    pageIndex:1,
    pageSize:4,
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){ 
    const token = storage.getToken("token");
    if (token) {
      this.setData({
        login: true
      })
     
    }
 
    if (options.share == "false"){
      this.setData({
        share: false
      })
    }else{
      this.setData({
        share: true
      })
    }
      
  
    this.setData({
      saleOrderId: options.saleOrderId
    })
    this.handleGroupList()
    this.handleGroupDetail()
  },
  //商品数量
  handleChangeSkuNone:function(){
    this.setData({
      groupNumView: !this.data.groupNumView
    })
  },
  //拼团详情
  handleGroupDetail:function(){
    http.request({
      url:"/lxn/sale/order/groupon/mobile/v1/find/groupon/activity/detail",
      data:{
        saleOrderId: this.data.saleOrderId
      },success:function(res){
        let overTime = null;
        setInterval(function () {
          overTime = res.grouponActivityExpireTime - Date.parse(new Date());
          let overTimeInfo = util.timeDifference(overTime).Day;
          this.setData({
            overTime: overTimeInfo
          })
        }.bind(this), 1000)
        this.setData({
          groupInfo:res
        })
      }.bind(this)
    })
  },
  //数量减少
  numReduce: function () {
    let goodsNum = this.data.goodsNum;

    if (goodsNum <= 1) {
      this.setData({
        goodsNum: 1
      })
    } else {
      goodsNum--
      this.setData({
        goodsNum: goodsNum
      })
    }
  },
  //数量增加
  numAdd: function () {
    let goodsNum = this.data.goodsNum;
    goodsNum++
    this.setData({
      goodsNum: goodsNum
    })

  },
  //立马参团
  handleToGroup:function(e){
    if (this.data.login) {
        let carts = [];
        let goods = {};
        goods.productSkuId = this.data.groupInfo.productSkuId
        goods.productId = this.data.groupInfo.productId
        goods.productName = this.data.groupInfo.productName
        goods.productPrice = this.data.groupInfo.grouponActivityPrice
        goods.productImagePath = this.data.groupInfo.productImagePath
        goods.productUnit = this.data.groupInfo.productUnit
        goods.productWeight = this.data.groupInfo.productWeight
        goods.productQuantity = this.data.goodsNum
        goods.preSaleDeliveryTime = ""
        goods.preSaleId = ""
        goods.gouponactivityId = this.data.groupInfo.grouponActivityId;
        carts.push(goods)
        wx.navigateTo({
          url: '../../../shop/newOrder/newOrder?carts=' + JSON.stringify(carts) + "&shopType=" + "groupon",
        })

    } else {
      wx.switchTab({
        url: '../my/my',
      })
    }
  },
  //团购商品列表
  handleGroupList: function () {
    http.request({
      url: '/lxn/groupon/mobile/v1/list',
      data: {
        cityId: 310100,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      success: function (res) {
        console.log(res)
        let goodsList = this.data.goodsList;
       goodsList = goodsList.concat(res.list)
        this.setData({
          goodsList: goodsList,
          goodsTotal:res.total
        })
      }.bind(this)
    })
  },
  //跳转商品详情
  handleToGoodsDetail:function(e){
    var productId = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../../../shopDetail/shopDetail?goodsId=' + productId,
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
    this.handleGroupList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.groupInfo.productName,
      path: '/pages/my/order/groupShopDetail/groupShopDetail?saleOrderId=' + this.data.saleOrderId +"&share=" + true,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
      }
    }
  }
})