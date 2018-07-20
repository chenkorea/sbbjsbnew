var Util = require('../utils/address.js')

/**
 * 获取微信登录
 */
function wxLogin(e) {
  if (wx.showLoading) {
    wx.showLoading({ title: '启动微信支付中...', })
  }
  var that = this;
  wx.login({
    success: function (res) {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      console.log(JSON.stringify(res))
      getOpenId(res.code, e);
    }
  });
}
/**
 * 获取openId
 */
function getOpenId(code, e) {
  if (wx.showLoading) {
    wx.showLoading({ title: '启动微信支付中...', })
  }
  var that = this;
  wx.request({
    url: getApp().globalData.serverIp + 'openkey/getWXJSopenId',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: { code: code },
    success: function (res) {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      console.log("getOpenId res-----:", res);
      var openIdStr = res.data.content[0];
      var jsonObj = JSON.parse(openIdStr);
      console.log('open_id = ' + jsonObj.openid);
      xiadan(jsonObj.openid, e);
    }
  })
}


/**
 * 微信统一下单
 */
function xiadan(opendId, e) {
  if (wx.showLoading) {
    wx.showLoading({ title: '启动微信支付中...', })
  }
  var orderId = e.currentTarget.dataset.orderid;
  console.log('xiadan opendId', opendId + ', orderId: ' + orderId )
  var that = this;
  wx.request({
    url: getApp().globalData.serverIp + 'openkey/jsxiadan',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: { 'openid': opendId, 'orderId': orderId, 'coupon_type': '0', 'coupon_price': '0' },
    success: function (res) {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      var code = res.data.code;
      if (code == '1') {
        // 成功
        var prepay_id = res.data.content[0];
        if (prepay_id == null || '' == prepay_id) {
          wx.showToast({
            title: 'prepay_id获取失败',
          })
          console.log('prepay_id == prepay_idprepay_id获取失败');
        } else {
          console.log('prepay_id == ' + prepay_id);
          sign(prepay_id, e);
        }
      }
    },
    complete: function (res) {
      console.log('xiadan complete', res)
    }
  })
}


function sign(prepay_id, e) {
  if (wx.showLoading) {
    wx.showLoading({ title: '启动微信支付中...', })
  }
  var that = this;
  wx.request({
    url: getApp().globalData.serverIp + 'openkey/jssign',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: { prepay_id: prepay_id },
    success: function (res) {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      var code = res.data.code;
      if (code == '1') {
        console.log(res.data.content[0].prepay_id);
        requestPayment(res.data.content[0].prepay_id, e);
      }
    }
  })
}


function requestPayment(objj, e) {
  if (wx.showLoading) {
    wx.showLoading({ title: '启动微信支付中...', })
  }
  var that = this;
  var formId = e.detail.formId;
  var obj = JSON.parse(objj);

  var orderObj = e.currentTarget.dataset.item;
  wx.requestPayment({
    timeStamp: obj.timeStamp,
    nonceStr: obj.nonceStr,
    package: obj.package,
    signType: obj.signType,
    paySign: obj.paySign,
    success: function (res) {
      // 成功
      var orderId = e.currentTarget.dataset.orderid;
      var uname = that.data.user_name;
      var uid = that.data.uid;
      console.log(orderId);
      // 这个应该是支付成功之后调用的，现在是直接跳过支付默认支付成功
      Util.updateOrderPayStatus(function (data) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var code = data.data.code;
        if (code == "1") {
          wx.showToast({ title: '支付成功', })
          // 发送通知给师傅端
          that.sendMsgForStatus(orderId, '07', orderObj.process_person_id);

          //pay success update form_id
          that.saveWXFormId(formId, uid);

          that.saveWXOrderFormId(formId, orderId);

          // 发送推送通知给师傅端
          that.sendJPushMsg(orderObj.process_person_id, '07');

          
        } else {
          // 失败
          wx.showModal({
            title: '失败',
            content: '提交状态更新失败！',
            showCancel: false,
          })
        }
      }, uid, uname, orderId);
    },
    fail: function (res) {
      // 失败
      wx.showToast({ title: '支付失败', })
    }
  })
}

/**
 * 保存微信表单ID
 */
function saveWXFormId(form_id, uid) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/saveWXFormId";
  wx.request({
    url: remoteUrl,
    data: {
      form_id: form_id,
      uid: uid
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
    }
  })
}

function saveWXOrderFormId(form_id, order_id) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/saveWXOrderFormId";
  wx.request({
    url: remoteUrl,
    data: {
      form_id: form_id,
      order_id: order_id,
      utype: "2"
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
    }
  })
}


// 发送消息给微信
function sendMsgForStatus(orderId, status, jsId) {
  var that = this;
  wx.request({
    url: getApp().globalData.serverIp + 'openkey/sendMsgForStatus',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      orderId: orderId,
      status: status,
      jsId: jsId
    },
    success: function (res) {
    }
  })
}
// 发送极光推送通知
function sendJPushMsg(user_id, status) {
  var that = this;
  wx.request({
    url: getApp().globalData.serverIp + 'openkey/sendJPushMsg',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      user_id: user_id,
      status: status
    },
    success: function (res) {
    }
  })
}

module.exports = {
  wxLogin: wxLogin
}