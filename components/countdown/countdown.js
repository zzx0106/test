var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

Component({
  properties: {
    'remaintime': {
      value: '',
      type: Number
    },
    "showWords": {
      value: true,
      type: Boolean
    }
  },
  //定义属性
  data: {
    time: ''
  },
  // 私有数据，可用于模板渲染
  lifetimes: {
    attached: function attached() {
      var _this = this;

      var hour, minute, second;
      var timer = setInterval(function () {
        _this.data.remaintime--;
        hour = Math.floor(_this.data.remaintime / 3600 % 60);
        minute = Math.floor(_this.data.remaintime / 60 % 60);
        second = Math.floor(_this.data.remaintime % 60 % 60);
        var time = (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second);

        _this.setData({
          time: time
        });
      }, 1000);

      if (this.data.remaintime <= 0) {
        this.setData({
          time: '00:00:00'
        });
        clearInterval(timer);
      }
    }
  } //生命周期

});