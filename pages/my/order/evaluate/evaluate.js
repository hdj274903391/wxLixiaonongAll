const http = require("../../../../common/http.js");
const constant = require("../../../../common/constant.js")
const upload = require("../../../../common/upload.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHost: constant.imageHost,
    activeStar:0,
    previewImageArr: [],
    Satisfaction:"",
    goodsList:[],
    saleOrderProductCommentIsAnonymous:false//是否匿名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let goodsList = JSON.parse(options.goodsList)
    let activeStar = 0;
    let previewImageArr=[];
    for (var i = 0; i < goodsList.length; i++) {
      goodsList[i].activeStar = activeStar;
      goodsList[i].previewImageArr = previewImageArr;
      goodsList[i].upLoadImgList = previewImageArr;
      goodsList[i].inputContent = ""
    }
    this.setData({
      goodsList: goodsList
    })
    //this.handleAddContent();
  },
  handleAddContent:function(){
  },
// 改变评分
  changeScale:function(e){
 
    const _this= this;
    const active = e.currentTarget.dataset.active;
    const index = e.currentTarget.dataset.index;
    let current = e.currentTarget.dataset.current;
    let num = e.currentTarget.dataset.num + 1;
    let activeStar = "goodsList[" + current + "].activeStar";
    let Satisfaction = "goodsList[" + current +"].Satisfaction";
    switch(num){
      case 1:
      this.setData({
        [Satisfaction]:"非常差"
      })
      break;
      case 2:
        this.setData({
          [Satisfaction]: "差"
        })
        break;
      case 3:
        this.setData({
          [Satisfaction]: "一般"
        })
        break;
      case 4:
        this.setData({
          [Satisfaction]: "满意"
        })
        break;
      default:
        this.setData({
          [Satisfaction]: "非常满意"
        });
    }
    if (active === "active") {
     _this.setData({
       [activeStar]: num - 1
     })
    }else{
      _this.setData({
        [activeStar]:num
      })
    }
  },
  //评论内容
  handleInputContent:function(e){
    let value= e.detail.value;
    let current = e.currentTarget.dataset.current;
    let inputContent = "goodsList[" + current +"].inputContent";
    this.setData({
      [inputContent]: value
    })
  },
  //图片选择
  previewImage:function(e) {
    let current = e.currentTarget.dataset.current
     let previewImageArr = this.data.goodsList[current].previewImageArr;
     let upLoadImgList = this.data.goodsList[current].upLoadImgList;

    let NewPreviewImageArr = "goodsList[" + current +"].previewImageArr";
    let NewUpLoadImgList = "goodsList[" + current + "].upLoadImgList"
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
      success:function(res) {
        upload.uploadImage(res, function (result){
          console.log(result)
          let imgList = {}
           imgList.saleOrderProductCommentImagePath = result.imageList[0].fileOriginalPath
           upLoadImgList = this.data.goodsList[current].upLoadImgList.concat(imgList);
          previewImageArr = this.data.goodsList[current].previewImageArr.concat(result.tempFilePaths);
          this.setData({
            [NewPreviewImageArr]: previewImageArr,
            [NewUpLoadImgList]: upLoadImgList
          });
        }.bind(this))
      //   const tempFilePaths = data.tempFilePaths;
      //   const previewImageArr = this.data.previewImageArr
      //   this.setData({ 
      //     [NewPreviewImageArr]: this.data.goodsList[current].previewImageArr.concat(tempFilePaths)
      // });
      }.bind(this)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  changePreview(e) {
    var self = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: self.data.previewImageArr
    })
  },
  //评论提交
  handleSubmit:function(){
    let goodsList = this.data.goodsList;
    goodsList = goodsList.map(item =>{
      return{
        productId: item.productId,
        saleOrderProductCommentSatisfaction: item.activeStar,
        saleOrderProductCommentContent:item.inputContent,
        saleOrderProductCommentImageList: item.upLoadImgList,
        saleOrderProductCommentIsAnonymous: this.data.saleOrderProductCommentIsAnonymous,
        saleOrderId: item.saleOrderId,
        saleOrderProductId: item.saleOrderProductId,
        productSkuId:item.productSkuId
      }
    })
    http.request({
      url:"/lxn/saleOrderProductComment/mobile/v1/save",
      data:{
        commentList: goodsList
      },
      success:function(res){
        if (res.result){
          wx.showToast({
            title: '评论成功',
          })
          wx.navigateTo({
            url: '../order?index=0',
          })
        }
      }
    })
  },
  handleIsAnonymous:function(){
    this.setData({
      saleOrderProductCommentIsAnonymous: !this.data.saleOrderProductCommentIsAnonymous
    })
  },
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