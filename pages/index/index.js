var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = getApp();
Page({
  data: {
    myInfo: {},
    color: 1,
    myAvatar: '',
    showBack: false,
    ifNoPms: false,
    phone: ''
  },
  ready: function ready() {
    console.log('ready');
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      var _this = this;

      var self, showBack, navigatStack;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('index onload', options);
              self = this;
              showBack = false; //   this.setData({color:wx.getStorageSync('color')})
              // wx.setStorageSync('shop_id', '');
              // wx.setStorageSync('door_number', '');

              _context.next = 5;
              return this.getVerify();

            case 5:
              app.$http.request('/consumer/info', {}, 'post').then(function (val) {
                _this.setData({
                  myInfo: val
                });

                if (wx.getStorageSync('avatar')) {
                  _this.setData({
                    myAvatar: wx.getStorageSync('avatar')
                  });
                } else {
                  _this.setData({
                    myAvatar: _this.data.myInfo.headimg
                  });

                  wx.setStorageSync('avatar', _this.data.myInfo.headimg);
                }
              }); // 如果是navigateTo过来的，就显示后退按钮

              navigatStack = getCurrentPages();

              if (navigatStack.length > 1) {
                showBack = true;
              }

              this.setData({
                showBack: showBack,
                height: app.globalData.height
              });

            case 9:
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
  onShow: function onShow() {},
  onHide: function onHide() {},
  getPhoneNumber: function () {
    var _getPhoneNumber = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(e) {
      var code, val;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log(e.detail.errMsg);
              console.log(e.detail.iv);
              console.log(e.detail.encryptedData);

              if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                _context2.next = 6;
                break;
              }

              wx.showToast({
                title: '授权失败',
                icon: 'none'
              });
              return _context2.abrupt("return");

            case 6:
              code = this.code; // let code = await app.Util.getCode();

              if (!code) {
                _context2.next = 14;
                break;
              }

              _context2.next = 10;
              return app.$http.request('/consumer/authmobile', {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                code: code
              }, 'post');

            case 10:
              val = _context2.sent;

              if (val) {
                this.setData({
                  phone: val
                });
                wx.showToast({
                  title: '授权成功'
                });
              } else {
                wx.showToast({
                  title: '手机号获取失败',
                  icon: 'none'
                });
              }

              _context2.next = 15;
              break;

            case 14:
              wx.showToast({
                title: 'code获取失败',
                icon: 'none'
              });

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getPhoneNumber(_x2) {
      return _getPhoneNumber.apply(this, arguments);
    }

    return getPhoneNumber;
  }(),
  jump: function jump(event) {
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/' + url + '/' + url
    });
  },
  // getColor: function () {
  // 	app.$http.request('/consumer/index', {}, 'post').then(val => {
  // 		this.setData({
  // 			color: val.themeInfo.color
  // 		})
  // 		wx.setStorageSync('color', val.themeInfo.color)
  // 	})
  // },
  scan: function scan(event) {
    var self = this;
    wx.scanCode({
      success: function () {
        var _success = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3(res) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  console.log('res---', res);
                  _context3.next = 3;
                  return self.getVerify(res.result);

                case 3:
                  if (!(res.result.indexOf('/t/') > -1)) {
                    _context3.next = 10;
                    break;
                  }

                  if (wx.getStorageSync('sn')) {
                    _context3.next = 7;
                    break;
                  }

                  wx.showToast({
                    title: '请扫描正确的货柜机二维码',
                    icon: 'none'
                  });
                  return _context3.abrupt("return");

                case 7:
                  wx.navigateTo({
                    url: '/pages/main/main'
                  });
                  _context3.next = 11;
                  break;

                case 10:
                  if (res.result.indexOf('/tw/') > -1) {
                    wx.navigateTo({
                      url: '/pages/shop/shop?q=' + res.result
                    });
                  } else {
                    wx.showToast({
                      title: '请扫描正确的二维码',
                      icon: 'none'
                    });
                  }

                case 11:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function success(_x3) {
          return _success.apply(this, arguments);
        }

        return success;
      }(),
      fail: function fail() {
        wx.hideLoading();
      }
    });
  },
  goBack: function goBack() {
    wx.navigateBack();
  },
  getVerify: function () {
    var _getVerify = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(qr) {
      var res, val;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return app.Util.turn2Promise(wx.login);

            case 2:
              res = _context4.sent;

              if (!res.code) {
                _context4.next = 14;
                break;
              }

              _context4.next = 6;
              return app.$http.request('/consumer/init', {
                code: res.code,
                qr: qr
              }, 'post');

            case 6:
              val = _context4.sent;
              console.log('val ', val);
              this.code = res.code; // if(!wx.getStorageSync('sn')){

              wx.setStorageSync('sn', val.sn);
              wx.setStorageSync('sid', val.sid); // }

              wx.setStorageSync('openid', val.openid);
              _context4.next = 15;
              break;

            case 14:
              wx.showToast({
                title: 'code获取失败',
                icon: 'none'
              });

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getVerify(_x4) {
      return _getVerify.apply(this, arguments);
    }

    return getVerify;
  }()
});