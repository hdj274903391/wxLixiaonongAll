//index.js
//获取应用实例
const http = require('../../common/http.js');
const constant = require('../../common/constant.js');
const storage = require('../../common/storage.js');
 
const QQMapWx = require('../../qqMapSdk/qqmap-wx-jssdk.min.js');
const app = getApp()
Page({
  data: {
    isIpx: app.globalData.isIpx,
    locationAddress:"",//当前地址
    imageHost: constant.imageHost,
    navigation:false,
    current:0,
    shopKinds:false,
    selectNavigation:"",
    navigationItem: [],
    navigationItemChild: [],
    productCategoryParentId:"",
    goodsId:"",
    promise:true,
    banner:[],
    goodsList:{},
    goodsType:"NEXTDAY",
    text:[1,2,3],
    tuiJianNavigationList: [{ title: "预售", navigateTo: 'handleToWillSale', className: 'icon-times' }, { title: "团购", navigateTo: 'handleToGroup', className: 'icon-groups', }, { title: "充值", navigateTo: "handleToMoney", className: 'icon-Recharge',}, { title: "邀请好友", navigateTo: "onShareAppMessage", className: 'icon-shareIndex',otherType: "share" }, { title: "企业合作", className: 'icon-team', navigateTo: "handleToteam"}],
    pageIndex:1,
    swiperHeight:0,//swiper高度,
    login:false,
    goodsImgWidthView:0,//商品模块高度,
    goodsImgHeight: 0,//商品图片高度,
    bannerHeight:0,//banner高度
    loading:false,
  },

  onLoad:function(){
    if (!this.data.loading){
      wx.showToast({
        title: '加载中',
        icon:"loading"
      })
    }
    if (storage.getToken()) {
      this.setData({
        login: true
      })
    } else {
      this.setData({
        login: false
      })
    }
    this.handleGetLocation()
    this.handleGoodsWidth();
  },
  //获取商品图片宽度
  handleGoodsWidth: function () {
    let idth = wx.getSystemInfoSync().windowWidth;
    let goodsImgWidth = wx.getSystemInfoSync().windowWidth * 0.92 * 0.48 ;//商品图片高度
    let bannerHeight = wx.getSystemInfoSync().windowWidth * 0.534 + 35;
    let navigaionBannerHeight = wx.getSystemInfoSync().windowWidth * 0.27
    let oneTwoHeight = wx.getSystemInfoSync().windowWidth * 0.64 + 135 + navigaionBannerHeight
    this.setData({
      goodsImgWidthView: (goodsImgWidth + 69 +  95) * 2 + navigaionBannerHeight,
      goodsImgHeight: goodsImgWidth + 69,
      imgHeight: goodsImgWidth,
      bannerHeight: bannerHeight  ,
      oneTwoHeight: oneTwoHeight,
      navigaionBannerHeight: navigaionBannerHeight
    })
    this.handleLoadFirstCategoryList();
  },
  //获取当前坐标
  handleGetLocation: function () {
    var demo = new QQMapWx({
      key: 'KSRBZ-465WP-4OSDD-VL75D-GGTG7-P7FZD' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        storage.setLatitude(res.latitude)
        storage.setLongitude(res.longitude)
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            this.setData({
              locationAddress: res.result.address
            })
            storage.setProvice(res.result.address_component.province);
           
          
            // this.handleBanner();
            // this.handleLoadHotList();
          }.bind(this)
          
        });
      }.bind(this),
    })


  },
  // 查询一级导航
 handleLoadFirstCategoryList: function () {
    http.request({
      url: '/lxn/product/category/mobile/v1/list',
      data: {},
      success: function (data) {
        this.setData({
          goodsCategoryParentId: data[0].productCategoryId,
          navigationItem: data
        });
        this.handleBanner();
      }.bind(this)
    });
    
  },
  //查询二级导航
  handleLoadSecondCategoryList:function(){
   
    http.request({
      url: '/lxn/product/category/mobile/v1/list/product/by/category/ids',
      data: {
        productCategoryParentId: this.data.goodsCategoryParentId,
      },
      success: function (data) {
        let goodsListHeight = 0;
        let datas=[];
        let dataes=[];
        let height=Math.ceil(data.length/5)*64;
        //console.log(height)
        let haveContentLength = data.filter(item => item.productList.length > 0)
        //console.log(data)
        goodsListHeight = this.data.goodsImgWidthView * data.length + height;
   
        if(data.length>=10){
          datas=data.slice(0,9);
          dataes = {
            productCategoryId:"1016510553679847426",
            productCategoryImagePath:"/upload/993335466657415169/b2aa9999170e71f489e1d2a05b11623f/original/1017667979250507778.png",
            productCategoryName :"更多",
            productCategoryParentId:"1006802189674061825"
          }
          data.splice(9,1,dataes);
          console.log(data)
          datas = data.slice(0,10);
        }else{
          datas=data
        }
        //console.log(datas)
        this.setData({
          navigationItemChild: datas,
          swiperHeight: goodsListHeight + this.data.bannerHeight
          //swiperHeight: goodsListHeight 
        });
      }.bind(this)
    });
  },
  //跳转预售
  handleToWillSale:function(){
    wx.navigateTo({
      url: './willSale/willSale?type=' + "preSale" + '&name=' + "商品预售",
    })
  },
  //跳转团购
  handleToGroup:function(){
    wx.navigateTo({
      url: './willSale/willSale?type=' + "groupon" + '&name=' + "商品团购"  ,
    })
  },
  //跳转当季新品
  handleToNewGoods:function(){
    wx.navigateTo({
      url: './willSale/willSale?type=' + "newGoods" + '&name=' + "当季新品",
    })
  },

  //获取商品列表接口
  handleGoodList: function (){
    http.request({
      url: '/lxn/product/mobile/v1/list/by/category/id',
      data: {
        productCategoryParentId: this.data.productCategoryParentId,
        pageIndex: this.data.pageIndex,
        pageSize: 4,
      },
      success: function (data) {
       
          const goodsList = this.data.goodsList;
          goodsList[productCategoryId] = data.list
          this.setData({
            goodsList: goodsList
          })
        
      }.bind(this)
    });
  },
  //调用banner接口
  handleBanner:function(){
    http.request({
      url: '/lxn/subject/mobile/v1/list',
      data: {
        subjectPosition:"index_banner",
    
      },
      success:function(res){
        this.setData({
          banner:res
        })
        this.handleBannerIndex();
      }.bind(this)
    })
  },
  //1+2banner接口
  handleBannerIndex:function(){
    http.request({
      url: '/lxn/subject/mobile/v1/list',
      data: {
        subjectPosition: "1+2",
      },
      success: function (res) {
        this.setData({
          bannerOne: res
        })
        this.handleLoadHotList();
      }.bind(this)
    })
  },
  handleChangeNavigationType:function(){
    this.setData({
      navigation: ! this.data.navigation
    })
  },
  //导航选中
  handleChangeNavigationItem:function(index){
    let current1 = 0; 
    if (index.currentTarget){
      current1 = index.currentTarget.dataset.current;
    } else{
      current1 = index
    }
    this.setData({
      current: current1
    })
  },
  //周期优选
  handleFineList:function(){
    http.request({
      url: '/lixiaonong/goods/cycle/mobile/v1/list',
      data: {
        pageIndex: '1',
        pageSize: '5'

      },
      success: function (data) {
        // var goodsList = data.list;
        var goodsList = [];
        goodsList.push(data.list)
        this.setData({
          goodsList: goodsList
        });
      }.bind(this)
    })
  },
  //推荐
  handleLoadHotList:function(){
    http.request({
      url: '/lxn/subjectCustomCategory/mobile/v1/list',
      data: {
        "subjectId": "1014434389965922306",
        "cityName": "上海市"
      }, success: function (data) {
        let listHeight =( Math.ceil(data[0].subjectCategoryProductList.length / 2) * this.data.goodsImgHeight + 124)*data.length;
        //console.log(data);
        this.setData({
          goodsContentList:data,
          swiperHeight: this.data.oneTwoHeight + this.data.bannerHeight + listHeight,
        });
      }.bind(this)
    })
  },
  //二级分类跳转
  handleToShopKinds:function(e){
    let currentIndex = 0;
    if (e.currentTarget.dataset.index){
      currentIndex = e.currentTarget.dataset.index
    }
    console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index==9){
      http.request({
        url: '/lxn/product/category/mobile/v1/list/product/by/category/ids',
        data: {
          productCategoryParentId: this.data.goodsCategoryParentId,
        },
        success: function (data) {
          this.setData({
            navigationItemChild: data,
          });
        }.bind(this)
      });
      // wx.navigateTo({
      //   url: './shopKinds/shopKinds?productCategoryParentId=' + this.data.goodsCategoryParentId + '&selectNavigation=' + this.data.selectNavigation + '&current=' + 0,
      // })
    }else{
      wx.navigateTo({
        url: './shopKinds/shopKinds?productCategoryParentId=' + this.data.goodsCategoryParentId + '&selectNavigation=' + this.data.selectNavigation + '&current=' + currentIndex,
      })
    }
  },
  //跳转定位
  handleToOrigin:function(){
    wx.showToast({
      title: '目前仅支持上海区域',
      icon:"none"
    })
    // wx.navigateTo({
    //   url: './origin/origin',
    // })
  },
  //跳转搜索
  handleToSearch:function(){
    wx.navigateTo({
      url: './search/search',
    })
  },
  //跳转专题
  handleToTopic: function (e) {
    console.log(e)
    let subjectId = e.currentTarget.dataset.subjectid;
    console.log(subjectId)
    wx.navigateTo({
      url: './topic/topic?subjectId=' + subjectId ,
    })
  },
  //跳转商品详情
  handleToShopDetail:function(e){
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../shopDetail/shopDetail?goodsId=' + goodsId,
    })
  },
  //跳转充值
  handleToMoney: function () {
    if(this.data.login){
      wx.navigateTo({
        url: '../my/wallet/money/money',
      })
    }else{
      wx.showModal({
        title: '请先登录!',
        success: function (res) {
          if (res.confirm) {
           wx.switchTab({
             url: '../my/my',
           })
          }
        }
      })
    }
   
  },
  //跳转企业合作
  handleToteam:function(){
    wx.navigateTo({
      url: './cooperation/cooperation',
    })
  },
 
  //整体页面swiper事件
  handleChangeCurrent:function(e){
    wx.showLoading({
      title: '加载中',
      mask: "true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    const that = this;
    let current1 = 0;
    if (e.detail) {
      current1 = e.detail.current;
    } else {
      current1 = e
    }
    this.setData({
      goodsCategoryParentId: this.data.navigationItem[current1].productCategoryId,
      selectNavigation: this.data.navigationItem[current1].productCategoryName,
      current: current1,
      goodsList: {},
      navigation: false
    })
    if (current1 >= 2){
      //显示二级导航
      that.setData({
        shopKinds: true,
        swiperHeight: 310
      })
      that.handleLoadSecondCategoryList()
    } else {
      that.setData({
        shopKinds: false,
      })
      if (this.data.current == "0") {
        //今日推荐接口
        this.handleLoadHotList();
      } else {
        
        this.handleGroupBanner();
      }
    }   
  },
  //调用banner接口
  handleGroupBanner: function () {
    http.request({
      url: '/lxn/product/banner/mobile/v1/list',
      data: {
        productBannerPosition: "groupon",

      },
      success: function (res) {
        this.setData({
          groupBanner: res
        })
        this.handleGroupList();
      }.bind(this)
    })
  },
  //团购商品列表
  handleGroupList: function () {
    http.request({
      url: '/lxn/groupon/mobile/v1/list',
      data: {
        cityId: 310100,
        pageIndex: 1,
        pageSize: 5
      },
      success: function (res) {
        
        let swiperHeight = Math.ceil(res.list.length / 2) * this.data.goodsImgHeight ;
        this.setData({
          groupGoodsList: res.list,
           swiperHeight: swiperHeight + this.data.bannerHeight + this.data.navigaionBannerHeight + 160
          
        })
      }.bind(this)
    })
  },
  //加入购物车
  addToCar: function (e) {
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
          "productId": e.currentTarget.dataset.productid,
          "productQuantity": 1,
          "productSkuId": e.currentTarget.dataset.productckuid,
        }, success: function (res) {
          wx.showToast({
            title: '加入成功',
            success: function () {
              // this.handleCartsNum()
            }.bind(this)
          })

        
        }.bind(this)
      })
    }

  },
  onReady: function () {
    this.setData({
      loading:true
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '犁小农',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {}
})
