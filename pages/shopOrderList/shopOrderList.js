var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Page({
  data: {
    orderShopList: []
  },
  onLoad: function onLoad() {
    try {
      console.log("JSON.parse(wx.getStorageSync('order_shop_list'))", JSON.parse(wx.getStorageSync('order_shop_list')));
      this.setData({
        orderShopList: JSON.parse(wx.getStorageSync('order_shop_list'))
      });
    } catch (error) {
      console.log('shopDetail onload  error', error);
    }
  }
});