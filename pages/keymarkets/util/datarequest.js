
var util = require('../../../utils/util.js');
//商品列表接口
function getallgoods(cid,callback) {
  wx.request({
    url: getApp().globalData.imageServerIp + '/phone/userinfor/getallgoods?cid=' + cid, //
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      if (res.data.code == '1') {
        callback(res)
      } 
    },
    fail(res) {
      wx.showToast({
        title: '获取商品列表异常,请重新尝试',
        duration: 1500,
      })
    }
  })
}

//商品分类接口
function getgoodsclsfy(callback) {
  wx.request({
    url: getApp().globalData.imageServerIp + '/phone/userinfor/getgoodsclsfy', //
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      if (res.data.code == '1') {
        callback(res)
      }
    },
    fail(res) {
      wx.showToast({
        title: '获取商品分类异常,请重新尝试',
        duration: 1500,
      })
    }
  })
}

module.exports = {
  getallgoods: getallgoods,
  getgoodsclsfy: getgoodsclsfy
} 