var regeneratorRuntime = require('common/lib/runtime.js');
"use strict";

var $http = require('./common/js/https.js');

var Util = require('./common/js/util.js');

require('./common/js/formate');

App({
  data: {},
  onLoad: function onLoad(options) {
    console.log('options', options);
  },
  onLaunch: function onLaunch(options) {
    console.log('sence', options); // 判断是否由分享进入小程序

    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true;
    } else {
      this.globalData.share = false;
    }
  },
  onShow: function onShow(options) {
    console.log('sence onShow', options);
    var scene = options.scene;
    console.log('----', location);

    switch (scene) {
      case 1089:
        // 微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）
        wx.redirectTo({
          url: '/pages/index/index'
        });
        break;

      case 1011:
        // 扫描二维码
        break;

      default:
        break;
    } // $http.request('/consumer/index',{},'post').then((val) => {
    //     console.log(val)
    // })

  },
  $http: $http,
  Util: Util,
  globalData: {
    share: false,
    // 分享默认为false
    height: 0
  }
});