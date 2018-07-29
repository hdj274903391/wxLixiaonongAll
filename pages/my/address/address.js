// pages/my/address/address.js
const notification = require("../../../common/notification.js");
const http = require('../../../common/http.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
   appId:"",
   memberId:"",
   select:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.select == "true"){
      this.setData({
        select:true
      })
    }
    this.handleAddressList();
    notification.on("member-add-address", this, function (data) {
      this.handleAddressList();
    });
   
  },
  handleAddressList:function(){
    http.request({
      url: '/lxn/member/address/mobile/v1/list',
      data: {
      }, success: function (data) {

        const addressList1 = data;
        for (var i = 0; i < addressList1.length;i ++){
          if (addressList1[i].memberAddressIsDefault){
            const addressList1First = addressList1.splice(i, 1); 
            addressList1.splice(0, 0, addressList1First[0])
            break;
          }
        }
        this.setData({
          addressList: addressList1
          //addressList: data
        })
      }.bind(this)
    })
  },
  //订单选择地址
  handleOrderSelcet:function(e){
    if(this.data.select){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]
      let index = 0
      if (e) {
        index = e.currentTarget.dataset.index;
      }
      prevPage.setData({
        defaultAddress: this.data.addressList[index]
      }) 
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //修改收货地址
  handleToChangeAddress:function(e){
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './addAddress/addAddress?addressInfo=' + JSON.stringify(this.data.addressList[index]),
    })
  },
  //删除收货地址
  handleDelateAddress:function(e){
    const index = e.currentTarget.dataset.index;
    const thisData = this.data.addressList;
    const _this=this;
    wx.showModal({
      title: '',
      content: '确定要删除该地址么？',
      success:function(res){  
        if(res.confirm){
          http.request({
            url: '/lxn/member/address/mobile/v1/delete',
            data: {
              "memberAddressId": thisData[index].memberAddressId,
              "systemVersion": thisData[index].systemVersion,
            }, success: function (res) {
              thisData.splice(index,1)
              _this.setData({
                addressList: thisData
              })
              _this.setDefault();
            }.bind(this)
          })
       
        }
      }
    })
    // thisData.splice(index);
    // this.setData({
    //   addressList: thisData
    // })
  },
  //订单详情修改地址
  
  setDefault:function(e){
    let index = 0
    if (e){
      index = e.currentTarget.dataset.index;
    }
    let addressList = this.data.addressList;
    let _systemVersion = addressList[index].systemVersion ++
    http.request({
      url: '/lxn/member/address/mobile/v1/update',
      data:{
        "memberAddressId": addressList[index].memberAddressId,
        "memberAddressName": addressList[index].memberAddressName ,
        "memberAddressMobile": addressList[index].memberAddressMobile,
        "memberAddressProvince": addressList[index].memberAddressProvince,
        "memberAddressCity": addressList[index].memberAddressCity,
        "memberAddressArea": addressList[index].memberAddressArea,
        "memberAddressDetail": addressList[index].memberAddressDetail,
        "memberAddressPositionDetail": addressList[index].memberAddressPositionDetail,
        "memberAddressIsDefault": true,
        "memberAddressLongitude": addressList[index].memberAddressLongitude,
        "memberAddressLatitude": addressList[index].memberAddressLatitude,
        "systemVersion": _systemVersion
      },success:function(data){
        let first = addressList.splice(index, 1)
        addressList.unshift(first[0])
        this.setData({
          addressList: addressList
        })
        notification.emit("member-add-address", {});
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