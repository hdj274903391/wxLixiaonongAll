// pages/index/search/searchResult/searchResult.js
const http = require('../../../../common/http.js');
const notification = require('../../../../common/notification.js');
const storage = require('../../../../common/storage.js');
const constant = require('../../../../common/constant.js');
Page({
  data: {
    imageHost: constant.imageHost,
    cartsNum:0,
    inputContent: "",
    inputContent1: false,
    shopsList: [],
    goodsImgWidth:"",
    goodsType: "",
    SearchPromptlist:[]
  },
  onLoad: function (options) {
    notification.on("member-add-cart",this,function(data){
      this.handleCartsNum()
    })
    wx.showLoading({
      title: '加载中',
      mask: "true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    this.handleCartsNum();
    this.setData({
      inputContent: options.inputContent
    })
    this.handleSubmitInput();
  },
  //获取商品图片宽度
  handleGoodsWidth: function () {
    let goodsImgWidth = wx.getSystemInfoSync().windowWidth * 0.92 * 0.48;
    this.setData({
      goodsImgWidth: goodsImgWidth
    })
  },
  HandleInputContent:function(e){
    if (e.detail.value != ""){
      this.setData({
        inputContent: e.detail.value,
        inputContent1: true
      })
      this.handleSearchPromptlist();
    }else{
      this.setData({
        inputContent: e.detail.value,
        inputContent1: false
      })
    }
  
  },
  //点击搜索提示改变输入框内容
  handleChengeToInputContent: function (e) {
    this.setData({
      inputContent: e.currentTarget.dataset.content,
      inputContent1: false
    })
    this.handleSubmitInput();
  },
  //搜索提示列表
  handleSearchPromptlist: function () {
    http.request({
      url: "/lxn/product/mobile/v1/search/prompt/list",
      data: {
        "productName": this.data.inputContent,
        "pageIndex": 1,
        "pageSize": 10,
      },
      success: function (res) {
        var SearchPromptlist = res.list.map(list => {
          return {
            goodsName: list.productName
          }
        })
        this.setData({
          SearchPromptlist: SearchPromptlist,
          inputContent1:true
        })
      }.bind(this)
    })
  },
  //搜索确认
  handleSubmitInput: function () {
    if (this.data.inputContent) {
      http.request({
        url: '/lxn/product/mobile/v1/search/list',
        data: {
          productName: this.data.inputContent,
          pageIndex: 1,
          pageSize: 5
        }, 
        success: function (res) {
          const shopsList = res.list;
          if (res.list.length < 1) {
            wx.showToast({
              title: '对不起，暂无该商品', 
              icon: 'none'
            })
          } else {
            this.handleGoodsWidth();
            
            this.setData({
              shopsList: shopsList,
              inputContent1:false
            })
           
          }
        }.bind(this)
      })
    } else {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none'
      })
    }

    
  },
  //返回上一级
  ClearInput:function(){
  wx.navigateBack({})
  },
  //加入购物车
  handleAddToCarts: function (e) {
    const token = storage.getToken();
    if (token == '') {
      wx.showModal({
        title: '请您先登录！',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../../my/my',
            })
          }
        }
      })
    } else {
      http.request({
        url: '/lxn/cart/mobile/v1/save',
        data: {
          "cartProductId": e.currentTarget.dataset.goodsid,
          "goodsQuantity": 1,
        }, success: function (res) {
          wx.showToast({
            title: '加入成功',
          })
          this.handleCartsNum();
          notification.emit("member-add-cart", {});
        }.bind(this)
      })
    }

  },
  //获取购物车数量
  handleCartsNum:function(){
    http.request({
      url:"/lxn/cart/mobile/v1/count",
      data:{},
      success:function(res){
       this.setData({
         cartsNum: res.cartProductCount
       })
      }.bind(this)
    })
  },
  handleTocarts:function(){
    wx.switchTab({
      url: '/pages/shop/shop',
    })
  },
  handleClearInput: function () {
    this.setData({
      inputContent: "",
      inputContent1:false
    })
  },
  //跳转商品详情
  handleToGoodsDetail: function (e) {
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../../../shopDetail/shopDetail?goodsType=' + "NEXTDAY" + "&goodsId=" + goodsId + "&goodsCategoryId=" + this.data.goodsCategoryParentId,
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})