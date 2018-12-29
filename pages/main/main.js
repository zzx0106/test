var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = getApp();
Page({
  data: {
    dataInfo: {},
    layout: null,
    myAvatar: '',
    isScroll: true,
    color: 1
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      var qr;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(options && options.q)) {
                _context.next = 6;
                break;
              }

              wx.showLoading();
              qr = decodeURIComponent(options.q);
              _context.next = 5;
              return this.getVerify(qr);

            case 5:
              console.log('q', qr);

            case 6:
              if (wx.getStorageSync('sn')) {
                _context.next = 9;
                break;
              }

              wx.redirectTo('/pages/index/index');
              return _context.abrupt("return");

            case 9:
              this.getindexList();

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLoad(_x) {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  // onShow: function () {
  // 	this.getindexList()
  // },
  getVerify: function getVerify(qr) {
    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(resolve, rej) {
        var res, val;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return app.Util.turn2Promise(wx.login);

              case 2:
                res = _context2.sent;

                if (!res.code) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 6;
                return app.$http.request('/consumer/init', {
                  code: res.code,
                  qr: qr
                }, 'post');

              case 6:
                val = _context2.sent;
                // if(!wx.getStorageSync('sn')){
                wx.setStorageSync('sn', val.sn); // }

                wx.setStorageSync('openid', val.openid);
                resolve();
                _context2.next = 12;
                break;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
  },
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
    console.log('点击测试：', event);
    var item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?sn=' + this.data.dataInfo.goodsInfo.sn + '&&id=' + item.id
    });
  },
  goBack: function goBack(event) {
    console.log(getCurrentPages()); // let navigatStack = getCurrentPages();
    // if (navigatStack.length > 1) {
    //     wx.navigateBack();
    // } else {
    // 	console.log('进redirectTo')

    wx.reLaunch({
      url: '/pages/index/index'
    }); // }
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