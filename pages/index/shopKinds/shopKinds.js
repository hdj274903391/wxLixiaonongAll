// pages/index/shopKinds/shopKinds.js
const http=require('../../../common/http.js');
const constant = require('../../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    current: 0,
    navigationItem: [{ title: "苹果梨" }, { title: "苹果梨" }, { title: "苹果梨" }, { title: "苹果梨" }, { title: "苹果梨" }, { title: "苹果梨" }],
    navigationItemChild: [],
    goodsList: [], 
    productCategoryParentId: "",
    productCategoryId:"",
    pageIndex: 1,
    pageSize: 6,
    goodsTotal: 0,
    loading: true,
    swiperHeight:0,
    goodsImgWidth: 0,//商品图片高度
    showView:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:"true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    if (options.selectNavigation) {
      wx.setNavigationBarTitle({ title: options.selectNavigation })
    }
    
    if (options.productCategoryParentId) {
      this.setData({
        productCategoryParentId: options.productCategoryParentId
      })
      if (options.current) {
        this.setData({
          current: parseInt(options.current)
        })
      }
      this.handleGoodsWidth();
      this.handleLoadSecondCategoryList();
    }
  },
  //获取商品图片宽度
  handleGoodsWidth: function () {
    let goodsImgWidth = wx.getSystemInfoSync().windowWidth * 0.92 * 0.48;
    this.setData({
      goodsImgWidth: goodsImgWidth + 96
    })
    console.log(this.data.goodsImgWidth)
  },
  handleChangeIndex:function(e){
    this.setData({
      goodsList: [],
      pageIndex:1,
      pageSize: 5,
      goodsTotal: 0,
      current: e.detail.current,
      swiperHeight: 0,     
      productCategoryId: this.data.navigationItemChild[e.detail.current].productCategoryId
    })
    this.handleGoodsList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  handleLoadSecondCategoryList: function () {
    //获取导航分类列表
    http.request({
      url: '/lxn/product/category/mobile/v1/list/product/by/category/ids',
      data: {
        productCategoryParentId: this.data.productCategoryParentId,
      }, success: function (data) {
        console.log(data)
        if (data && data.length > 0) {
         let  newData=data.map(item=>{
           return {
             productCategoryName: item.productCategoryName,
             productCategoryId: item.productCategoryId,
           }
         })
          this.setData({
            navigationItemChild: newData,
            productCategoryId: data[this.data.current].productCategoryId
          })
          this.handleGoodsList();
        }
      }.bind(this)
    })
  },
  //获取商品列表
  handleGoodsList:function(){
    http.request({
      url: '/lxn/product/mobile/v1/list/by/category/id',
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        productCategoryId: this.data.productCategoryId
      }, success: function (res) {
        let swiperHeight = 0;
        let inputHeight = 0
        if (this.data.pageIndex === 1){
          inputHeight = 146;
        }
        let height = Math.ceil(res.list.length / 2) * this.data.goodsImgWidth;
        if (res.list.length > 0) {
          if (this.data.pageIndex * this.data.pageSize >= res.total || this.data.pageIndex * this.data.pageSize <= 6) {
            this.setData({
              showView: true
            })
          } else {
            this.setData({
              showView: false
            })
          }
          let goodsList = this.data.goodsList;
          swiperHeight = height + this.data.swiperHeight + inputHeight
           goodsList=  goodsList.concat(res.list);
          this.setData({
            goodsList: goodsList,
            goodsTotal: this.data.goodsTotal + res.total,
            swiperHeight: swiperHeight
          })
         
        }
      }.bind(this)
    })
  },

  //导航栏点击
  changeIndex: function (e) {
    this.setData({
      current: e.currentTarget.dataset.current,
    })

  },
  //商品详情
  changeToShopDetail:function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../../shopDetail/shopDetail?goodsId=' + goodsId + "&goodsCategoryId=" + this.data.goodsCategoryFirstId,
    })
  },
  //搜索跳转
  changeToSearch:function(){
    wx.navigateTo({
      url: '../search/search',
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
    var pageIndex = this.data.pageIndex;
    var pageSize = this.data.pageSize;
    var total = this.data.goodsTotal;
    if (pageIndex * pageSize >= total) {
     return
    }
    pageIndex++;
    this.setData({
      pageIndex: pageIndex
    })
    this.handleGoodsList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  
  }
})