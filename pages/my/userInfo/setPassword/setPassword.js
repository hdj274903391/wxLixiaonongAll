// pages/index/serach/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:"",
    captchaCode: '',
    motto:"",
    openId: ""
  },
  phoneNumberInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  captchaCodeInput: function (e) {
    this.setData({
      captchaCode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'http://ip-api.com/json',
      success: function (e) {
        that.setData({
          motto: e.data.query
        })
      }
    });
    wx.getStorage({
      key: 'appId',
      success: (res) => {
        this.setData({
          openId: res.data.openId
        })
      }
    })
  },
  SendCaptcha: function (e) {
    var requestData = {
      appId: 'b8738e93c4134a179bcb6936c574c65d',
      systemRequestUserId: '14463951d1d94d39a9216dbd818fc984',
      smsCaptchaType: 'LOGIN',
      smsCaptchaMobile: this.data.phoneNumber,
      smsCaptchaIpAddress: this.data.motto,
      captchaMinute: 2,
    }
    wx.request({
      url: 'http://192.168.1.156:10010/sms/captcha/system/v1/aliyun/send',
      data: requestData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (result) {
        wx.showToast({
          title: '验证码发送成功',
          icon: 'success',
          duration: 2500
        })
      },
      fail: function (result) {
        wx.showToast({
          title: result,
          icon: 'loading',
          duration: 2500
        })
      }
    })
  },
  formBindsubmit: function (e) {
    var requestData = {
      wechatOpenId: this.data.openId,
      wechatUnionId: '',
      wechatNickName: app.globalData.userInfo.nickName,
      wechatSex: app.globalData.userInfo.gender == 1 ? 'MAN' : 'WOMAN',
      wechatCountry: app.globalData.userInfo.country,
      wechatProvince: app.globalData.userInfo.province,
      wechatCity: app.globalData.userInfo.city,
      wechatLanguage: app.globalData.userInfo.language,
      wechatHeadImgUrl: app.globalData.userInfo.avatarUrl,
      smsCaptchaMobile: this.data.phoneNumber,
      smsCaptchaCode: this.data.captchaCode,
      systemRequestUserId: '14463951d1d94d39a9216dbd818fc984',
      appId: 'b8738e93c4134a179bcb6936c574c65d'
    }
    wx.request({
      url: 'http://192.168.1.156:8080/member/mobile/v1/wechat/auth/login',
      data: requestData,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (result) {
        wx.setStorage({
          key: 'appId',
          data: {
            openId: result.data.data.openId,
            memberId: result.data.data.memberId,
            token: result.data.data.memberId
          },
          success: function (res) {
            wx.switchTab({
              url: '../../../index/index',
            })
        
          }
        })
        if (result.error) {
          wx.showToast({
            title: result.error,
            icon: iconVar,
            duration: 2500
          })
        } else {
          var msg = '登录验证通过！';
          var iconVar = 'success';
          if (result.data.result == false) {
            msg = result.data.message;
            iconVar = 'loading';

          } else {
            setTimeout(function () {
            
            }, 1000)
          }
          wx.showToast({
            title: msg,
            icon: iconVar,
            duration: 2500
          })

        }
      },
      fail: function (result) {
        wx.showToast({
          title: result.errMsg,
          icon: 'loading',
          duration: 2500
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