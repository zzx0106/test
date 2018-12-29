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
    var _this = this;

    console.log('sence', options); // 判断是否由分享进入小程序

    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true;
    } else {
      this.globalData.share = false;
    } //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间


    wx.getSystemInfo({
      success: function success(res) {
        console.log('getSystemInfo', res);
        _this.globalData.height = res.statusBarHeight;
      }
    });
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
  config: {
    title_height: '64',
    statusbarHeight: '24',
    titleIcon_height: '32',
    titleIcon_width: '87',
    title_top: '24',
    title_text: 'xxx',
    // iphone X + 24
    prefix: 24
  },
  globalData: {
    share: false,
    // 分享默认为false
    height: 0
  }
});