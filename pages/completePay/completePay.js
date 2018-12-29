var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Page({
  data: {
    orderId: '',
    openMsg: null,
    status: '出货中',
    dataInfo: {},
    openStatus: -1,
    hour: '',
    minute: '',
    second: '',
    rotate: true
  },
  onLoad: function onLoad(options) {
    console.log('completePay----', this, options); // this.setData({ orderId: '12312312313132' });

    this.setData({
      orderId: options.orderId
    });
    this.getPayInfo();
    this.timerTime = 2000;
    this.timerNum = 0; // this.timerOne = setInterval(() => {
    //     this.pollData();
    // }, 2000);
  },
  onReady: function onReady() {},
  onShow: function onShow() {},
  onHide: function onHide() {
    // 当页面进入后台
    // 当页面卸载
    this.timerEnd = true;
  },
  onUnload: function onUnload() {
    // 当页面卸载
    console.log('onUnload');
    this.timerEnd = true;
  },
  getPayInfo: function getPayInfo() {
    var _this = this;

    console.log('getPayInfo----', this.data.orderId);
    app.$http.request('/pay/completepay', {
      orderId: this.data.orderId
    }, 'post').then(function (val) {
      _this.setData({
        openMsg: val,
        orderType: val.orderType
      });

      console.log('val-----', val);

      if (val.orderType === 1) {
        _this.pollDatares();
      } else if (val.orderType === 2) {
        _this.pollusbDatares();
      } else {
        wx.showToast({
          title: '未知订单类型order_type'
        });
        return;
      }
    });
  },
  pollDatares: function pollDatares() {
    var _this2 = this;

    this.setData({
      status: '出货中'
    });
    this.timerSec = setTimeout(function () {
      console.log(_this2.timerTime, _this2.timerNum);
      _this2.timerNum++;

      if (_this2.timerNum > 9) {
        console.log('进入 timer ==');
        _this2.timerTime += 1000;
      }

      if (_this2.timerEnd) {
        return;
      }

      _this2.pollData();

      _this2.pollDatares();
    }, this.timerTime);
  },
  pollData: function pollData() {
    var _this3 = this;

    console.log('pollData', this.data.orderId);
    app.$http.request('/pay/querydooropen', {
      orderId: this.data.orderId
    }, 'post', {}, true).then(function (val) {
      _this3.setData({
        dataInfo: val
      });

      console.log();

      if (val.openRes == 1 || val.openRes == 0) {
        //成功之后清除轮询
        _this3.timerEnd = true;

        _this3.setData({
          rotate: false
        });

        if (val.openRes == 1) {
          _this3.setData({
            openStatus: 1,
            status: '出货成功'
          });
        } else if (val.openRes == 0) {
          _this3.setData({
            openStatus: 0,
            status: '出货失败'
          });
        }
      }
    });
  },
  pollusbDatares: function pollusbDatares() {
    var _this4 = this;

    this.setData({
      status: '出货中'
    });
    this.timerSec = setTimeout(function () {
      console.log(_this4.timerTime, _this4.timerNum);
      _this4.timerNum++;

      if (_this4.timerNum > 9) {
        console.log('进入 timer ==');
        _this4.timerTime += 1000;
      }

      if (_this4.timerEnd) {
        return;
      }

      _this4.pollusbData();

      _this4.pollusbDatares();
    }, this.timerTime); // this.timerSec = setInterval(() => {
    //     this.pollusbData();
    // }, 2000);
  },
  pollusbData: function pollusbData() {
    var _this5 = this;

    console.log('pollusbData', this.data.orderId);
    app.$http.request('/pay/queryusbopen', {
      orderId: this.data.orderId
    }, 'post').then(function (val) {
      console.log('openRes', val);

      if (val.openRes == 1 || val.openRes == 0) {
        //成功之后清除轮询
        _this5.timerEnd = true;

        _this5.setData({
          rotate: false
        });

        if (val.openRes == 1) {
          _this5.setData({
            openStatus: 2,
            status: '出货成功'
          });
        } else if (val.openRes == 0) {
          _this5.setData({
            openStatus: 0,
            status: '出货失败'
          });
        }
      }
    });
  },
  complete: function complete() {
    wx.navigateTo({
      url: '/pages/main/main'
    });
  },
  question: function question() {
    wx.navigateTo({
      url: '/pages/question/question'
    });
  }
});