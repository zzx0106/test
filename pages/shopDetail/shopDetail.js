var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = getApp();
Page({
  data: {
    dataInfo: {},
    layout: null,
    myAvatar: '',
    isScroll: true,
    color: 1,
    showModal: false,
    showShadow: false,
    time_format: [],
    checkIndex: 0,
    remarks: '',
    orderinfo: {},
    submitGoods: {}
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      var submitGoods, orderinfo, shop_time, order_time;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('-1-1-1-1-1-11-', wx.getStorageSync('submitGoods'));
              _context.prev = 1;
              _context.next = 4;
              return this.clearCache('remarks');

            case 4:
              // 先清除备注缓存
              submitGoods = JSON.parse(wx.getStorageSync('submitGoods') || '{}');
              orderinfo = JSON.parse(wx.getStorageSync('orderinfo') || '{}');
              console.log('orderinfo', orderinfo);
              this.setData({
                submitGoods: submitGoods,
                orderinfo: orderinfo
              });
              shop_time = submitGoods.shopinfo.shop_time;
              order_time = orderinfo.songdatime;
              this.handlerTime(order_time, shop_time);
              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](1);
              console.log('shopDetail onload  error', _context.t0);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 13]]);
    }));

    function onLoad(_x) {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  onShow: function onShow() {
    console.log(' on show -------------------------------', wx.getStorageSync('remarks'));

    var _JSON$parse = JSON.parse(wx.getStorageSync('remarks') || '{}'),
        remarks = _JSON$parse.remarks;

    if (remarks) {
      this.setData({
        remarks: remarks
      });
    }
  },
  handlerTime: function handlerTime() {
    var _this$setData;

    var order_time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var shop_time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0-24';

    var _shop_time$split = shop_time.split('-'),
        _shop_time$split2 = _slicedToArray(_shop_time$split, 2),
        startTime = _shop_time$split2[0],
        endTime = _shop_time$split2[1];

    console.log('order_time', order_time);
    var orderTime = new Date(order_time * 1000); // 服务器时间是以秒为单位，换算为毫秒
    // let orderTime = new Date(); // 服务器时间是以秒为单位，换算为毫秒

    console.log('orderTime', orderTime, orderTime.getHours());
    var orderHour = parseFloat(orderTime.getHours());
    var t = endTime - orderHour; // 剩余时间 h

    var hours = [];
    var days = [];
    t = t * 60; // 换算成分钟
    // 第一次 耗时15分钟（此处为后端换算后返回前端，所以前端无需再算），
    // 往后推每次增加30分钟， 直到打烊为止。

    for (var i = 0; i < t; i += 30) {
      var d = orderTime.addTime('n', i);

      if (parseInt(endTime) > d.getHours()) {
        if (i === 0) {
          hours.push({
            time: parseInt(d.getTime() / 1000),
            // 换算成秒
            str: "\u5C3D\u5FEB\u9001\u8FBE(".concat(add0(d.getHours() + ''), ":").concat(add0(d.getMinutes() + ''), ")\u5DE6\u53F3")
          });
        } else {
          hours.push({
            time: parseInt(d.getTime() / 1000),
            // 换算成秒
            str: "".concat(add0(d.getHours() + ''), ":").concat(add0(d.getMinutes() + ''))
          });
        }
      }
    }

    console.log('hours', hours);
    days.push(orderTime.day_mow()); // 目前只需要当天的

    this.setData((_this$setData = {}, _defineProperty(_this$setData, 'time_format.hours', hours), _defineProperty(_this$setData, 'time_format.days', days), _this$setData)); // 补0

    function add0(n) {
      if (n.length === 1) {
        return '0' + n;
      } else if (n.length === 2) {
        return n;
      }
    }
  },
  goShopCarList: function () {
    var _goShopCarList = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return this.clearCache('carList');

            case 3:
              wx.navigateTo({
                url: '/pages/shopCarList/shopCarList'
              });
              _context2.next = 9;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.log('goShopCarList error', _context2.t0);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 6]]);
    }));

    function goShopCarList() {
      return _goShopCarList.apply(this, arguments);
    }

    return goShopCarList;
  }(),
  goRemarks: function () {
    var _goRemarks = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              wx.navigateTo({
                url: '/pages/shopRemarks/shopRemarks'
              });

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function goRemarks() {
      return _goRemarks.apply(this, arguments);
    }

    return goRemarks;
  }(),
  checkOne: function checkOne(event) {
    var _event$currentTarget$ = event.currentTarget.dataset,
        _event$currentTarget$2 = _event$currentTarget$.time,
        time = _event$currentTarget$2 === void 0 ? '00:00' : _event$currentTarget$2,
        _event$currentTarget$3 = _event$currentTarget$.index,
        index = _event$currentTarget$3 === void 0 ? 0 : _event$currentTarget$3;
    this.setData({
      nowTime: time,
      checkIndex: index
    });
  },
  goShopSuccess: function () {
    var _goShopSuccess = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var _this = this;

      var _this$data, time_format, checkIndex, submitGoods, orderinfo, songdatime, res;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              if (!this.submited) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt("return");

            case 3:
              this.submited = true;
              _this$data = this.data, time_format = _this$data.time_format, checkIndex = _this$data.checkIndex, submitGoods = _this$data.submitGoods, orderinfo = _this$data.orderinfo;
              console.log('time_format.hours[checkIndex]', time_format.hours[checkIndex]);
              songdatime = time_format.hours[checkIndex] && time_format.hours[checkIndex].time || orderinfo.songdatime;
              _context4.next = 9;
              return app.Util.turn2Promise(wx.login);

            case 9:
              res = _context4.sent;

              if (res.code) {
                app.$http.request('/consumer/orderpay', {
                  orderinfo: JSON.stringify(orderinfo),
                  note_str: JSON.stringify({
                    note: this.data.remarks,
                    songdatime: songdatime
                  }),
                  userinfo: JSON.stringify(submitGoods.userinfo),
                  shopinfo: JSON.stringify(submitGoods.shopinfo),
                  code: res.code
                }, 'post').then(function (res) {
                  console.log('shop detail submit ', res);

                  if (res.jsapi) {
                    var params = JSON.parse(res.jsapi);
                    console.log('------', {
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
                        wx.redirectTo({
                          url: "/pages/shopSuccess/shopSuccess?orderid=".concat(res.order_id),
                          complete: function complete() {
                            _this.submited = false;
                          }
                        });
                      },
                      fail: function fail(error) {
                        _this.submited = false; // 如果不是用户主动触发取消按钮失败的

                        if (error.errMsg !== 'requestPayment:fail cancel') {
                          wx.showToast({
                            title: '交易失败',
                            icon: 'none'
                          });
                        }

                        console.log('requestPayment fail', error);
                      }
                    });
                  } else {
                    _this.submited = false;
                    console.log('/consumer/orderpay error jsapi is not defined');
                    wx.showToast({
                      title: '请求失败',
                      icon: 'none'
                    });
                  }
                });
              }

              _context4.next = 17;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](0);
              this.submited = false;
              console.log('goShopSuccess error', _context4.t0);

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 13]]);
    }));

    function goShopSuccess() {
      return _goShopSuccess.apply(this, arguments);
    }

    return goShopSuccess;
  }(),
  clearCache: function clearCache(key) {
    return new Promise(function (res, rej) {
      wx.setStorage({
        key: key,
        data: JSON.stringify({}),
        success: function success() {
          res();
        },
        fail: function fail(err) {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          });
          rej(err);
        }
      });
    });
  },
  setCache: function setCache(key) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (res, rej) {
      wx.setStorage({
        key: key,
        data: JSON.stringify(data),
        success: function success() {
          res();
        },
        fail: function fail(err) {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          });
          rej(err);
        }
      });
    });
  },
  checkTime: function checkTime() {
    this.setData({
      showModal: !this.data.showModal
    });
  },
  closeModal: function closeModal() {
    this.setData({
      showModal: !this.data.showModal
    });
  },
  getindexList: function getindexList() {
    var _this2 = this;

    app.$http.request('/consumer/index', {}, 'post').then(function (val) {
      _this2._formatListData(val.goodsInfo.info);

      _this2.setData({
        dataInfo: val,
        layout: val.themeInfo.layout,
        color: val.themeInfo.color
      });

      wx.setStorageSync('color', val.themeInfo.color);

      if (wx.getStorageSync('avatar')) {
        _this2.setData({
          myAvatar: wx.getStorageSync('avatar')
        });
      } else {
        _this2.setData({
          myAvatar: _this2.data.dataInfo.userInfo.headimg
        });

        wx.setStorageSync('avatar', _this2.data.dataInfo.userInfo.headimg);
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