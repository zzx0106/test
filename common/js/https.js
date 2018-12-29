var regeneratorRuntime = require('../lib/runtime.js');
"use strict";

var request = function request(url, data, method) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var noloading = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var headerConfig = {
    // ticket = '...',
    // token = '...',
    'content-type': 'application/x-www-form-urlencoded'
  };
  var requestData = {};
  requestData.sn = wx.getStorageSync('sn') || '';
  requestData.sid = wx.getStorageSync('sid') || '';
  requestData.openid = wx.getStorageSync('openid') || '';
  return new Promise(function (resolve, reject) {
    if (!noloading) wx.showLoading();
    wx.request({
      url: 'http://mapp-t.3cuc.com.cn' + url,
      // dev
      // url: 'https://mapp-t.cmfspay.com' + url, //prod
      data: Object.assign(requestData, data),
      header: Object.assign({}, headerConfig, config),
      //合并传递进来的配置
      method: method || 'GET',
      success: function success(result) {
        console.log(Object.assign(requestData, data));

        if (result.statusCode === 200) {
          if (!noloading) wx.hideLoading();

          if (result.data.code === 0) {
            resolve(result.data.data);
          } else if (result.data.code === -99) {
            wx.showToast({
              title: '请求地址不存在',
              icon: 'none'
            });
            reject("\u8BF7\u6C42\u5730\u5740\u4E0D\u5B58\u5728: ".concat(result.config.url));
          } else {
            wx.showToast({
              title: result.data.msg,
              icon: 'none'
            });
            reject(result.data.msg);
          } // 根据状态吗判断错误

        } else if (/^50[0-9]/.test(result.status)) {
          if (!noloading) wx.hideLoading();
          wx.showToast({
            title: '500错误',
            icon: 'none'
          });
          reject('返回500错误');
        } else if (/^4[0-9][0-9]/.test(result.status)) {
          if (!noloading) wx.hideLoading();
          wx.showToast({
            title: '400错误',
            icon: 'none'
          });
          reject('返回400错误');
        }
      },
      fail: function fail(err) {
        if (!noloading) wx.hideLoading();
        reject(err);
      },
      complete: function complete() {
        if (!noloading) wx.hideLoading();
      }
    });
  });
};

module.exports.request = request;