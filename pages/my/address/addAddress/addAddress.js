// pages/my/address/addAddress/addAddress.js
const http = require("../../../../common/http.js");
const util = require("../../../../common/util.js")
const notification = require("../../../../common/notification.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    info:{address:"请选择相关位置"},
    region: [" 省份","城市","区县"],
    inputAddressInfo:"",
    inputName:"",
    inputPhone:"",
    customItem: '全部',
    selected:true,
    distriBution:[1,2,3,4,5,6,7,8,9,0],//小区列表
    distriButionSelect: { smallAreaCode: 0, smallArea:"请选择配送小区"},//小区选中
    addressInfo:[],
    isPhone:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.addressInfo){
      const addressInfo = JSON.parse(options.addressInfo);
      if (util.isPhone(addressInfo.memberAddressMobile)){
        this.setData({
          isPhone:true
        })
      }
      let province = "region["+0+"]";
      let city = "region[" + 1 + "]";
      let area = "region[" + 2 + "]";
      let smallAreaCode = "distriButionSelect.smallAreaCode";
      let smallArea = "distriButionSelect.smallArea";
      let memberAddressPositionDetail ="info.address";
      let longitude = "info.longitude";
      let latitude ="info.latitude"
      this.setData({
        [province]: addressInfo.memberAddressProvince,
        [city]: addressInfo.memberAddressCity,
        [area]: addressInfo.memberAddressArea,
        [smallAreaCode]: addressInfo.distributionAreaId,
        [smallArea]: addressInfo.smallArea,
        [memberAddressPositionDetail]: addressInfo.memberAddressPositionDetail,
        [longitude]: addressInfo.memberAddressLongitude,
        [latitude]: addressInfo.memberAddressLatitude,
        addressInfo: addressInfo,
        upDate:true
      }
      )
    }else{
      this.setData({
        upDate: false
      })
    }
  },
  //省市区选择
  bindRegionChange: function (e) {
    const addresInfoChange = e.detail.value;
    const addressInfo = this.data.addressInfo;
    addressInfo.memberAddressProvince = addresInfoChange[0];
    addressInfo.memberAddressCity = addresInfoChange[1];
    addressInfo.memberAddressArea = addresInfoChange[2];
    this.setData({
      region: addresInfoChange,
      addressInfo: addressInfo
    })
   
  },
  //小区选择
  handleDistriBution:function(e){
    this.setData({
      distriButionSelect: this.data.distriBution[e.detail.value]
    })
  },
  //获取配送小区列表
  handleDistriButionList:function(){

    http.request({
      url: "/lixiaonong/distribution/area/mobile/v1/list",
      data:{
        pageIndex:1,
        pageSize:5,
        provinces: this.data.region[0],
        city: this.data.region[1],
        area: this.data.region[2]
      },
      success:function(res){
        let distriBution = res.list.map(item =>{
          return{
            smallArea: item.smallArea,
            smallAreaCode: item.distributionAreaId
          }
           
        })
        this.setData({
          distriBution: distriBution
        })
      }.bind(this)
    })
  },
  //详细地址
  inputAddressInfo:function(e){
    let addressInfo = this.data.addressInfo;
    addressInfo.memberAddressDetail = e.detail.value;
    this.setData({
      inputAddressInfo: e.detail.value,
      addressInfo: addressInfo
    })
  },
  //收件人姓名
  inputName:function(e){
    let addressInfo = this.data.addressInfo;
    addressInfo.memberAddressName = e.detail.value;
    this.setData({
      inputName: e.detail.value,
      addressInfo: addressInfo
    })
  },
  //手机号码
  inputPhone:function(e){

    let addressInfo = this.data.addressInfo;
    addressInfo.memberAddressMobile = e.detail.value;
    this.setData({
      inputPhone: e.detail.value,
      addressInfo: addressInfo
    })
  },
  //号码输入验证
  hanleOverPhone:function(e){
    if(!util.isPhone(e.detail.value)){
      this.setData({
        isPhone:false
      })
    }else{
      this.setData({
        isPhone: true
      })
    }
  },
  //设置默认
  selectIcon:function(){
    this.setData({
      selected: !this.data.selected
    })
  },
  //修改收货地址
  handleUpdate:function(){
    if (this.data.isPhone){
      const systemVersion = this.data.addressInfo.systemVersion++
      http.request({
        url: '/lxn/member/address/mobile/v1/update',
        data: {
          "memberAddressId": this.data.addressInfo.memberAddressId,
          "memberAddressName": this.data.addressInfo.memberAddressName,
          "memberAddressMobile": this.data.addressInfo.memberAddressMobile,
          "memberAddressProvince": this.data.addressInfo.memberAddressProvince,
          "memberAddressCity": this.data.addressInfo.memberAddressCity,
          "memberAddressArea": this.data.addressInfo.memberAddressArea,
          "memberAddressDetail": this.data.addressInfo.memberAddressDetail,
          "memberAddressIsDefault": this.data.selected,
          "memberAddressLongitude": this.data.info.longitude,
          "memberAddressLatitude": this.data.info.latitude,
          "memberAddressPositionDetail": this.data.info.address,
          "systemVersion": systemVersion
        }, success: function (res) {
          wx.showToast({
            title: '修改成功',
          })
          notification.emit("member-add-address", {});
          setTimeout(function () {
            wx.navigateBack({})
          }, 500)
        }
      })
    }else{
      wx.showModal({
        title: '请填入正确的手机号！',
      })
    }
   
  },
 //增加收货地址
  handleKeep:function(){
    if (this.data.region[0] === "省份" || this.data.region[1] === "城市" || this.data.region[2] === "||" ){
      wx.showToast({
        title: '请填写省市县',
      })
    }else{
      if (this.data.info.address === "请选择相关位置"){
        wx.showToast({
          title: '请选择配送小区',
        })
      }else{
        if (this.data.inputAddressInfo === "") {
          wx.showToast({
            title: '请填写详细地址',
          })
        } else {
          if (this.data.inputName === "") {
            wx.showToast({
              title: '请输入收件人名称',
            })
          } else {
            if (!this.data.isPhone) {
              wx.showToast({
                title: '请输入收件人号码',
              })
            } else {
              http.request({
                url: '/lxn/member/address/mobile/v1/save',
                data: {
                  "memberAddressName": this.data.inputName,
                  "memberAddressMobile": this.data.inputPhone,
                  "memberAddressProvince": this.data.region[0],
                  "memberAddressCity": this.data.region[1],
                  "memberAddressArea": this.data.region[2],
                  "memberAddressDetail": this.data.inputAddressInfo,
                  "memberAddressIsDefault": this.data.selected,
                  // "smallArea": this.data.distriButionSelect.smallArea,
                  // "distributionAreaId": this.data.distriButionSelect.smallAreaCode
                  "memberAddressLongitude": this.data.info.longitude,
                  "memberAddressLatitude": this.data.info.latitude,
                  "memberAddressPositionDetail": this.data.info.address
                }, success: function (res) {
                  wx.showToast({
                    title: '添加成功',
                  })
                  notification.emit("member-add-address", {});
                  setTimeout(function () {
                    wx.navigateBack({})
                  }, 500)
                }
              })
            }
          }
        }
      }
     
    }
    
  },
  handleToChooseLocation:function(){
    wx.navigateTo({
      url: '../selectOrigin/selectOrigin',
    })
  },
  onShow: function () {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
   
     let address ="addressInfo.memberAddressPositionDetail";
    this.setData({
      [address]: this.data.info.address
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})