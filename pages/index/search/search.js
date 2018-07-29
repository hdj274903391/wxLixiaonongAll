const http = require('../../../common/http.js');
const storage = require('../../../common/storage.js');
Page({
  data: {
    inputContent: "",
    hotSearchList: [],
    historyList: [],
    searchPromptlist: [] ,//搜索提示列表
  },
  onLoad: function (options) {
    this.hotSearchHistory();
    if (storage.getToken() !== ''){
      this.loginHistorySearchList();
    }else{
      this.historySearchList();
    }
  },
  handleInputContent: function(e) {
    var inputContent = e.detail.value;
    this.setData({
      inputContent: inputContent
    })
    this.handleSearchPromptlist();
  },
  handleClearInput:function(e){
    this.setData({
      inputContent: e.currentTarget.id
    })
 
  },
  //搜索确认
  handleSubmitInput:function(){
    if (this.data.inputContent.trim() === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none'
      })
      return;
    } 
    wx.navigateTo({
      url: './searchResult/searchResult?inputContent=' + this.data.inputContent,
    })
  },
  //搜索提示列表
  handleSearchPromptlist:function(){
    http.request({
      url:"/lxn/product/mobile/v1/search/prompt/list",
      data:{
        "productName": this.data.inputContent,
        "pageIndex": 1,
        "pageSize": 10,
      },
      success:function(res){
        var SearchPromptlist = res.list.map(list =>{
          return{
            goodsName: list.productName
          }
        })
        this.setData({
          SearchPromptlist: SearchPromptlist
        })
      }.bind(this)
    })
  },
  //点击搜索提示改变输入框内容
  handleChengeToInputContent:function(e){
    this.setData({
      inputContent: e.currentTarget.dataset.content
    })
    this.handleSubmitInput();
  },
  //登录状态下请求搜索历史
  loginHistorySearchList:function(){
    http.request({
      url: '/lxn/member/search/mobile/v1/list',
      data: {
        pageIndex: 1,
        pageSize: 10
      },
      success: function (res) {
        const historyLists = this.handleDelateRepeatListItem(res.list)
        this.setData({
          historyList: historyLists
        })
      }.bind(this)

    })
  },
  //删除数组重复内容
  handleDelateRepeatListItem: function (list) {
    var newList = list.map(ListItem => {
      return ListItem.memberSearchKey
    })
    var arrs = [];
    for (var i = 0; i < newList.length; i++) {
      if (arrs.indexOf(newList[i]) == -1) {
        arrs.push(newList[i]);
      }
    }
    return arrs;
  },
  //未登录状态下的本地缓存搜索历史
  historySearchList:function(){
    const historyList = wx.getStorageSync('searchHistory');
    if (historyList){
      this.setData({
        historyList: historyList
      })
    }
  },
  //热门搜索
  hotSearchHistory:function(){
    http.request({
      url: '/lxn/member/search/mobile/v1/hot/list',
      data: {
        pageIndex: 1,
        pageSize: 10
      }, 
      success: function (res) {
        const hotSearchLists = this.handleDelateRepeatListItem(res.list)
        this.setData({
          hotSearchList: hotSearchLists
        })
      }.bind(this)

    })
  },

  //取消按钮
  handeleToReturn:function(){
    wx.navigateBack({})
  },
  //删除历史记录
  handeleDelateHistory:function(){
    this.setData({
      historyList:[]
    })
    wx.removeStorageSync('searchHistory')
    http.request({
      url: '/lxn/member/search/mobile/v1/delete',
      data: {}, 
      success: function (data) {
        }.bind(this)
    })
    this.historySearchList()
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