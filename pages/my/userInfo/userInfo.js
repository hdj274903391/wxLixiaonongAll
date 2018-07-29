const http = require('../../../common/http.js');
const upload = require('../../../common/upload.js');
const constant = require("../../../common/constant.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    memberId:"",
    appId:"",
    token:"",
    selectedSex:false,
    userInfo:{
      memberAvatarPath:"",
      memberNickName:"151****3124",
      memberGender:"未设置",
      memberBirthday:"未填写"
    },
    memberAvatarId:0,
    lll:"",
    sex: [{ value: '男'},{value:'女'}]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){
    this.handleGetUserInfo();
  },
  //获取用户信息
  handleGetUserInfo:function(){
    http.request({
      url:"/lxn/member/mobile/v1/find",
      data:{},
      success:function(res){

          if (res.memberBirthday === "" ){
            res.memberBirthday = "未填写"
          }
          if (res.memberGender === "") {
            res.memberGender = "未选择"
          }
          this.setData({
            userInfo: res
          })
      }.bind(this)
    })
  },
  changeToSetPassword:function(){
    wx.navigateTo({
      url: './setPassword/setPassword',
      
    })
  },
  //设置头像
  previewImage: function (e) {
    let memberAvatarPath = this.data.userInfo.memberAvatarPath;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:function(res) {
        upload.uploadImage(res, function (result){
          const memberAvatarPath = 'userInfo.memberAvatarPath'
          this.setData({
            [memberAvatarPath]: result.imageList[0].fileOriginalPath,
            memberAvatarId: result.imageList[0].fileId
          });
        }.bind(this))
       
      }.bind(this)
    })
  },
  //设置用户昵称
  handleNickName:function(e){
    const newNickName = e.detail.value
    const memberNickName = 'userInfo.memberNickName'
    this.setData({
      [memberNickName]: newNickName
    })
  },
  //显示性别选项
  handleRadioDisplay:function(){
    this.setData({
      selectedSex:true
    })
  },
  //设置性别
  handleSelectSex:function(e){
    const memberGender = 'userInfo.memberGender'
    const selectGender = e.currentTarget.dataset.value
    this.setData({
      [memberGender]: selectGender
    })
  },
  //设置生日
  handlebInputBirthday:function(e){
    let  memberBirthday = "userInfo.memberBirthday";
    this.setData({
      [memberBirthday]: e.detail.value
    })
  },
  //提交用户信息
  handleSubmitUserInfo:function(){
    http.request({
      url: '/lxn/member/mobile/v1/update', 
      data: {
        "memberNickName": this.data.userInfo.memberNickName,
        "memberAvatarId": this.data.memberAvatarId,
        "memberAvatarPath": this.data.userInfo.memberAvatarPath,
        "memberGender": this.data.userInfo.memberGender,
        "memberBirthday": this.data.userInfo.memberBirthday,
        "systemVersion": this.data.userInfo.systemVersion
      },
      success: function (res) {
       wx.showToast({
         title: '修改成功',
       })
      }
    })
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