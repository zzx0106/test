var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Page({
  data: {
    detailInfo: {},
    moneyInt: '',
    moneyCharge: ''
  },
  onLoad: function onLoad(options) {
    console.log(options);
    var id = options.id;
    this.setData({
      color: wx.getStorageSync('color')
    });
    this.getdetailData(id);
  },
  onShow: function onShow() {},
  onHide: function onHide() {},
  getdetailData: function getdetailData(orderId) {
    var _this = this;

    app.$http.request('/consumer/orderdetail', {
      orderId: orderId
    }, 'post').then(function (val) {
      var moneyInt = "￥" + val.pay_price.split('.')[0] + '.';
      var moneyCharge = val.pay_price.split('.')[1];

      _this.setData({
        detailInfo: val,
        moneyCharge: moneyCharge,
        moneyInt: moneyInt
      });
    });
  },
  copy: function copy(event) {
    var data = event.currentTarget.dataset.txt;
    wx.setClipboardData({
      data: data
    });
  },
  deleteGoods: function deleteGoods(event) {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该订单？',
      confirmText: '确定',
      success: function success(res) {
        if (res.confirm) {
          app.$http.request('/consumer/delorder', {
            orderId: self.data.detailInfo.id
          }, 'post').then(function (val) {
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            });
            wx.redirectTo({
              url: '/pages/myOrders/myOrders'
            });
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  goBack: function goBack() {
    wx.navigateBack();
  }
});