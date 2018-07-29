const constant = require("./constant.js");
const storage = require("./storage.js");
function uploadImage(data, complete) {
  var that = this;
  var success = data.success?data.success:0;
  var fail = data.fail?data.fail:0;
  var i = data.i?data.i:0;
  var imageList = data.imageList?data.imageList:[];
  if (i === 0) {
    wx.showLoading({
      title: "正在上传...",
      mask: true
    });
  }
  wx.uploadFile({
    url: data.url ? data.url : constant.imageHost + '/file/file/mobile/v1/image/file/upload',
    filePath: data.tempFilePaths[i],
    name: 'file',
    formData: {
      appId: constant.appId,
      token: storage.getToken(),
      platform: constant.platform,
      version: constant.version
    },
    success: (res) => {
      var result = JSON.parse(res.data)
      if (result.code && result.code === 200) {
        success++;
        imageList.push(result.data[0]);
      } else {
        fail++;
      }
    },
    fail: (res) => {
      fail++;
    },
    complete: () => {
      i++;
      data.i = i;
      data.success = success;
      data.fail = fail;
      data.imageList = imageList;
      if (i === data.tempFilePaths.length) {
        wx.hideLoading();
        complete(data);
      } else {
        that.uploadImage(data, complete);
      }
      
    }
  });
}

module.exports = {
  uploadImage: uploadImage
};