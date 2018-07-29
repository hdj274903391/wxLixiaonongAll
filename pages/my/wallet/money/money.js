const http = require('../../../../common/http.js');
const storage = require('../../../../common/storage.js');
const notification = require('../../../../common/notification.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectItem: [{ rechargeMoney: "0", backMoney: "0" }],
    selectColor:0,
    selectPay:1,
    totalFee:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleRebateRule();
  },
  select:function(e){
    const i = e.currentTarget.dataset.findex;
    this.setData({
      selectColor: i,
      totalFee: this.data.selectItem[i].rechargeMoney
    })
  },
  selectPay:function(e){
    const d = this.data;
    const i = e.currentTarget.dataset.pay;
    if (d.selectPay == i) {
      this.setData({
        selectPay: null
      })
    } else {
      this.setData({
        selectPay: i,
      })
    }
  },
  //支付前
  handlePayBefore: function (res){
    http.request({
      url: '/wechat/wechat/pay/mobile/v2/unified/order',
      data: {
        wechatMiniTradeType:"recharge",
        openId: storage.getOpenId(),
        tradeType: "JSAPI",
        wechatPayItemType:1,
        outTradeNo: res.map.memberTradeRecordId,
        body: "e电车-订单",
        totalFee: res.map.payAmount * 100,
        attach: JSON.stringify({ memberTradeRecordId: res.map.memberTradeRecordId })
      }, 
      success:function(res){
        wx.requestPayment(
          {
            'timeStamp': res.timeStamp,
            'nonceStr': res.nonceStr,
            'package': res.packageStr,
            'signType': res.signType,
            'paySign': res.paySign,
            'appId': res.appId,
            'success': function (res) {
              notification.emit("member-pay", {})
              wx.showToast({
                title: '充值成功',
              })
              setTimeout(function(){
                wx.navigateBack({})
              },1000)
             },
      
          })
       // this.handlePayTest(res.outTradeNo);
      }.bind(this),
      })
  },
  //支付
  handlePay:function(){
    http.request({
      url:"/lxn/member/trade/record/mobile/v1/save",
      data:{
        memberRechargeRuleId: this.data.selectItem[this.data.selectColor].memberRechargeRuleId
      },
      success:function(res){
          this.handlePayBefore(res)
 
      }.bind(this)
    })
 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //红包返利规则列表
  handleRebateRule:function(){
    http.request({
      url:"/lxn/member/recharge/rule/mobile/v1/list",
      data:{},
      success:function(res){
        this.setData({
          selectItem:res
        })
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