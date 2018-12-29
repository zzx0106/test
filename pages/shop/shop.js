var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = getApp();

var Util = require('../../common/js/util');

Page({
  data: {
    dataInfo: {},
    layout: null,
    myAvatar: '',
    canScroll: false,
    TopId: '',
    color: 1,
    isIOS: false,
    phoneNumber: '19806713810',
    scrollTop: 0,
    goodsList: [],
    nowIndex: 0,
    checkedGoods: [],
    openModal: false,
    showShadow: false,
    anima_drawer: {},
    // 抽屉效果动画
    anima_opacity: {} // 渐变

  },
  onPageScroll: function onPageScroll(e) {
    console.log('----------', e);
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(options) {
      var _this = this;

      var shop_car;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.getVerify('https://b.cmfspay.com/t/Zur');

            case 2:
              // if (options && options.q) {
              //     wx.showLoading();
              //     let qr = decodeURIComponent(options.q);
              //     await this.getVerify(qr);
              //     console.log('q', qr);
              // }
              // if (!wx.getStorageSync('sn')) {
              //     wx.redirectTo('/pages/index/index');
              //     return;
              // }
              shop_car = wx.getStorageSync('orderGoods') || '[]';
              shop_car = JSON.parse(shop_car);
              this.setData({
                myAvatar: wx.getStorageSync('avatar')
              });
              app.$http.request('/consumer/waimaiindex', {
                suid: '2'
              }, 'post').then(function (res) {
                console.log('get all list ', JSON.parse(res));
                var res_data = JSON.parse(res);
                var goods_list = res_data.menu_detail || []; //     // 同步缓存购物车到请求的数据中

                if (shop_car.length > 0) {
                  goods_list.map(function (goods) {
                    goods.foods = goods.foods.map(function (food) {
                      shop_car.forEach(function (c_food, index) {
                        if (c_food.id === food.id) {
                          food.num = c_food.num;
                        }
                      });
                      return food;
                    });
                    goods = goods;
                  });
                } // left 置顶


                console.log(' goods_list[0].id', res_data);

                _this.setData({
                  shopinfo: res_data.shopinfo,
                  userinfo: res_data.userinfo,
                  goodsList: goods_list,
                  curNav: goods_list.length > 0 ? goods_list[0].category : ''
                });

                _this.initScroll();
              });

            case 6:
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
  onReady: function onReady() {},
  onShow: function onShow() {
    this.submited = false;

    try {
      this.animation_drawer = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      });
      this.animation_opacity = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      });
      console.log('this.', this.data.checkedGoods);
    } catch (error) {
      console.log(error);
    }
  },
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
                wx.setStorageSync('sn', '40007000000017'); // wx.setStorageSync('sn', val.sn);
                // }

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
  goIndexPage: function goIndexPage() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
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
  addGoods: function addGoods(e) {
    console.log('e.currentTarget.dataset', e.currentTarget.dataset);
    var _e$currentTarget$data = e.currentTarget.dataset,
        food = _e$currentTarget$data.food,
        classifyIndex = _e$currentTarget$data.classifyIndex,
        goodsIndex = _e$currentTarget$data.goodsIndex;
    var goodsList = this.data.goodsList;
    var goods = goodsList[classifyIndex].foods[goodsIndex];

    var _key = "goodsList[".concat(classifyIndex, "].foods[").concat(goodsIndex, "].num");

    console.log('goods----', goodsList[classifyIndex], goodsList[classifyIndex].foods);
    console.log('_key----', _key);

    if (!goods.num) {
      this.setData(_defineProperty({}, _key, 1));
    } else {
      this.setData(_defineProperty({}, _key, goods.num + 1));
    }

    this.saveCache();
  },
  removeGoods: function removeGoods(e) {
    var _e$currentTarget$data2 = e.currentTarget.dataset,
        classifyIndex = _e$currentTarget$data2.classifyIndex,
        goodsIndex = _e$currentTarget$data2.goodsIndex;
    var goodsList = this.data.goodsList;
    var goods = goodsList[classifyIndex].foods[goodsIndex];

    var _key = "goodsList[".concat(classifyIndex, "].foods[").concat(goodsIndex, "].num");

    if (goods.num && goods.num > 0) {
      this.setData(_defineProperty({}, _key, goods.num - 1));
    }

    this.saveCache();
  },

  /**
   * 清空购物车
   * 遍历goods对象，得到相关索引值，并使用setData逐个设置count为0
   */
  clearCar: function () {
    var _clearCar = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var _this2 = this;

      var goodsList;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              goodsList = this.data.goodsList; // wx.showLoading({ title: '清空购物车...' });

              console.log('goodsList', goodsList);
              _context3.next = 5;
              return this.clearCache('orderGoods');

            case 5:
              goodsList.forEach(function (item, cidx) {
                item.foods.forEach(function (food, fidx) {
                  var _key = "goodsList[".concat(cidx, "].foods[").concat(fidx, "].num");

                  _this2.setData(_defineProperty({}, _key, 0));
                });
              }); // wx.hideLoading();

              _context3.next = 11;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](0);
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              });

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 8]]);
    }));

    function clearCar() {
      return _clearCar.apply(this, arguments);
    }

    return clearCar;
  }(),

  /**
   * 提交订单
   */
  submitOrder: function () {
    var _submitOrder = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var _this3 = this;

      var car, goodsList, userinfo, menu_detail, target_data;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              console.log('this.submited', this.submited);

              if (!this.submited) {
                _context5.next = 3;
                break;
              }

              return _context5.abrupt("return");

            case 3:
              this.submited = true;
              _context5.prev = 4;
              _context5.next = 7;
              return this.saveCache();

            case 7:
              car = _context5.sent;

              if (!(car.length === 0)) {
                _context5.next = 12;
                break;
              }

              wx.showToast({
                title: '请选择商品',
                icon: 'none'
              });
              this.submited = false;
              return _context5.abrupt("return");

            case 12:
              // 这样做 === deep clone对象，避免污染源对象
              goodsList = JSON.parse(JSON.stringify(this.data.goodsList));
              userinfo = JSON.parse(JSON.stringify(this.data.userinfo));
              userinfo['total_price'] = this.totalGoodsList().totalMoney; // 应后台需求，这里过滤掉所有没有num的数组元素

              menu_detail = goodsList.map(function (goods) {
                goods['foods'] = goods['foods'].filter(function (food) {
                  return !!food.num;
                });
                return goods;
              });
              target_data = {
                userinfo: userinfo,
                shopinfo: this.data.shopinfo,
                menu_detail: menu_detail
              };
              console.log('target_data', target_data);
              app.$http.request('/consumer/submitorder', {
                // 序列化为了后台能获取到对象类型数据
                userinfo: JSON.stringify(target_data.userinfo),
                shopinfo: JSON.stringify(target_data.shopinfo),
                menu_detail: JSON.stringify(target_data.menu_detail)
              }, 'post').then(
              /*#__PURE__*/
              function () {
                var _ref2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee4(res) {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          console.log('res------------------------', res.orderinfo);
                          res = JSON.parse(res); // 判断orderinfo里面是否有参数

                          if (!(Object.keys(res.orderinfo).length > 0)) {
                            _context4.next = 15;
                            break;
                          }

                          res['orderinfo']['songdatime'] = res['songdatime']; // 将songdatime字段合入orderinfo中传递

                          _context4.next = 6;
                          return _this3.setCache('submitGoods', target_data);

                        case 6:
                          _context4.next = 8;
                          return _this3.clearCache('orderinfo');

                        case 8:
                          _context4.next = 10;
                          return _this3.setCache('orderinfo', res.orderinfo);

                        case 10:
                          _context4.next = 12;
                          return _this3.clearCache('remarks');

                        case 12:
                          // 在进入前，清除备注缓存
                          // TODO 这里需要鉴定是否存在用户手机号码
                          wx.navigateTo({
                            url: '/pages/shopDetail/shopDetail',
                            complete: function complete() {
                              _this3.submited = false;
                            }
                          });
                          _context4.next = 18;
                          break;

                        case 15:
                          _this3.submited = false;
                          wx.showToast({
                            title: '请求失败',
                            icon: 'none'
                          });
                          return _context4.abrupt("return");

                        case 18:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4, this);
                }));

                return function (_x4) {
                  return _ref2.apply(this, arguments);
                };
              }()).catch(function (err) {
                _this3.submited = false;
              });
              _context5.next = 26;
              break;

            case 21:
              _context5.prev = 21;
              _context5.t0 = _context5["catch"](4);
              console.log(_context5.t0);
              this.submited = false;
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              });

            case 26:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[4, 21]]);
    }));

    function submitOrder() {
      return _submitOrder.apply(this, arguments);
    }

    return submitOrder;
  }(),
  totalGoodsList: function totalGoodsList() {
    var goodsList = this.data.goodsList;
    var totalNumber = 0;
    var totalMoney = 0;
    goodsList.forEach(function (goods, index) {
      goods.foods.forEach(function (food, _index) {
        if (food.num) {
          totalNumber += food.num;
          totalMoney += food.num * food.price;
        }
      });
    });
    return {
      totalNumber: totalNumber,
      totalMoney: totalMoney
    };
  },
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

  /**
   * 单独对goodsList做缓存处理
   */
  saveCache: function saveCache() {
    var _this4 = this;

    return new Promise(function (res, rej) {
      var _submitGoods = [];

      _this4.data.goodsList.forEach(function (goods, cidx) {
        goods.foods.forEach(function (food, fidx) {
          if (food.num) {
            _submitGoods.push(food);
          }
        });
      });

      wx.setStorage({
        key: 'orderGoods',
        data: JSON.stringify(_submitGoods),
        success: function success() {
          res(_submitGoods); // wx.navigateTo({
          //     url: '/pages/cart/orderSubmit/orderSubmit',
          // });
        },
        fail: function fail(err) {
          rej(err);
        }
      });
    });
  },

  /**
   *
   * @param {String} key 存储的key
   * @param {Object} data 存储的数据
   */
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
  showShopList: function showShopList() {
    var _this5 = this;

    // 注(新): 动画效果可使用css3实现，js只是其中一种方式，建议css3
    var duration = 300; // 300毫秒的动画延迟
    // 该操作的作用，因为动画函数无法移除元素，所以：
    // 关闭时 给shadow框300延迟，等待执行完动画再关闭
    // 开启时立即显示shadow框，并执行动画

    if (this.data.openModal) {
      setTimeout(function () {
        _this5.setData({
          showShadow: !_this5.data.showShadow
        });
      }, duration);
    } else {
      this.setData({
        showShadow: !this.data.showShadow
      });
    }

    if (!this.data.openModal) {
      this.animation_drawer.bottom('0rpx').step({
        duration: duration
      });
      this.animation_opacity.opacity(1).step({
        duration: duration
      });
    } else {
      this.animation_drawer.bottom('-600rpx').step({
        duration: duration
      });
      this.animation_opacity.opacity(0).step({
        duration: duration
      });
    }

    this.setData({
      anima_drawer: this.animation_drawer.export(),
      anima_opacity: this.animation_opacity.export(),
      openModal: !this.data.openModal
    });
  },
  initScroll: function initScroll() {
    var _this6 = this;

    var that = this; // 定义右侧标题的 rpx 高度

    var right_titleRpxHeight = 40; // 定义右侧单个商品的 rpx 高度

    var right_contentRpxHeight = 186; // 定义左侧单个tab的 rpx 高度

    var left_titleRpxHeight = 100; //  获取可视区屏幕高度

    wx.getSystemInfo({
      success: function success(res) {
        // percent 为当前设备1rpx对应的px值
        console.log('res.windowWidth', res, res.windowWidth);
        var percent = res.windowWidth / 750;
        console.log('-==-====-=-==-', right_titleRpxHeight * percent);
        that.setData({
          winHeight: res.windowHeight,
          right_titleHeight: Number(right_titleRpxHeight * percent),
          right_contentHeight: Number(right_contentRpxHeight * percent),
          left_titleHeight: Number(left_titleRpxHeight * percent)
        });
      }
    }); // 把请求到的 list 中的数据赋值给  listChild1

    var goodsList = this.data.goodsList; // 定义一个 names ，用于存放 scroll-into-view 使用的 id

    var names = '';
    var goodsIds = [];
    var goodsHeights = [];
    console.log('listChild1', goodsList);
    this.wrapMenuHeight = goodsList.length * this.data.left_titleHeight;
    console.log(' this.wrapMenuHeight', this.data.right_contentHeight); // 循环 listChild1 中的每一项

    goodsList.forEach(function (good) {
      goodsIds.push(good.id);
      var height = good.foods.length * _this6.data.right_contentHeight + _this6.data.right_titleHeight - 5;
      goodsHeights.push(height);
    });
    this.oldPosition = 0;
    this.oldT = new Date().getTime();
    this.goodsIds = goodsIds;
    this.goodsHeights = goodsHeights;
  },

  /**
   * 当最外层滑动到底部时触发
   */
  isBoxScrollBottom: function isBoxScrollBottom(e) {
    // 滑动到底部时，此时能够让列表页滑动
    this.setData({
      canScroll: true
    }); // 得到最大的滑动距离，也就是父级滑动到底部时距离顶部的距离

    this.max = this.boxScrollTop;
    console.log('is Bottom ooooooooooooooo', this.boxScrollTop);
  },
  boxScroll: function boxScroll(e) {
    this.boxScrollTop = e.detail.scrollTop;
    console.log('----ss-s-s-', this.max, this.max && this.max > e.detail.scrollTop); // 当max最大滑动距离存在，且 此时滑动的距离小于最大滑动距离
    // 就是顶部需要隐藏的那一部分如果出来了，那么就canDown触发隐藏

    if (this.max && this.max > e.detail.scrollTop) {
      this.canDown = true;
    } else {
      this.canDown = false;
    }
  },
  scroll: function scroll(event) {
    var _this7 = this;

    this.nowT = new Date().getTime();

    if (this.nowT - this.oldT > 1000 / 60) {
      // wait 进行隐藏动画时所需要的时间，这里假设800ms，因为在进行动画时触发setData更新视图，会让动画中断
      // canDown 是否能进行隐藏头部的功能
      // this.oldPosition - event.detail.scrollTop < 0 此时在做向下滑动的操作
      if (!this.wait && this.canDown && this.oldPosition - event.detail.scrollTop < 0) {
        this.setData({
          TopId: 'top'
        }); // 滚动至顶部

        this.wait = true; // 此时开始进行滚动动画，限制触发setData

        setTimeout(function () {
          _this7.wait = false; // 动画进行结束，可以再次触发setData
        }, 800);
      }

      this.oldPosition = event.detail.scrollTop;
      this.oldT = this.nowT;
      this.scrollHandler(event); // this.setData({
      //     num: event.detail.scrollTop,
      // });
    } // this.throttle = setTimeout(() => {
    //     clearTimeout(this.throttle);
    //     this.throttle = null;
    // }, 0);

  },
  scrollHandler: function scrollHandler(event) {
    var heights = this.goodsHeights;
    var index = 0;
    var indexNow = 0;
    var num = 0;

    for (var i = 0; i < heights.length; i++) {
      // 累计右侧滑栏滚动上去的每一个分类的 Height
      num += parseInt(heights[i]); // 循环判断 num 是否大于右侧滑栏滚动上去的 Height ，然后 get 到 i 值赋给 index

      if (num > event.detail.scrollTop) {
        indexNow = i; // 如果右侧滑栏滚动高度小于单个类别高度的 1/2 时，index 为 0
        // if (event.detail.scrollTop < heights[0]) {
        //     indexNow = 0;
        // }

        break;
      }
    } // console.log('index', index)


    var left_scrollTop = this.data.left_titleHeight * indexNow;

    if (indexNow !== this.indexOld) {
      console.log('金UR--------------', this.goodsIds[indexNow]); // let arr = new Array(Math.abs(this.indexOld - indexNow));
      // this.some(arr.length, indexNow - this.indexOld, this.indexOld);

      this.indexOld = indexNow;
      this.setData({
        // scrollTop: left_scrollTop,
        leftTop: this.wrapMenuHeight / 2 - 50,
        // 动态给左侧滑栏传递对应该项的 id，用于高亮效果显示
        curNav: this.goodsIds[indexNow]
      });
    }
  },
  // 点击左侧列表item
  checkList: function checkList(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      scrollTopId: id,
      // 左侧点击类样式
      curNav: id.replace('_', '')
    }); // const { index } = e.currentTarget.dataset;
    // const { nowIndex } = this.data;
    // console.log('checkList', index);
    // if (index === nowIndex) return;
    // this.setData({
    //     nowIndex: index,
    //     scrollTopId
    //     // scrollTop: 100,
    // });
  }
});