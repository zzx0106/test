var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

var app = getApp();
Component({
  properties: {
    //小程序页面的标题
    title: {
      type: String,
      default: '默认标题'
    },
    //是否展示返回和主页按钮
    showBack: {
      type: Boolean,
      default: true
    },
    white: {
      type: String,
      default: ''
    },
    showHome: {
      type: Boolean,
      default: true
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    noBackground: {
      type: Boolean,
      default: false
    },
    backUrl: {
      type: String,
      default: ''
    }
  },
  data: {
    statusBarHeight: 30,
    // 取个中间值30，否则android性能问题，导致出现明显闪屏现象
    titleBarHeight: 46 // 取ios和android中间值

  },
  ready: function ready() {
    // 因为每个页面都需要用到这连个字段，所以放到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
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

          app.globalData.statusBarHeight = res.statusBarHeight;
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure: function failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      });
    }
  },
  methods: {
    headerGoTo: function headerGoTo() {
      console.log('this.properties.backUrl', this.properties.backUrl);

      if (this.properties.backUrl) {
        wx.reLaunch({
          url: this.properties.backUrl
        });
        return;
      }

      if (this.properties.showBack) {
        wx.navigateBack({
          delta: 1,
          fail: function fail(e) {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        });
      } else if (this.properties.showHome) {
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    },
    headerBack: function headerBack() {
      wx.navigateBack({
        delta: 1,
        fail: function fail(e) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },
    headerHome: function headerHome() {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  }
});