var regeneratorRuntime = require('../../common/lib/runtime.js');
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = getApp();
Page({
  data: {
    len: 0,
    tip: ''
  },
  onLoad: function onLoad(options) {},
  emitArea: function emitArea(e) {
    this.setData({
      len: e.detail.value.length,
      tip: e.detail.value
    });
  },
  submit: function () {
    var _submit = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(this.data.len > 50)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", wx.showToast({
                title: '备注不大于50个字',
                icon: 'none'
              }));

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return this.setCache('remarks', {
                remarks: this.data.tip
              });

            case 5:
              wx.navigateBack();
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](2);
              console.log('shop remarks submit', _context.t0);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 8]]);
    }));

    function submit() {
      return _submit.apply(this, arguments);
    }

    return submit;
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
  }
});