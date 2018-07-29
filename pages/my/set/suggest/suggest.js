const upload = require('../../../../common/upload.js');
const http = require('../../../../common/http.js');
const util = require('../../../../common/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewImageArr: [],
    selectTypeId:0,
    suggestTypeItem: [{ id: 0, name: "售后", select: true }, { id: 1, name: "配送", select: false }, { id: 2, name: "服务态度", select: false }, { id: 3, name: "商品质量", select: false }, { id: 4,name: "界面设计", select: false }],
    suggestTypeDisplay:false,
    textareaInput:"",
    newPreviewImageArr:[]//上传图片列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  //反馈类型选择显示
  typeSelect:function(){
    this.setData({
      suggestTypeDisplay: !this.data.suggestTypeDisplay
    })
  },
  //反馈类型选中
  suggestSelect:function(e){
      const id = e.currentTarget.dataset.id;
      let _this=this;
      const suggestTypeItem = _this.data.suggestTypeItem;
      for (let i = 0; i < suggestTypeItem.length; i++){
        suggestTypeItem[i].select = false
      }
      suggestTypeItem[id].select = !suggestTypeItem[id].select
      _this.setData({
        suggestTypeItem: suggestTypeItem,
        selectTypeId:id
      })
      _this.typeSelect();
  },
  //图片选择
  previewImage(e) {
    let previewImageArr = this.data.previewImageArr;
    var self = this;
    if (previewImageArr.length >= 9) {
      wx.showToast({
        title: '最多上传可以上传9张图片',
        mask: true,
        duration: 2000
      });
      return;
    }
    wx.chooseImage({
      count: 9 - previewImageArr.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        upload.uploadImage(res, function (result) {
          console.log(result)
       let   newPreviewImageArr = this.data.newPreviewImageArr
          previewImageArr = previewImageArr.concat(result.tempFilePaths);
          newPreviewImageArr = newPreviewImageArr.concat(result.imageList[0].fileOriginalPath)
          this.setData({
            previewImageArr: previewImageArr,
            newPreviewImageArr: newPreviewImageArr
          });
        }.bind(this))
      }.bind(this)
    })
  },
  changePreview(e) {
    var self = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: self.data.previewImageArr
    })
  },
  //输入内容
  textareaInput:function(e){
      this.setData({
        textareaInput: e.detail.value
      })
  },
  handlePhoneNum:function(e){
      this.setData({
        phoneNum: e.detail.value
      })
  },
  //表单提交
  formSubmit:function(){
    if (util.isPhone(this.data.phoneNum)){
    http.request({
      url: '/lxn/member/feedback/mobile/v1/save',
      data: {
        memberFeedbackPhone: this.data.phoneNum,
        memberFeedbackContent: this.data.textareaInput,
        memberFeedbackType: this.data.suggestTypeItem[this.data.selectTypeId].name,
        memberFeedbackImage: this.data.newPreviewImageArr,
      }, success: function (data) {
       wx.showToast({
         title: '反馈已提交!',
       })
       setTimeout(function(){
         wx.navigateBack({})
       },500)
      }
      })
    }else{
     wx.showToast({
       title: '请输入正确号码!',
     })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})