var regeneratorRuntime = require('../lib/runtime.js');
"use strict";

var formatPhone = function formatPhone(val) {
  if (!val) return '';
  return Array.from(val.replace(/\D/g, '')).map(function (code, i) {
    return i === 2 || i === 6 ? code + ' ' : code;
  }).join('');
};

var turn2Promise = function turn2Promise(func) {
  var op = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    var pramas = Object.assign(op, {
      success: function success(result) {
        resolve(result);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
    func(pramas);
  });
};

var getCode = function getCode() {
  return new Promise(function (res, rej) {
    if (wx.getStorageSync('code')) {
      res(wx.getStorageSync('code'));
    } else {
      wx.login({
        success: function success(result) {
          wx.setStorage({
            key: 'code',
            data: result.code,
            success: function success() {},
            fail: function fail(err) {}
          });
          res(result.code);
        },
        fail: function fail(err) {
          console.log('get code err', error);
          res('');
        }
      });
    }
  });
};

module.exports = {
  getCode: getCode,
  formatPhone: formatPhone,
  turn2Promise: turn2Promise
};