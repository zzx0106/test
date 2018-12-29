var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Page({
  data: {
    phone: '',
    len: 0,
    top: ''
  },
  onLoad: function onLoad(options) {},
  onShow: function onShow() {},
  formatPhone: function formatPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  emitArea: function emitArea(e) {
    this.setData({
      len: e.detail.value.length,
      tip: e.detail.value
    });
  },
  submit: function submit() {
    if (this.data.len < 5) {
      return wx.showToast({
        title: '意见反馈不少于5个字',
        icon: 'none'
      });
    }

    if (!/^1\d{10}$/.test(this.data.phone)) {
      return wx.showToast({
        title: '电话号码格式不正确',
        icon: 'none'
      });
    }

    app.$http.request('/consumer/feedback', {
      mobile: this.data.phone,
      content: this.data.tip
    }, 'post').then(function (val) {
      wx.showToast({
        title: '提交成功'
      });
      setTimeout(function () {
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }, 500);
    });
  },
  jump: function jump() {
    wx.navigateTo({
      url: '/pages/question/question'
    });
  },
  goBack: function goBack() {
    wx.navigateBack();
  }
});