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
    color: 1,
    remarks: '',
    loadMore: false,
    orderInfo: {},
    ordertime: '00:00',
    songdatime: '00:00',
    shop_service_phone: ''
  },

  /**
   * 
   * @param {String} orderid 传入的orderid 
   * @param {String} from 从哪个页面过来的 暂时用不着，怕增加新的中间页，到时候使用
   */
  onLoad: function onLoad(_ref) {
    var _this = this;

    var _ref$orderid = _ref.orderid,
        orderid = _ref$orderid === void 0 ? '' : _ref$orderid,
        _ref$from = _ref.from,
        from = _ref$from === void 0 ? 'shopDetail' : _ref$from;

    try {
      var _JSON$parse = JSON.parse(wx.getStorageSync('remarks') || '{}'),
          _JSON$parse$remarks = _JSON$parse.remarks,
          remarks = _JSON$parse$remarks === void 0 ? '' : _JSON$parse$remarks;

      var submitGoods = JSON.parse(wx.getStorageSync('submitGoods'));
      console.log('remarks', JSON.parse(wx.getStorageSync('submitGoods')));
      console.log('options', orderid); // submitGoods['menu_detail'] = [...submitGoods['menu_detail'], ...submitGoods['menu_detail'], ...submitGoods['menu_detail'], ...submitGoods['menu_detail']];

      if (!orderid) {
        wx.showToast({
          title: '订单号为空',
          icon: 'none'
        });
        return;
      }

      app.$http.request("/consumer/paysuccess?orderid=".concat(orderid), {}).then(function (res) {
        console.log('res--->', JSON.parse(res));

        if (res) {
          res = JSON.parse(res);
          res['goodsinfo'] = JSON.parse(res['goodsinfo']);
          console.log("res['goodsinfo']", res);

          _this.setData({
            remarks: remarks,
            submitGoods: submitGoods,
            orderInfo: res,
            order_status_str: _this.orderStatusHandler(res.order_status),
            order_status: res.order_status,
            pay_type: _this.payTypeHandler(res.$pay_type),
            songdatime: new Date(res.songdatime * 1000).Format('hh:mm'),
            ordertime: new Date(parseInt(res.createtime) * 1000).Format('yyyy-MM-dd hh:mm:ss'),
            shop_service_phone: res.shop_service_phone
          });
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      });
    } catch (error) {
      console.log('shopDetail onload  error', error);
    }
  },
  payTypeHandler: function payTypeHandler(type) {
    if (type === '1') {
      return '微信支付';
    }
  },
  orderStatusHandler: function orderStatusHandler(order_status) {
    if (order_status === '5') {
      return '已接单待配送';
    } else if (order_status === '6') {
      return '配送中';
    } else if (order_status === '7') {
      return '已完成';
    } else if (order_status === '0') {
      return '待支付';
    }
  },
  callSomeOne: function callSomeOne(e) {
    console.log(e);
    var phoneNumber = e.currentTarget.dataset.phone; // const { phoneNumber } = this.data;

    if (!phoneNumber) {
      wx.showToast({
        title: '号码为空',
        icon: 'none'
      });
      return;
    }

    try {
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
        success: function success(data) {
          console.log(data);
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  goShop: function goShop() {
    wx.reLaunch({
      url: '/pages/shop/shop'
    });
  },
  // onShow: function () {
  // 	this.getindexList()
  // },
  onUnload: function () {
    var _onUnload = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.clearCache('carList');

            case 2:
              _context.next = 4;
              return this.clearCache('orderinfo');

            case 4:
              _context.next = 6;
              return this.clearCache('submitGoods');

            case 6:
              _context.next = 8;
              return this.clearCache('orderGoods');

            case 8:
              console.log('on unload');

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onUnload() {
      return _onUnload.apply(this, arguments);
    }

    return onUnload;
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
  goBack: function goBack() {
    wx.navigateBack();
  },
  copy: function copy(event) {
    var data = event.currentTarget.dataset.txt + '';
    console.log('copy', data);
    wx.setClipboardData({
      data: data
    });
  },
  goConsult: function goConsult() {
    wx.navigateTo({
      url: '/pages/consult/consult'
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
  loadMoreFoods: function loadMoreFoods() {
    this.setData({
      loadMore: !this.data.loadMore
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