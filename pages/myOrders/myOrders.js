var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = getApp();
Page({
  data: {
    showNetError: false,
    toView: '',
    scrollTop: 100,
    orderList: [],
    old_orderList: [],
    loadingComplete: false,
    lastId: 0,
    currentPage: 0,
    statusBarHeight: 0,
    titleBarHeight: 46,
    navTop: 0,
    wrapTop: 0,
    showLoadingText: false
  },
  onReady: function onReady() {
    console.log('on ready -----');
    var navTop = 80; //rpx
    // 将navbar的头部高度获取功能移入这里，因为需要用到高度
    // 因为每个页面都需要用到这连个字段，所以放到全局对象中

    var that = this;
    wx.getSystemInfo({
      success: function success(res) {
        if (!app.globalData) {
          app.globalData = {};
        }

        if (res.model.indexOf('iPhone') !== -1) {
          app.globalData.titleBarHeight = 44;
        } else {
          app.globalData.titleBarHeight = 48;
        }

        console.log(' res.windowWidth', res.windowWidth);
        var percent = res.windowWidth / 750;
        console.log(' percent', percent, Number(navTop * percent));
        that.setData({
          wrapTop: Number(navTop * percent),
          navTop: app.globalData.titleBarHeight + res.statusBarHeight
        });
      },
      failure: function failure() {
        that.setData({
          statusBarHeight: 0,
          titleBarHeight: 0
        });
      }
    });
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              this.setData({
                orderList: []
              });
              _context.next = 4;
              return this.fetchOrderList();

            case 4:
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              console.log('error', _context.t0);
              this.setData({
                showNetError: true
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 6]]);
    }));

    function onLoad(_x) {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  // onShow: function () {
  // 	try{
  // 		this.setData({orderList:[]})
  // 		this.fetchOrderList(0)
  // 	}catch(err){
  // 		this.setData({showNetError:true})
  // 	}
  // },
  onHide: function onHide() {},
  deleteGoods: function deleteGoods(event) {
    var orderId = event.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该订单？',
      confirmText: '确定',
      success: function success(res) {
        if (res.confirm) {
          app.$http.request('/consumer/delorder', {
            orderId: orderId
          }, 'post').then(function (val) {
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            });
            self.setData({
              orderList: [],
              loadingComplete: false
            });
            self.fetchOrderList();
          });
        } else if (res.cancel) {}
      }
    });
  },
  goBuy: function goBuy() {
    if (!wx.getStorageSync('sn')) {
      wx.showToast({
        title: '购买请先返回首页扫描货柜码',
        icon: 'none',
        success: function success() {
          wx.navigateTo({
            url: '/pages/index/index'
          });
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/main/main'
      });
    }
  },
  refresh: function refresh() {
    wx.redirectTo({
      url: '/pages/myOrders/myOrders'
    });
  },
  //	下拉刷新
  onPullDownRefresh: function onPullDownRefresh() {
    if (!this.fetchStart) {
      this.fetchOrderList({
        isRefresh: true
      });
    }
  },
  // 上拉加载
  onReachBottom: function onReachBottom() {
    var _this = this;

    if (!this.fetchStart && this.data.orderList.length > 0) {
      console.log('onReachBottom');
      this.setData({
        showLoadingText: this.data.loadingComplete ? false : true
      }, function () {
        //setData引起的界面更新渲染完毕后的回调函数
        console.log('success');
        var lastId = _this.data.orderList[_this.data.orderList.length - 1].id;

        _this.fetchOrderList({
          lastId: lastId,
          isRefresh: true
        });
      });
    }
  },

  /**
   *
   * @param {String} id 传入的数组最后一个元素id，不传则请求当前列表，传则请求后续列表
   * @param {Boolean} isRefresh 是否为手动刷新
   */
  fetchOrderList: function () {
    var _fetchOrderList = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var param,
          _param$lastId,
          id,
          _param$isRefresh,
          isRefresh,
          val,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              param = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              _param$lastId = param.lastId, id = _param$lastId === void 0 ? '' : _param$lastId, _param$isRefresh = param.isRefresh, isRefresh = _param$isRefresh === void 0 ? false : _param$isRefresh;
              _context2.prev = 2;
              this.fetchStart = true;
              _context2.next = 6;
              return app.$http.request('/consumer/orderlist', {
                lastId: id
              }, 'post');

            case 6:
              val = _context2.sent;
              this.fetchStart = false; // 隐藏导航栏加载框

              wx.hideNavigationBarLoading(); // 停止下拉动作

              wx.stopPullDownRefresh();

              if (!(val.length === 0)) {
                _context2.next = 13;
                break;
              }

              // 当手动刷新没数据时才会显示 “数据加载完毕”
              this.setData({
                loadingComplete: isRefresh && true,
                showLoadingText: false
              });
              return _context2.abrupt("return");

            case 13:
              this._formatListData(val);

              console.log('val', val, 'id', id);

              if (!id) {
                this.setData({
                  loadingComplete: false,
                  orderList: val
                });
              } else {
                this.setData({
                  loadingComplete: false,
                  orderList: [].concat(_toConsumableArray(this.data.orderList), _toConsumableArray(val))
                });
              }

              this.setData({
                showLoadingText: false
              });
              _context2.next = 27;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](2);
              this.fetchStart = false; // 隐藏导航栏加载框

              wx.hideNavigationBarLoading(); // 停止下拉动作

              wx.stopPullDownRefresh();
              wx.showToast({
                title: '获取列表失败' + JSON.stringify(_context2.t0),
                icon: 'none'
              });
              this.setData({
                showLoadingText: false,
                loadingComplete: false
              });
              console.log(_context2.t0);

            case 27:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[2, 19]]);
    }));

    function fetchOrderList() {
      return _fetchOrderList.apply(this, arguments);
    }

    return fetchOrderList;
  }(),
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
  goShopOrderList: function () {
    var _goShopOrderList = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(e) {
      var index;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              index = e.currentTarget.dataset.index;
              console.log();
              _context3.next = 5;
              return this.setCache('order_shop_list', '');

            case 5:
              _context3.next = 7;
              return this.setCache('order_shop_list', this.data.orderList[index].goods_info);

            case 7:
              wx.navigateTo({
                url: '/pages/shopOrderList/shopOrderList'
              });
              _context3.next = 13;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](0);
              console.log('goShopCarList error', _context3.t0);

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 10]]);
    }));

    function goShopOrderList(_x2) {
      return _goShopOrderList.apply(this, arguments);
    }

    return goShopOrderList;
  }(),
  _formatListData: function _formatListData(list) {
    // 这么写也能修改原数组，因为对象数组中的对象是引用类型，两者指向同一个堆内存
    return list.map(function (item) {
      item.goods_info = JSON.parse(item.goods_info);
      item.moneyInt = '￥' + item.pay_price.split('.')[0] + '.';
      item.moneyCharge = item.pay_price.split('.')[1];
      return item;
    });
  },
  allOrder: function allOrder() {
    var currentPage = this.data.currentPage;

    if (currentPage !== 0) {
      this.setData({
        currentPage: 0,
        // orderList: this.old_orderList || [],
        loadingComplete: false
      });
    }
  },
  ingOrder: function ingOrder() {
    var _this$data = this.data,
        currentPage = _this$data.currentPage,
        orderList = _this$data.orderList;

    if (currentPage !== 1) {
      // this.old_orderList = orderList;
      // let newOrderList = orderList.filter((order) => {
      //     return order.order_type === '5' || order.order_type === '6' || order.order_type === '7';
      // });
      // console.log('orderList', newOrderList);
      this.setData({
        currentPage: 1,
        // orderList: newOrderList,
        loadingComplete: false
      });
    }
  },
  // 查看详情
  scanDetail: function scanDetail(event) {
    console.log('event.currentTarget.dataset', event.currentTarget.dataset);
    var _event$currentTarget$ = event.currentTarget.dataset,
        id = _event$currentTarget$.id,
        orderType = _event$currentTarget$.orderType; // let id = event.currentTarget.dataset.id;

    if (orderType === '3') {
      wx.navigateTo({
        url: '/pages/shopSuccess/shopSuccess?orderId=' + id
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + id
    });
  },
  goBack: function goBack() {
    wx.navigateBack();
  }
});