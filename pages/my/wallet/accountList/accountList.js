const http = require("../../../../common/http.js");
const util = require("../../../../common/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:1000,
    accountList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == "money"){
      wx.setNavigationBarTitle({
        title: '交易明细',
      })
      this.handleAccountList()
    }else{
      wx.setNavigationBarTitle({
        title: '积分明细',
      })
      this.handleGetScoreList();
    }
   
  },
  //获取收支明细接口
  handleAccountList:function(){
    http.request({
      url: "/lxn/member/trade/record/mobile/v1/find",
      data: {},
      success: function (res) {
        res = res.map(item=>{
          return {
            memberPointRecordType: item.memberTradeType,
            systemCreateTime: item.systemCreateTime,
            memberPointChangePoint: item.payAmount
          }
        })
        for (var i = 0; i < res.length; i++) {
          res[i].systemCreateTime = util.formatTimeReturn(res[i].systemCreateTime / 1000, "Y-M-D")
        }
        this.setData({
          accountList: res
        })
      }.bind(this)
    })
  },
  //获取积分明细
  handleGetScoreList:function(){
    http.request({
      url:"/lxn/member/point/record/mobile/v1/find",
      data:{},
      success:function(res){
        for (var i = 0; i < res.length; i++) {

          res[i].systemCreateTime = util.formatTimeReturn(res[i].systemCreateTime / 1000, "Y-M-D")
     
        }
       this.setData({
         accountList:res
       })
      }.bind(this)
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