// pages/shop/shop.js
const http= require("../../common/http.js");
const notification = require("../../common/notification.js");
const storage = require("../../common/storage.js");
const constant = require('../../common/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    selectNum: 0,
    totalPrice:0,
    selectAllStatus: false,
    goodsList:[],
    reduce:false,
    // carts: [{ id: 1, title: '美国华盛顿甜脆红地厘蛇果', num: 1, price: 39.9,selected:true},
    //   { id: 2, title: '美国华盛顿甜脆红地厘蛇', num: 1, price: 38.9, selected:true }
    // ],
    carts:[],
    shopsLost: [{ id: 1, title: '美国华盛顿甜脆红地', num: 1, price: 39.9, selected: false }, { id: 2, title: '美国华盛顿甜脆红地厘蛇果', num: 1, price: 39.9, selected: false }],
    buyOtherList:[],
    youLikeList:[],
    pageIndex: 1,
    pageSize: 4,
    goodsTotal:0,
    uselessGoodsList:[],//失效商品列表

  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: "true"
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    this.handleYouLike();
    const token = storage.getToken()
    if (token) {
      this.handleLoadCartList();
    }

    notification.on("member-add-cart", this, function (data) {
      this.handleLoadCartList();
    });

  },
  //调用购物车列表
  handleLoadCartList: function () {
    http.request({
      url: '/lxn/cart/mobile/v1/list',
      data: {},
      success: function (res) {
        let cartAll = res.cartProductList;
          let uselessGoodsList= []
        if (cartAll.length > 0 ){
          cartAll = cartAll.filter(item => item.productIsOnSale === true)
          uselessGoodsList = res.cartProductList.filter(item => item.productIsOnSale === false)
        }

        let selectNum = cartAll.filter(item => item.cartProductIsActive === true).length;
        this.setData({
          carts: cartAll,
          cartsInfo:res,
          selectNum: selectNum,
          uselessGoodsList: uselessGoodsList
        });
      }.bind(this)
    })
  },
  //商品选中
  handleChangeSelected:function(e){
    const index = e.currentTarget.dataset.index;
    http.request({
      url:"/lxn/cart/mobile/v1/active",
      data:{
        cartProductId: e.currentTarget.dataset.cartproductid,
        cartProductIsActive: !this.data.carts[index].cartProductIsActive
      },success:function(res){
          const cartAll = res.cartProductList
          let select = "carts[" + index +"].cartProductIsActive"
          let selectNum = cartAll.filter(item => item.cartProductIsActive === true).length;
          this.setData({
            carts: cartAll,
            cartsInfo: res,
            selectNum: selectNum
          })
      }.bind(this)
    })
  },
  //商品全选
  handleSelectAll:function(){
    let cartIsActive = !this.data.cartsInfo.cartIsActive
    http.request({
      url: "/lxn/cart/mobile/v1/active/all",
      data:{
        cartId: this.data.cartsInfo.cartId,
        cartProductIsActive: cartIsActive
      },success:function(res){
        const cartAll = res.cartProductList
        let selectNum = cartAll.filter(item => item.cartProductIsActive === true).length;
        this.setData({
          
          carts: cartAll,
          cartsInfo: res,
          selectNum: selectNum
        })
      }.bind(this)
    })
  },
  //调用失效订单接口
  //还买了商品接口
  HandleBuyOther: function () {
    http.request({
      url: '/lixiaonong/goods/recommend/mobile/v1/list',
      data: {
        "goodsCategoryId": "",
        "pageIndex": 1,
        "pageSize": 5,
      }, success: function (res) {
        this.setData({
          buyOtherList: res
        })
      }.bind(this)
    })
  },
  //你喜欢接口
  handleYouLike: function () {
    http.request({
      url: '/lxn/product/mobile/v1/guest/list',
      data: {
        "goodsCategoryId": "",
        "pageIndex": this.data.pageIndex,
        "pageSize": this.data.pageSize,
      }, success: function (res) {
        let youLikeList = this.data.youLikeList;
        youLikeList = youLikeList.concat(res.list)
        this.setData({
          youLikeList: youLikeList,
          goodsTotal:res.total
        });
      
      }.bind(this)
    })
  },

  //手动输入购物车数量
  handLeChangeInput:function(e){
    const index = e.currentTarget.dataset.index;
    const goodsNum = parseInt(e.detail.value);
    let carts = this.data.carts;
    const cartsItem = carts[index];
    if (!goodsNum){
      carts[index].goodsQuantity = 1;
      goodsNum == 1;
      this.setData({
        carts: carts
      })
    }else{
      cartsItem.goodsQuantity = goodsNum;
      this.setData({
        carts: carts
      })
    }
    http.request({
      url: '/lxn/cart/mobile/v1/update',
      data: {
        "cartProductId": cartsItem.cartProductId,
        "productQuantity": goodsNum,//商品数量
      }, success: function (res) {
        if (cartsItem.productQuantity === 0) {
          carts.splice(index, 1);
        } else {
          cartsItem.systemVersion++;
          carts[index] = cartsItem;
        }
        this.setData({
          carts: carts,
        });
      
      }.bind(this)
    })
  },
  //数量减少
  numReduce:function(e){
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const cartsItem = carts[index];
    if (cartsItem.productQuantity > 1) {
      cartsItem.productQuantity--;
      http.request({
        url: '/lxn/cart/mobile/v1/update',
        data: {
          "cartProductId": cartsItem.cartProductId,
          "productQuantity": cartsItem.productQuantity,//商品数量
        }, success: function (res) {
          const cartAll = res.cartProductList.filter(item => item.productIsOnSale === true)
          let selectNum = cartAll.filter(item => item.cartProductIsActive === true).length;
          let uselessGoodsList = res.cartProductList.filter(item => item.productIsOnSale === false)
          this.setData({
            carts: cartAll,
            cartsInfo: res,
            selectNum: selectNum,
            uselessGoodsList: uselessGoodsList
          });
        }.bind(this)
      })
    }else{
      wx.showModal({
        title: '确认删除该商品？',
        success: function (res) {
          if (res.confirm) {
            cartsItem.productQuantity--;
            http.request({
              url: '/lxn/cart/mobile/v1/update',
              data: {
                "cartProductId": cartsItem.cartProductId,
                "productQuantity": cartsItem.productQuantity,//商品数量
              }, success: function (res){
                console.log(res)
                const cartAll = res.cartProductList.filter(item => item.productIsOnSale === true)
                let uselessGoodsList = res.cartProductList.filter(item => item.productIsOnSale === false);
          
                let selectNum = cartAll.filter(item => item.cartProductIsActive === true).length;
                this.setData({
                  carts: cartAll,
                  cartsInfo: res,
                  selectNum: selectNum,
                  uselessGoodsList: uselessGoodsList
                });
                console.log(this.data.uselessGoodsList)
              }.bind(this)
             })
           
          }
        
        }.bind(this)
      }
      )
    }
  },
  //数量增加
  numAdd:function(e){
    const index= e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const cartsItem = carts[index];
    cartsItem.productQuantity++;
    http.request({
      url: '/lxn/cart/mobile/v1/update',
      data: {
        "cartProductId": cartsItem.cartProductId,
        // "goodsUnit": cartsItem.goodsUnit,
        // "systemVersion": cartsItem.systemVersion,
        "productQuantity": cartsItem.productQuantity,//商品数量
      }, success: function (res) {
        const cartAll = res.cartProductList.filter(item => item.productIsOnSale === true)
        let uselessGoodsList = res.cartProductList.filter(item => item.productIsOnSale === false)
        let selectNum = cartAll.filter(item => item.cartProductIsActive === true).length;
        this.setData({
          carts: cartAll,
          cartsInfo: res,
          selectNum: selectNum,
          uselessGoodsList: uselessGoodsList
        }); 
       
      }.bind(this)
    })
  },
  //商品选中
  selectList:function(e){
    let selectNum = this.data.selectNum;  
    const index=e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected =!selected;
    if (carts[index].selected){
      selectNum ++;
    }else{
      selectNum --;
    }
    this.setData({
      carts: carts,
      selectNum: selectNum
    });

    carts = carts.filter(cart => cart.selected);
    if (carts.length > 0) {
      this.setData({
        selectAllStatus:true
      })
    }
    this.getTotalPrice();
  },
  //失效商品删除
  handleDeleateShop:function(){
    let uselessGoodsList = this.data.uselessGoodsList;
      http.request({
        url: "/lxn/cart/mobile/v1/clear/is/not/open",
        data: {},
        success: function (res) {
          this.handleLoadCartList()
        }.bind(this)
      })
  },
  //总价计算
  getTotalPrice:function(){
    let carts = this.data.carts;  
    let total = 0;  
    for (let i = 0; i < carts.length; i++){  
      if (carts[i].selected) {             
        total += carts[i].goodsQuantity * carts[i].goodsPrice;  
      }
    }
    this.setData({                               
      carts: carts,
      totalPrice: total.toFixed(2),
    });
  },
  //结算跳转
  handleToNewOrder: function() {
    const token = storage.getToken();
    if (token != ''){
      var carts = this.data.carts;
      carts = carts.filter(cart => cart.cartProductIsActive);
      if (carts.length === 0) {
        wx.showToast({
          title: '请勾选结算商品',
        })
      } else {
        carts = carts.map(item=>{
          return {
            cartProductId: item.cartProductId,
            productId: item.productId,
            productQuantity: item.productQuantity,
            productName: item.productName,
            productPrice: item.productSkuPrice,
            productImagePath: item.productImagePath,
            productUnit: item.productUnit,
            productWeight: item.productWeight,
            productSkuId: item.productSkuId
          }
        })
        // if (carts.length > 0) {
        //  this.handleDefaultAddress(carts)
         
        // }


        wx.navigateTo({
          url: './newOrder/newOrder?carts=' + JSON.stringify(carts) + "&shopType=" + "normal",
         })
      }
      
    } else {
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
    }
 
    
  },
  //跳转商品详情
  handleToGoodsDetail: function (e) {
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../shopDetail/shopDetail?goodsId=' + goodsId,
    })
  },
  //商品全选
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    let selectNumAll=this.data.selectNum;
    if (selectAllStatus){
      selectNumAll = carts.length
    }else{
      selectNumAll=0
    }

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;            // 改变所有商品状态
    }
   
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts,
      selectNum: selectNumAll
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  //跳转主页
  changeToindex:function(){
    wx.switchTab({
      url: '/pages/index/index',
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
    this.handleYouLike();
  },
})