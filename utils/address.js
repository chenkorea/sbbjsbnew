
// 获取用户地址信息
function getUserAddress(callback, uid) {
  // http://192.200.200.21:9000/sbb-web/phone/openkey/getUserAddress
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserAddress?uid="+ uid;
  wx.request({
    url: remoteUrl,
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 保存用户地址信息
function addUserAddress(callback, uid, popedom, address, is_default) {
  // http://192.200.200.21:9000/sbb-web/phone/openkey/getUserAddress
  var remoteUrl = getApp().globalData.serverIp + "openkey/addUserAddress";
  // ?uid=" + uid + 
  // "&popedom=" + popedom + 
  // "&address=" + address +
  // "&is_default=" + is_default;"
  wx.request({
    url: remoteUrl,
    data: {
      uid: uid,
      popedom: popedom,
      address: address,
      is_default: is_default
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 保存用户地址信息
function updateUserAddress(callback, uid, addressId) {
  // http://192.200.200.21:9000/sbb-web/phone/openkey/getUserAddress
  var remoteUrl = getApp().globalData.serverIp + "openkey/updateUserAddress";
  wx.request({
    url: remoteUrl,
    data: {
      uid: uid,
      addressId: addressId
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 删除用户地址信息
function deleteUserAddress(callback, addressId) {
  // http://192.200.200.21:9000/sbb-web/phone/openkey/getUserAddress
  var remoteUrl = getApp().globalData.serverIp + "openkey/deleteUserAddress";
  wx.request({
    url: remoteUrl,
    data: {
      addressId: addressId
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 获取服务类别信息
function getServiceType(callback, serviceType) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getServiceType";
  wx.request({
    url: remoteUrl,
    data: {
      serviceType: serviceType
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}


// 创建订单
function createUserOrder(callback, userOrder) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/createUserOrder";
  wx.request({
    url: remoteUrl,
    data: userOrder,
    method: 'POST',
    header: { 'content-type': 'application/json' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 获取用户订单
function getUserOrders(callback, uid, status) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrders";
  wx.request({
    url: remoteUrl,
    data: {
      uid: uid,
      status: status
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 用户支付订单更新状态
function updateOrderPayStatus(callback, uid, uname, orderId) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/updateOrderPayStatus";
  wx.request({
    url: remoteUrl,
    data: {
      uid: uid,
      uname: uname,
      orderId: orderId
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 评论
function addServiceComment(callback, uid, uname, orderId, dispatching_id, evaluate, content) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/addServiceComment";
  wx.request({
    url: remoteUrl,
    data: {
      uid: uid,
      uname: uname,
      orderId: orderId,
      dispatching_id: dispatching_id,
      evaluate: evaluate,
      content: content
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 用户查询订单流程
function getUserOrdersProcess(callback, orderId) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrdersProcess";
  wx.request({
    url: remoteUrl,
    data: {
      orderid: orderId
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 师傅查询订单刘晨
function getUserShiFuOrdersProcess(callback, orderId) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserShiFuOrdersProcess";
  wx.request({
    url: remoteUrl,
    data: {
      orderid: orderId
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 师傅查询订单图片
function getUserOrderPic(callback, orderId) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrderPic";
  wx.request({
    url: remoteUrl,
    data: {
      orderid: orderId
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}


// 完工订单
function finishOrder(callback, objStr, goodsStr, payType, service_price, additional_service_price, guarantee, guarantee_date_type) {
  var remoteUrl = getApp().globalData.serverIp + "js/orderview/commitOrderViewStatus";
  wx.request({
    url: remoteUrl,
    data: {
      objStr: objStr,
      goodsStr: goodsStr,
      pay_type: payType,
      service_price: service_price,
      additional_service_price: additional_service_price,
      guarantee: guarantee,
      guarantee_date_type: guarantee_date_type
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 获取订单的商品
function getUserOrderGoods(callback, dispatching_id) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrderGoods";
  wx.request({
    url: remoteUrl,
    data: {
      dispatching_id: dispatching_id
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

// 获取未支付订单
function getUserOrderNOPAY(callback, dispatching_id) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrderNOPAY";
  wx.request({
    url: remoteUrl,
    data: {
      dispatching_id: dispatching_id
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log('getUserOrderNOPAY----->>' + JSON.stringify(res));
      callback(res);
    }
  })
}

function getUserOrderFinish(callback, dispatching_id, pageCount, pageNum) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrderFinish";
  wx.request({
    url: remoteUrl,
    data: {
      dispatching_id: dispatching_id,
      pageCount: pageCount,
      pageNum: pageNum
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}


function getUserOrderComment(callback, dispatching_id) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrderComment";
  wx.request({
    url: remoteUrl,
    data: {
      dispatching_id: dispatching_id
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}


function getUserOrderAllPrice(callback, dispatching_id) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/getUserOrderAllPrice";
  wx.request({
    url: remoteUrl,
    data: {
      dispatching_id: dispatching_id
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}


function gettechlocation(callback, tech_id) {
  var remoteUrl = getApp().globalData.serverIp + "openkey/gettechlocation";
  wx.request({
    url: remoteUrl,
    data: {
      tech_id: tech_id
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      console.log(res);
      callback(res);
    }
  })
}

function getLocationInfo(callback) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      getLocationCityByLatLon(res.latitude, res.longitude, function (data) {
        callback(data);
      })
    }
  })
}

function getLocationInfoCT(callback) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      callback(res);
    }
  })
}
//ct-ZNIBZ-3WJHJ-BP2FP-FJM5E-6ZBCQ-O2B5H
//NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR
function getLocationCityByLatLon(lat, lon, callback) {
  var appkey = "ZNIBZ-3WJHJ-BP2FP-FJM5E-6ZBCQ-O2B5H";
  // http://apis.map.qq.com/ws/geocoder/v1/?location=39.984154,116.307490&key=NONBZ-2VT33-DOI3A-35PVY-CZ7M6-ZRBFR
  var locationUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + lat + "," + lon + "&key=" + appkey;
  wx.request({
    url: locationUrl,
    success: function (res) {
      var locationData = res.data.result;
      callback(locationData);
    }
  });
}

function getLocationLatLonByAddr(addr, o) {
  var appkey = "ZNIBZ-3WJHJ-BP2FP-FJM5E-6ZBCQ-O2B5H";
  
  // http://apis.map.qq.com/ws/geocoder/v1/?address=北京市海淀区彩和坊路海淀西大街74号&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
  var locationUrl = "https://apis.map.qq.com/ws/geocoder/v1/?address=" + addr + "&key=" + appkey;
  wx.request({
    url: locationUrl,
    success: function (res) {
      var locationData = res.data.result;
      o.success(locationData);
    },
    fail:function(err) {
      o.failure(err)
    },
    complete:function(rescom) {
      o.completeFn(rescom)
    }
  });
}




function getCityName(callback) {
  getLocationInfo(function (data) {
    callback(data);
  })
}

function getRad(d) {
  var PI = Math.PI;
  return d * PI / 180.0;
}

/**
     * approx distance between two points on earth ellipsoid
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     * 椭圆两点经纬度距离计算
     */
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  var EARTH_RADIUS = 6378137.0;    //单位M
  
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

module.exports = {
  getUserAddress: getUserAddress,
  addUserAddress: addUserAddress,
  updateUserAddress: updateUserAddress,
  deleteUserAddress: deleteUserAddress,
  getServiceType: getServiceType,
  createUserOrder: createUserOrder,
  getUserOrders: getUserOrders,
  updateOrderPayStatus: updateOrderPayStatus,
  addServiceComment: addServiceComment,
  getUserOrdersProcess: getUserOrdersProcess,
  getUserShiFuOrdersProcess: getUserShiFuOrdersProcess,
  getUserOrderPic: getUserOrderPic,
  finishOrder: finishOrder,
  getUserOrderGoods: getUserOrderGoods,
  getUserOrderNOPAY: getUserOrderNOPAY,
  getUserOrderComment: getUserOrderComment,
  getUserOrderFinish: getUserOrderFinish,
  getUserOrderAllPrice: getUserOrderAllPrice,
  getCityName: getCityName,
  getFlatternDistance: getFlatternDistance,
  getLocationInfoCT: getLocationInfoCT,
  getLocationLatLonByAddr: getLocationLatLonByAddr,
  gettechlocation: gettechlocation
} 