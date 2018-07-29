
const http = require('../../common/http.js');
const wechat = require('../../common/wechat.js');
const storage = require('../../common/storage.js');
const constant = require('../../common/constant.js');
const notification = require('../../common/notification.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    memberAvatarPath: "",
    memberNickName: "",
    login: false, //未登录
    banner: [],
    orderNum:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    notification.on("member-info-storage",this,function (data) {
      this.handleuserInfoStorage()
    })
    this.handleuserInfoStorage()
    
  },
  //获取用户缓存信息
  handleuserInfoStorage:function(){
    const token = storage.getToken();
    if (token) {
      this.setData({
        login: true,
        memberAvatarPath: storage.getMemberAvatarPath(),
        memberNickName: storage.getMemberNickName()
      })
      this.handleOrderNum();
    }else{
      this.setData({
        login: false,
        memberAvatarPath: "",
        memberNickName: ""
      })
    }
    this.handleMyBanner();
  },
  //允许授权按钮
  handlerAllowAuth: function (userinfo){
    if (userinfo.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success: (res) => {
          var code = res.code;
          if (code) {
            http.request({
              url: '/wechat/wechat/mini/mobile/v1/auth',
              data: {
                wechatMiniAppId: constant.wechatAppId,
                jsCode: code,
                encryptedData: userinfo.detail.encryptedData,
                iv: userinfo.detail.iv,
                version: constant.version
              }, success: function (data) {
                //用户注册登录
                if (data.openId) {
                  http.request({
                    url: '/lxn/member/mobile/v1/wechat/login',
                    data:{
                      "wechatUnionId": "",
                      "memberAccount": "",
                      "memberPassword": "",
                      "memberMobile": "",
                      "memberEmail": "",
                      "memberArea": "",
                      "nickname": data.nickName ? data.nickName : '',
                      "openId": data.openId,
                      "avatar": data.avatarUrl ? data.avatarUrl : '',
                      "memberAvatarId": "",
                      "memberGender": "",
                      "memberBirthday": ""
                    },
                    success: function (data) {
                      storage.setToken(data.token);
                      storage.setOpenId(data.openId);
                      storage.setMemberNickName(data.memberNickName);
                      storage.setMemberAvatarPath(data.memberAvatarPath);
                      this.setData({
                        memberNickName: data.memberNickName,
                        memberAvatarPath: data.memberAvatarPath,
                        login: true
                      })
                   
                    }.bind(this),
                    fail: function () {
                    
                    }
                  });
                }
              }.bind(this)
            })
          }

        }
      });
    } else if (userinfo.detail.errMsg == 'getUserInfo:fail auth deny') {
      config.fail();
    }
  },
  //banner接口
  handleMyBanner:function(){
    http.request({
      url:"/lxn/product/banner/mobile/v1/list",
      data:{
        productBannerPosition:"my",
        productBannerLink:true
      },
      success:function(res){
        this.setData({
          bannerList:res
        })
      }.bind(this),
    })
  },
  //各类订单数量
  handleOrderNum:function(){
    http.request({
      url:"/lxn/sale/order/status/mobile/v1/count",
      data:{},
      success:function(res){
          this.setData({
            orderNum:res[0]
          })
      }.bind(this)
    })
  },
  changeToSet: function () {
    wx.navigateTo({
      url: './set/set',
    })
  },
  changeToUserInfo: function () {
    wx.navigateTo({
      url: './userInfo/userInfo',
    })
  },
  changeToOrder: function () {
    wx.navigateTo({
      url: './order/order?index=0',
    })
  },
  changeToOrderWillPay: function () {
    wx.navigateTo({
      url: './order/order?index=1',
    })
  },
  changeToOrderWillSend: function () {
    wx.navigateTo({
      url: './order/order?index=2',
    })
  },
  changeToOrderWillGet: function () {
    wx.navigateTo({
      url: './order/order?index=3',
    })
  },
  changeToWillEvaluate: function () {
    wx.navigateTo({
      url: './order/order?index=4',
    })
  },
  changeToAddress: function () {
    wx.navigateTo({
      url: './address/address',
    })
  },
  changeToNews: function () {
    wx.navigateTo({
      url: './news/news'
    })
  },
  handleToWallet:function(){
    wx.navigateTo({
      url: './wallet/wallet',
    })
  },
  changeToService: function () {
    // wx.navigateTo({
    //   url: './service/service',
    // })
    wx.navigateTo({
      url: './order/afterSale/afterSale',
    })
  },
  changeToCards:function(){
    wx.navigateTo({
      url: './cards/cards',
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