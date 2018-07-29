const http = require('../../../common/http.js');
const constant = require('../../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    navigationItem: ["苹果", "苹果", "苹果", "苹果", "苹果", "苹果", "苹果"],
    current:0,
    bannerList:[],
    navigationList: [],
    goodsList: [],
    navigationListBanner: [],
    goodsListBanner: [],
    subjectId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleSubjectInfoDeatil(options.subjectId)
  },
  //点击导航
  handleChangeNavigationItem:function(e){
    this.setData({
      current: e.currentTarget.dataset.current
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },  
  //获取专题内容详情
  handleSubjectInfoDeatil: function (subjectId){
  
    http.request({
      url: "/lxn/subject/mobile/v1/list/subject/info",
      data: {
        subjectId: subjectId,
        cityName: "上海市"
      }, success: function (res) {
        // 分类商品，筛选
        let navigationList = res.subjectCategoryList.map((item)=>{
          return item.subjectCategoryName
        })
        var newNavigationList = [];
        for (var i = 0; i < navigationList.length; i++) {
          if (newNavigationList.indexOf(navigationList[i]) == -1) {
            newNavigationList.push(navigationList[i]);
          }
        }
        var goodsListNavigation = [];
        for (var i = 0; i < newNavigationList.length;i++  ){
          let goodsListItem = res.subjectCategoryList.filter(item => item.subjectCategoryName == newNavigationList[i]);
          goodsListNavigation.push(goodsListItem)
        }
        // 带banner商品分类，筛选
        let navigationListBanner = res.subjectCustomCategoryList.map((item) => {
          return {
            bannerPath: item.subjectCategoryImagePath,
            bannerName: item.subjectCategoryName
          }
        })
        var hash = {};
        navigationListBanner = navigationListBanner.reduce(function (item, next) {
          hash[next.bannerName] ? '' : hash[next.bannerName] = true && item.push(next);
          return item
        }, [])
        var goodsListNavigationBanner= [];
        for (var i = 0; i < navigationListBanner.length; i++) {
          let goodsListItemBanner = res.subjectCustomCategoryList.filter(item => item.subjectCategoryName == navigationListBanner[i].bannerName);
          goodsListNavigationBanner.push(goodsListItemBanner)
        }
        this.setData({
          bannerImg: res.subjectTopImagePath,
          bannerBottomList: res.subjectTopProductList,
          navigationList: newNavigationList,
          goodsList: goodsListNavigation,
          navigationListBanner: navigationListBanner,
          goodsListBanner: goodsListNavigationBanner,
        })
      }.bind(this)
    })
  },
  //跳转商品详情
  handleToShopDetail: function (e) {
    var productId= e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../../shopDetail/shopDetail?goodsId=' + productId,
    })
  },
  //获取单条专题信息
  hanleSubjectInfo:function(){
    http.request({
      url: "/lxn/subject/mobile/v1/find",
      data: {
        subjectId: "1008936088343150593",
        cityName: "上海市"
      }, success: function (res) {
      
      }.bind(this)
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