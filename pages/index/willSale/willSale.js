const http = require('../../../common/http.js');
const constant = require('../../../common/constant.js')
const util = require('../../../common/util.js');
const storage = require('../../../common/storage.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    goodsList:[],
    goodsType:"",
    login:false,
    pageIndex:1,
    pageSize:4,
    goodsTotal:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.setData({
      goodsType: options.type
    })
    this.handleBanner()
    switch (options.type){
      case "preSale":
        this.handleGoodsList()
        break;
      case "groupon":
      this.handleGroupList()
      break;
      default:
      this.handleHotGoodsList()
     }
    const token = storage.getToken()
    if (token) {
     this.setData({
       login:true
     })
    }
    // if (options.type == "preSale"){
     
    //   this.handleGoodsList()
    // }else{
    //   this.handleGroupList();
    // }
   
  },
  //调用banner接口
  handleBanner: function () {
    http.request({
      url: '/lxn/product/banner/mobile/v1/list',
      data: {
        productBannerPosition: this.data.goodsType,

      },
      success: function (res) {
        console.log(res)
        this.setData({
          banner: res
        })
      }.bind(this)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //开团
  handleToNewOrder:function(e){
    let index = e.currentTarget.dataset.index
    if (this.data.login) {
      let carts = [];
      carts.push(this.data.goodsList[index])
      let cartsList = carts.map(item => {
        return {
          productSkuId: "",
          productId: item.productId,
          productName: item.productName,
          productPrice: item.grouponPrice,
          productImagePath: item.productImagePath,
          productUnit: item.productUnit,
          productWeight: item.productWeight,
          productQuantity: 1,
          preSaleDeliveryTime: "",
          preSaleId: "",
          gouponactivityId: ""
        }
      })
      wx.navigateTo({
        url: '../../shop/newOrder/newOrder?carts=' + JSON.stringify(cartsList) + "&shopType=" + "groupon",
      })

    } else {
      wx.switchTab({
        url: '../../my/my',
      })
    }
  },
  onReady: function () {
   

  },
  //团购商品列表
  handleGroupList:function(){
    http.request({
      url: '/lxn/groupon/mobile/v1/list',
      data: {
        cityId: 310100,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      success: function (res) {
        let goodsList = this.data.goodsList,
          newGoodsList = goodsList.concat(res.list)
        this.setData({
          goodsList: newGoodsList,
          goodsTotal:res.total
        })
      }.bind(this)
    })
  },
  //预售商品列表
  handleGoodsList:function(){
    http.request({
      url:'/lxn/pre/sale/mobile/v1/list',
      data:{
        cityId: 310100,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      success:function(res){
        let goodsList = this.data.goodsList
         
        for(var i=0;i<res.length;i++){
          res.list[i].preSaleDeliveryTime = util.formatTimeReturn(res.list[i].preSaleDeliveryTime / 1000,"Y.M.D")
        }
        let newGoodsList = goodsList.concat(res.list)
        this.setData({
          goodsList: newGoodsList,
          goodsTotal: res.total
        })
      }.bind(this)
    })
  },
  //猜你商品列表
  
  handleHotGoodsList: function () {
    http.request({
      url: '/lxn/product/mobile/v1/guest/list',
      data: {
        cityId: 310100,
        pageIndex: 1,
        pageSize: 5
      },
      success: function (res) {
        this.setData({
          goodsList: res.list
        })
      }.bind(this)
    })
  },
  //跳转商品详情
  handleToGoodsDetail:function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    if (this.data.goodsType == "preSale"){
      wx.navigateTo({
        url: '../../shopDetail/shopDetail?goodsId=' + goodsId,
      })
    }else{
      wx.navigateTo({
        url: '../../shopDetail/shopDetail?goodsId=' + goodsId,
      })
    }
   
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
    if (this.data.goodsType == "preSale"){
      this.handleGoodsList()
    }else{
      this.handleGroupList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})