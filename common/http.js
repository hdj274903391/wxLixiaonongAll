const constant = require("./constant.js");
const storage = require("./storage.js");
const util = require("./util.js");

function request(config) {
  if (config.isToast) {
    wx.showToast({
      title: '加载中..',
      icon: 'loading',
      mask: true,
      duration: constant.duration * 10
    });
  }

  config.data.appId = constant.appId;
  config.data.token = storage.getToken();
  // config.data.cityName = storage.getProvice();
  config.data.cityName = "上海市";
  config.data.platform = constant.platform;
  config.data.version = constant.version;
  config.data.timestamp = 0;

  wx.request({
    url: constant.host + config.url,
    method: 'POST',
    header: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(config.data),
    success: function (response) {
      if (config.isToast) {
        wx.hideToast();
      }

      if (response.data.code == 200) {
        config.success(response.data.data);
      } else {
        if (config.error) {
            config.error();
        }
        util.showFailToast({
          title: response.data.message
        });
      }
    },
    fail: function () {
      if (config.isToast) {
        wx.hideToast();
      }

      util.showFailToast({
        title: '网络出现错误'
      });
    }
  });
}

module.exports = {
  request: request
};