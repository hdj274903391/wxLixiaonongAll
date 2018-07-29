// pages/shop/newOrder/invoices/invoices.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceHeader: "1",
    invoicesTypeSelect:"0",
    orderIsInvoice:false,//是否开具发票
    invoicesTypeSelectDisplay:false,
    invoicesTypeList: ["电子普通发票", "纸质普通发票","增值税专用发票"],
    invoicesInfo: { saleOrderInvoiceUserName: "", invoiceHeader: "1", saleOrderInvoiceCompanyName: "", saleOrderInvoiceCardNumber:""}
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
  //名字
  handleUserName:function(e){
    let saleOrderInvoiceUserName ="invoicesInfo.saleOrderInvoiceUserName"
    this.setData({
      [saleOrderInvoiceUserName]: e.detail.value
    })
  },
  //单位名称
  handleCompanyName:function(e){
    let saleOrderInvoiceCompanyName = "invoicesInfo.saleOrderInvoiceCompanyName"
    this.setData({
      [saleOrderInvoiceCompanyName]: e.detail.value
    })
  },
  //卡号
  handleUserCardNumber:function(e){
    let saleOrderInvoiceCardNumber = "invoicesInfo.saleOrderInvoiceCardNumber"
    this.setData({
      [saleOrderInvoiceCardNumber]: e.detail.value
    })
  },
  //发票类型列表显示
  invoicesTypeSelect:function(){
    this.setData({
      invoicesTypeSelectDisplay: !this.data.invoicesTypeSelectDisplay
    })
  },
  handlePeopleType:function(e){
    let invoiceHeader = "invoicesInfo.invoiceHeader"
    this.setData({
      invoiceHeader: e.currentTarget.dataset.index,
      [invoiceHeader]: e.currentTarget.dataset.index
    })
  },
  handleInvoicesTypeSelect:function(e){
    this.setData({
      invoicesTypeSelect: e.currentTarget.dataset.index
    })
  },
  handleToSure: function (event){
     
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var str = event.detail.value;
    prevPage.setData({
      invoicesInfo: this.data.invoicesInfo,
      orderIsInvoice: this.data.orderIsInvoice
    });
    wx.navigateBack({
      delta: 1,
    })
   
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  handleIsUseInvoice:function(e){
    if (e.detail.value) {
      this.setData({
        orderIsInvoice: true,
      })
    } else {
      this.setData({
        orderIsInvoice: false
      })
    }
  },
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