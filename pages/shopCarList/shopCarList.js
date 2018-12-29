var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Page({
  data: {
    dataInfo: {},
    layout: null,
    myAvatar: '',
    isScroll: true,
    color: 1
  },
  onLoad: function onLoad(options) {
    try {
      this.setData({
        submitGoods: JSON.parse(wx.getStorageSync('submitGoods'))
      });
    } catch (error) {
      console.log('shopDetail onload  error', error);
    }
  },
  // onShow: function () {
  // 	this.getindexList()
  // },
  getindexList: function getindexList() {
    var _this = this;

    app.$http.request('/consumer/index', {}, 'post').then(function (val) {
      _this._formatListData(val.goodsInfo.info);

      _this.setData({
        dataInfo: val,
        layout: val.themeInfo.layout,
        color: val.themeInfo.color
      });

      wx.setStorageSync('color', val.themeInfo.color);

      if (wx.getStorageSync('avatar')) {
        _this.setData({
          myAvatar: wx.getStorageSync('avatar')
        });
      } else {
        _this.setData({
          myAvatar: _this.data.dataInfo.userInfo.headimg
        });

        wx.setStorageSync('avatar', _this.data.dataInfo.userInfo.headimg);
      }
    });
  },
  _formatListData: function _formatListData(list) {
    return list.map(function (item) {
      item.moneyInt = '￥' + item.price.split('.')[0] + '.';
      item.moneyCharge = item.price.split('.')[1];
      return item;
    });
  },
  scanDetail: function scanDetail(event) {
    var item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?sn=' + this.data.dataInfo.goodsInfo.sn + '&&id=' + item.id
    });
  },
  scanInfo: function scanInfo(event) {
    wx.redirectTo({
      url: '/pages/index/index'
    });
  },
  charge: function charge(event) {
    this.setData({
      showShadow: true,
      showCharge: true,
      isScroll: false
    });
  },
  close: function close(event) {
    this.setData({
      showShadow: false,
      showCharge: false,
      isScroll: true
    });
  },
  buy: function buy(event) {
    var self = this;
    wx.login({
      success: function success(res) {
        if (res.code) {
          app.$http.request('/consumer/paycharge', {
            code: res.code
          }, 'post').then(function (val) {
            var params = JSON.parse(val.jsapi);
            wx.requestPayment({
              timeStamp: params.timeStamp,
              nonceStr: params.nonceStr,
              package: params.package,
              signType: params.signType,
              paySign: params.paySign,
              success: function success(res) {
                wx.navigateTo({
                  url: '/pages/completePay/completePay?orderId=' + val.order_id
                });
              },
              fail: function fail(res) {
                wx.navigateTo({
                  url: '/pages/myOrders/myOrders'
                });
              }
            });
          });
        }
      }
    });
  }
});