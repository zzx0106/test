var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Page({
  data: {
    sn: '',
    id: '',
    detailInfo: {},
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentSwiper: 0,
    moneyInt: '',
    moneyCharge: '',
    showPic: false,
    showMain: false,
    showDetail: false,
    showNav: false,
    scrollTop: 0,
    currentPage: 0,
    color: 1
  },
  onLoad: function onLoad(options) {
    this.setData({
      sn: options.sn,
      id: options.id,
      color: wx.getStorageSync('color')
    });
    this.getdetailData();
  },
  onShow: function onShow() {
    this.getdetailData();
  },
  getdetailData: function getdetailData() {
    var _this = this;

    app.$http.request('/consumer/celldetail', {
      sn: this.data.sn,
      cell_id: this.data.id
    }, 'post').then(function (val) {
      var moneyInt = '￥' + val.goodsInfo.price.split('.')[0] + '.';
      var moneyCharge = val.goodsInfo.price.split('.')[1];

      _this.setData({
        detailInfo: val,
        moneyInt: moneyInt,
        moneyCharge: moneyCharge
      });
    });
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },
  swiperPageChange: function swiperPageChange(e) {
    console.log('swiperPageChange');
    this.setData({
      currentPage: e.detail.current
    });

    if (this.data.currentPage === 1) {
      this.setData({
        showNav: true
      });
    }
  },
  scanDetail: function scanDetail(e) {
    this.setData({
      currentPage: 1
    });
  },
  scanGoods: function scanGoods(e) {
    this.setData({
      currentPage: 0
    });
  },
  goBack: function goBack() {
    wx.navigateBack();
  },
  buy: function buy() {
    var self = this;

    if (self.data.detailInfo.goodsInfo.sellout_status === 2) {
      return;
    }

    wx.login({
      success: function success(res) {
        console.log(res);

        if (res.code) {
          try {
            var data = {
              cell_id: self.data.id,
              price: self.data.detailInfo.goodsInfo.price,
              code: res.code
            };
            app.$http.request('/consumer/buynow', data, 'post').then(function (val) {
              var params = JSON.parse(val.jsapi);
              console.log(params);
              console.log('-----------1', val, {
                timeStamp: params.timeStamp,
                nonceStr: params.nonceStr,
                package: params.package,
                signType: params.signType,
                paySign: params.paySign
              });
              wx.requestPayment({
                timeStamp: params.timeStamp,
                nonceStr: params.nonceStr,
                package: params.package,
                signType: params.signType,
                paySign: params.paySign,
                success: function success(res) {
                  console.log('-----------2', val);
                  wx.navigateTo({
                    url: '/pages/completePay/completePay?orderId=' + val.order_id
                  });
                },
                fail: function fail(res) {
                  console.log('-----------3', val);
                  wx.navigateTo({
                    url: '/pages/myOrders/myOrders'
                  });
                },
                complete: function complete(res) {
                  console.log('-------------4', res);
                }
              });
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
  }
});