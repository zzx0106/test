var regeneratorRuntime = require('../../../common/lib/runtime.js');
"use strict";

var app = getApp();
Component({
  properties: {
    isShow: {
      // 是否显示后退按钮
      type: String,
      value: '1'
    },
    isIndex: {
      // 是否主页
      type: Boolean,
      value: false
    },
    title_height: {
      //
      type: String,
      value: app.config.title_height
    },
    titleIcon_height: {
      type: String,
      value: app.config.titleIcon_height
    },
    titleIcon_width: {
      type: String,
      value: app.config.titleIcon_width
    },
    statusbarHeight: {
      type: String,
      value: app.config.statusbarHeight
    },
    title_top: {
      type: String,
      value: app.config.title_top
    },
    title_text: {
      type: String,
      value: app.config.title_text
    }
  },
  methods: {
    _goBack: function _goBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    _goHome: function _goHome() {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  }
});