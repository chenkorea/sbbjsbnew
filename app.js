// 核心工具（本人一生心血）。..


App({
  //----------[常量]----------//
  // 服务器地址
  serverAddr: "http://192.200.200.21:9000/sbb-web/",
  // serverAddr: "https://www.gzwnks.com/sbb-web/",
  // serverAddr: "http://192.200.200.23:9000/sbb-web/",
  // 手机号正则表达式
  phoneRe: /^1[3-9]\d{9}$/i,
  /** 数字的正则表达式 */
  numberRE: /^\d+$/i,
  // 验证码正则表达式
  checkCodeRe: /^\d{6}$/i,
  //----------[/常量]----------//

  //----------[变量]----------//
  // 发送的 Ajax 总个数
  ajaxCount: 0,
  // 发送的显示等待框的 Ajax 总个数
  loadingAjaxCount: 0,
  //----------[/变量]----------//

  //----------[方法]----------//
  /**
   * 对象为空。
   *
   * @param o 对象
   * @return 是否为空：
   * <ol>
   *    <li>true-为空；</li>
   *    <li>false-不为空。</li>
   * </ol>
   */
  isNull: function (o) {
    try {
      if ((typeof o === "undefined") || (o == null)) {
        return true;
      }

      return false;
    } catch (e) {
      return true;
    }
  },

  /**
   * 对象不为空。
   *
   * @param o 对象
   * @return 是否为空：
   * <ol>
   *    <li>true-不为空；</li>
   *    <li>false-为空。</li>
   * </ol>
   */
  isNotNull: function (o) {
    var _this = this;

    return !_this.isNull(o);
  },

  /**
   * 字符串为空。
   *
   * @param str 字符串
   * @return 是否为空：
   * <ol>
   *    <li>true-为空；</li>
   *    <li>false-不为空。</li>
   * </ol>
   */
  isBlank: function (str) {
    var _this = this;

    try {
      if ((typeof str === "undefined") || (str == null)) {
        return true;
      } else if ((typeof str === "number") || (typeof str === "boolean")) {
        return false;
      } else if (typeof str === "string") {
        str = str.replace(/(^\s*)|(\s*$)/g, "");

        if (str.length === 0) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    } catch (e) {
      return true;
    }
  },

  /**
   * 字符串不为空。
   *
   * @param str 字符串
   * @return 是否为空：
   * <ol>
   *    <li>true-不为空；</li>
   *    <li>false-为空。</li>
   * </ol>
   */
  isNotBlank: function (str) {
    var _this = this;

    return !_this.isBlank(str);
  },

  /**
   * 判断非空变量是否为原生对象。
   *
   * @param o 变量
   * @return 是否为原生对象：
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  isObject: function (o) {
    var _this = this;

    try {
      return _this.isNotNull(o);
    } catch (e) {
      return false;
    }
  },

  /**
   * 判断变量是否为数字。
   *
   * @param num 变量
   * @return 是否为数字：
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  isNumber: function (num) {
    var _this = this;

    try {
      var numStr = String(num);

      if (_this.numberRE.test(numStr)) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  /**
   * 判断变量是否为数组。
   *
   * @param arr 数组
   * @return 是否为数组：
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  isArray: function (arr) {
    var _this = this;

    try {
      return (_this.isNotNull(arr) && (arr instanceof Array));
    } catch (e) {
      return false;
    }
  },

  /**
   * 判断变量是否为布尔值。
   *
   * @param bl 变量
   * @return 是否为布尔值：
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  isBoolean: function (bl) {
    try {
      var blStr = String(bl);

      if ((blStr === "true") || (blStr === "false")) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  /**
   * 判断变量是否为函数。
   *
   * @param fn 变量
   * @return 是否为函数：
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  isFunction: function (fn) {
    try {
      return (typeof fn === "function");
    } catch (e) {
      return false;
    }
  },

  /**
   * 剔除字符串前后空格。
   * 
   * @return 剔除字符串前后空格
   */
  trim: function (str) {
    var _this = this;

    if (typeof str === "string") {
      return str.replace(/(^\s*)|(\s*$)/g, '');
    } else {
      return str;
    }
  },

  /**
   * 获取安全的字符串。
   *
   * @param str 字符串
   * @return {string} 安全的字符串
   */
  getString: function (str) {
    var _this = this;

    return (_this.isBlank(str) ? "" : _this.trim(String(str)));
  },

  /**
   * 获取安全的数字。
   *
   * @param num 数字
   * @return {number} 安全的数字
   */
  getNumber: function (num) {
    var _this = this;

    return (_this.isNumber(num) ? Number(num) : 0);
  },

  /**
   * 获取安全的布尔。
   *
   * @param str 布尔字符串
   * @return 安全的布尔
   */
  getBoolean: function (str) {
    try {
      var blStr = String(str);

      if (blStr === "true") {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  /**
   * 字符串换行处理。
   *
   * @param str 字符串
   * @param splitCount 每隔多个字符
   * @return {string} 换行后的字符串
   */
  newlineStr: function (str, splitCount) {
    var _this = this;
    // 换行后的字符串
    var newlineStr = "";

    if (_this.isBlank(str) || !_this.isNumber(splitCount)) {
      return "";
    }

    splitCount = Number(splitCount);

    if ((splitCount <= 0) || (str.length <= splitCount)) {
      return str;
    } else {
      var split = (str.length / splitCount);

      for (var i = 0; i < split; i++) {
        if (i === 0) {
          newlineStr += str.substring((i * splitCount), ((i + 1) * splitCount));
        } else {
          newlineStr += ("\n" + str.substring((i * splitCount), ((i + 1) * splitCount)));
        }
      }

      // 非整除
      if ((str.length % splitCount) !== 0) {
        newlineStr += ("\n" + str.substring((split * splitCount)));
      }
    }

    return newlineStr;
  },

  /**
   * 数组求和。
   *
   * @param arr 数字数组
   * @return {number} 和
   */
  sumArray: function (arr) {
    var _this = this;
    var sum = 0;

    if (_this.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        sum += _this.getNumber(arr[i]);
      }
    }

    return sum;
  },

  /**
   * 给对象数组中对象的某个字段求和。
   *
   * @param objArr 对象数组
   * @param objField 对象字段
   * @return {number} 和
   */
  sumObjArray: function (objArr, objField) {
    var _this = this;
    var sum = 0;

    if (_this.isArray(objArr) && _this.isNotBlank(objField) && !_this.isNumber(objField)) {
      for (var i = 0; i < objArr.length; i++) {
        var e = objArr[i];

        if (_this.isObject(e)) {
          var value = e[objField];

          if (_this.isNumber(value)) {
            sum += _this.getNumber(value);
          }
        }
      }
    }

    return sum;
  },

  /**
   * 判断 str 是否以 startsStr 开始。
   *
   * @param str 字符串
   * @param startsStr 开始的字符串
   * @return
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  startsWithStr: function (str, startsStr) {
    var _this = this;

    if (_this.isBlank(str) || _this.isBlank(startsStr)) {
      return false;
    }

    if (str.indexOf(startsStr) === 0) {
      return true
    } else {
      return false;
    }
  },

  /**
   * 判断 str 是否以 endsStr 结束。
   *
   * @param str 字符串
   * @param endsStr 结束的字符串
   * @return
   * <ol>
   *    <li>true-是；</li>
   *    <li>false-否。</li>
   * </ol>
   */
  endsWithStr: function (str, endsStr) {
    if (_this.isBlank(str) || _this.isBlank(endsStr)) {
      return false;
    }

    if ((str.lastIndexOf(endsStr) + endsStr.length) === str.length) {
      return true
    } else {
      return false;
    }
  },

  /**
   * 给基本类型数组排序。
   *
   * @param arr 数组
   * @param sortBy 排序方式：
   * <ol>
   *    <li>asc-升序；</li>
   *    <li>desc-降序。</li>
   * </ol>
   *
   * @return 排序后的数组
   */
  sortArray: function (arr, sortBy) {
    var _this = this;

    if (!_this.isArray(arr)) {
      return new Array();
    }

    if (_this.isBlank(sortBy)) {
      return arr;
    }

    sortBy = String(sortBy).toLowerCase();

    if (("asc" !== sortBy) && ("desc" !== sortBy)) {
      return arr;
    }

    // 比较器
    var compare = function (v1, v2) {
      // v1 和 v2 其中一个为空，禁止排序
      if (_this.isBlank(v1) || _this.isBlank(v2)) {
        return 0;
      }

      // 升序
      if (sortBy === "asc") {
        if (v1 > v2) {
          return 1;
        } else if (v1 < v2) {
          return -1;
        } else {
          return 0;
        }

        // 降序
      } else if (sortBy === "desc") {
        if (v1 > v2) {
          return -1;
        } else if (v1 < v2) {
          return 1;
        } else {
          return 0;
        }

        // 什么玩意？
      } else {
        return 0;
      }
    }

    return arr.sort(compare);
  },

  /**
   * 给对象数组排序。
   *
   * @param objArr 对象数组
   * @param sortField 排序字段
   * @param sortBy 排序方式：
   * <ol>
   *    <li>asc-升序；</li>
   *    <li>desc-降序。</li>
   * </ol>
   *
   * @return 排序后的数组
   */
  sortObjArray: function (objArr, sortField, sortBy) {
    var _this = this;

    if (!_this.isArray(objArr)) {
      return new Array();
    }

    if (_this.isBlank(sortField) || _this.isNumber(sortField) || _this.isBlank(sortBy)) {
      return objArr;
    }

    sortField = String(sortField);
    sortBy = String(sortBy).toLowerCase();

    if (("asc" !== sortBy) && ("desc" !== sortBy)) {
      return objArr;
    }

    // 比较器
    var compare = function (o1, o2) {
      // o1 和 o2 其中一个不为对象，禁止排序
      if (!_this.isObject(o1) || !_this.isObject(o2)) {
        return 0;
      }

      var v1 = (_this.isNumber(o1[sortField]) ? Number(o1[sortField]) : 0);
      var v2 = (_this.isNumber(o2[sortField]) ? Number(o2[sortField]) : 0);

      // 升序
      if (sortBy === "asc") {
        if (v1 > v2) {
          return 1;
        } else if (v1 < v2) {
          return -1;
        } else {
          return 0;
        }

        // 降序
      } else if (sortBy === "desc") {
        if (v1 > v2) {
          return -1;
        } else if (v1 < v2) {
          return 1;
        } else {
          return 0;
        }

        // 什么玩意？
      } else {
        return 0;
      }
    }

    return objArr.sort(compare);
  },

  /**
   * 根据 fieldKey 在 field 上从 objArr 中查找对象。
   *
   * @param objArr 对象数组
   * @param field 字段
   * @param fieldKey 字段键，即查找对象的字段值，在 objArr 中需要保证它是唯一的才有意义
   * @return key 对应的对象
   */
  getObjFromObjArr: function (objArr, field, fieldKey) {
    var _this = this;
    var obj = null;

    if (_this.isArray(objArr) && _this.isNotBlank(field) && !_this.isNumber(field) && _this.isNotBlank(fieldKey)) {
      for (var i = 0; i < objArr.length; i++) {
        var e = objArr[i];

        if (_this.isObject(e)) {
          if (e[field] == fieldKey) {
            obj = e;

            // 终止循环
            break;
          }
        }
      }
    }

    return obj;
  },

  /**
   * 校验身份证号。
   * 
   * @param idNumber 身份证号
   * @return
   * <ol>
   *    <li>true-正确；</li>
   *    <li>false-不正确。</li>
   * </ol>
   */
  checkIdNumber: function (idNumber) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var msg = "";
    var pass = true;

    if (!idNumber || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(idNumber)) {
      msg = "身份证号格式错误";
      pass = false;
    } else if (!city[idNumber.substr(0, 2)]) {
      msg = "地址编码错误";
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (idNumber.length == 18) {
        idNumber = idNumber.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;

        for (var i = 0; i < 17; i++) {
          ai = idNumber[i];
          wi = factor[i];
          sum += ai * wi;
        }

        var last = parity[sum % 11];

        if (parity[sum % 11] != idNumber[17]) {
          msg = "校验位错误";
          pass = false;
        }
      }
    }

    return pass;
  },

  /**
   * 设置登录信息（包含账号和密码）。
   * 
   * @param loginInfo 登录信息
   */
  setLoginInfo: function (loginInfo) {
    var _this = this;

    if (_this.isObject(loginInfo)) {
      wx.setStorageSync("loginInfo", loginInfo);
    }
  },

  /**
   * 获取登录信息（包含账号和密码）。
   */
  getLoginInfo: function () {
    var _this = this;

    return wx.getStorageSync("loginInfo");
  },

  /**
   * 设置用户信息。
   * 
   * @param userInfo 用户信息
   */
  setUserInfo: function (userInfo) {
    var _this = this;

    if (_this.isObject(userInfo)) {
      wx.setStorageSync("userInfo", userInfo);
    }
  },

  /**
   * 获取用户信息。
   * 
   * @return 用户信息
   */
  getUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },

  /**
   * 设置登录标志。
   *
   * @param loginFlag 登录标志
   * @return
   * <ol>
   *    <li>true-已登录；</li>
   *    <li>false-未登录。</li>
   * </ol>
   */
  setLoginFlag: function (loginFlag) {
    var _this = this;

    loginFlag = String(_this.isBoolean(loginFlag) ? loginFlag : false);

    return wx.setStorageSync("loginFlag", loginFlag);
  },

  /**
   * 获取登录标志。
   *
   * @return
   * <ol>
   *    <li>true-已登录；</li>
   *    <li>false-未登录。</li>
   * </ol>
   */
  getLoginFlag: function () {
    if (wx.getStorageSync("loginFlag") === "true") {
      return true;
    } else {
      return false;
    }
  },

  /**
   *  跳转至登录界面。
   */
  toLogin: function () {
    var _this = this;

    if (!_this.getLoginFlag()) {
      wx.redirectTo({
        url: "/pages/login/login",
      })
    }
  },

  /**
   * 判断是否完善了用户信息。
   *
   * @return
   * <ol>
   *    <li>true-已完善；</li>
   *    <li>false-未完善。</li>
   * </ol>
   */
  isPerfectUserInfo: function () {
    var _this = this;
    var userInfo = _this.getUserInfo();

    if (_this.isBlank(userInfo.id) ||
      _this.isBlank(userInfo.name) ||
      _this.isBlank(userInfo.city) ||
      _this.isBlank(userInfo.phone) ||
      _this.isBlank(userInfo.user_type) ||
      _this.isBlank(userInfo.id_number) ||
      _this.isBlank(userInfo.service_types)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 清空用户信息。
   */
  clearUserInfo: function () {
    wx.removeStorageSync("userInfo");
  },

  /**
   * 清空所有数据。
   */
  clearAll: function () {
    wx.clearStorageSync();
  },

  /**
   * 发起请求。
   * 
   * @param o 配置
   */
  request: function (o) {
    var _this = this;

    o.url = (_this.isBlank(o.url) ? "" : o.url);
    o.data = (_this.isObject(o.data) ? o.data : {});
    o.method = (_this.isBlank(o.method) ? "GET" : o.method.toUpperCase());
    o.header = (_this.isObject(o.header) ? o.header : { "content-type": "application/x-www-form-urlencoded" });
    o.fullUrl = (_this.isBoolean(o.fullUrl) ? o.fullUrl : false);
    o.loading = (_this.isBoolean(o.loading) ? o.loading : false);
    o.dataType = (_this.isBlank(o.dataType) ? "json" : o.dataType.toLowerCase());
    o.loadingMsg = (_this.isBlank(o.loadingMsg) ? "" : (o.loadingMsg + "…"));
    o.loadingMask = (_this.isBoolean(o.loadingMask) ? o.loadingMask : true);

    if (!o.fullUrl) {
      o.url = (_this.serverAddr + o.url);
    }

    _this.ajaxCount++;

    if (o.loading) {
      _this.loadingAjaxCount++;

      if (_this.loadingAjaxCount === 1) {
        wx.showLoading({
          mask: o.loadingMask,
          title: o.loadingMsg,
        });
      }
    }

    // 发起请求之前执行
    if (_this.isFunction(o.beforeFn)) {
      o.beforeFn();
    }

    wx.request({
      url: o.url,
      data: o.data,
      header: o.header,
      method: o.method,
      dataType: o.dataType,
      success: function (res) { // 请求成功
        if (_this.ajaxCount > 0) {
          _this.ajaxCount--;
        }

        if (o.loading) {
          if (_this.loadingAjaxCount > 0) {
            _this.loadingAjaxCount--;
          }

          if (_this.loadingAjaxCount === 0) {
            if(wx.hideLoading()){wx.hideLoading();}
          }
        }
  
        try {
          if (typeof res.data === "string") {
            res.data = JSON.parse(res.data);
          }

          // 成功
          if (res.data.code == 1 || res.data.code == 2 || res.data.code == -19 || res.data.code == 39) {
            if (_this.isFunction(o.successFn)) {
              o.successFn(res);
            }

            // 失败
          } else {
            // wx.showModal({
            //   title: "提示",
            //   content: (_this.isBlank(res.data.errmsg) ? "请求失败，稍后再试！" : _this.getString(res.data.errmsg)),
            //   showCancel: false
            // });

            if (_this.isFunction(o.successFailFn)) {
              o.successFailFn(res);
            }
          }
        } catch (e) {
          console.error(e);

          wx.showModal({
            title: "提示",
            content: "请求失败，稍后再试！",
            showCancel: false
          });
        }
      },
      fail: function (res) { // 请求失败
        if (_this.ajaxCount > 0) {
          _this.ajaxCount--;
        }

        if (o.loading) {
          if (_this.loadingAjaxCount > 0) {
            _this.loadingAjaxCount--;
          }

          if (_this.loadingAjaxCount === 0) {
            if(wx.hideLoading()){               wx.hideLoading();             }
          }
        }

        wx.showModal({
          title: "提示",
          content: "网络连接失败，稍后再试！",
          showCancel: false
        });

        if (_this.isFunction(o.failFn)) {
          o.failFn(res);
        }
      },
      complete: function (res) {
        // 请求完成执行
        if (_this.isFunction(o.completeFn)) {
          o.completeFn(res);
        }

        /**
         * 所有请求执行完毕。
         */
        if (_this.ajaxCount === 0) {
          if (_this.isFunction(o.completeAllFn)) {
            o.completeAllFn();
          }
        }
      }
    })
  },

  /**
   * 上传文件。
   * 
   * @param o 配置
   */
  uploadFile: function (o) {
    var _this = this;

    o.url = (_this.isBlank(o.url) ? "" : o.url);
    o.name = (_this.isBlank(o.name) ? "" : o.name);
    o.header = (_this.isObject(o.header) ? o.header : { "content-type": "application/x-www-form-urlencoded" });
    o.formData = (_this.isObject(o.formData) ? o.formData : {});
    o.filePath = (_this.isBlank(o.filePath) ? "" : o.filePath);
    o.fullUrl = (_this.isBoolean(o.fullUrl) ? o.fullUrl : false);
    o.loading = (_this.isBoolean(o.loading) ? o.loading : false);
    o.loadingMsg = (_this.isBlank(o.loadingMsg) ? "" : (o.loadingMsg + "…"));
    o.loadingMask = (_this.isBoolean(o.loadingMask) ? o.loadingMask : true);

    if (!o.fullUrl) {
      o.url = (_this.serverAddr + o.url);
    }

    _this.ajaxCount++;

    if (o.loading) {
      _this.loadingAjaxCount++;

      if (_this.loadingAjaxCount === 1) {
        wx.showLoading({
          mask: o.loadingMask,
          title: o.loadingMsg,
        });
      }
    }

    // 发起请求之前执行
    if (_this.isFunction(o.beforeFn)) {
      o.beforeFn();
    }

    wx.uploadFile({
      url: o.url,
      name: o.name,
      header: o.header,
      filePath: o.filePath,
      formData: o.formData,
      success: function (res) { // 请求成功
        if (_this.ajaxCount > 0) {
          _this.ajaxCount--;
        }

        if (o.loading) {
          if (_this.loadingAjaxCount > 0) {
            _this.loadingAjaxCount--;
          }

          if (_this.loadingAjaxCount === 0) {
            if(wx.hideLoading()){               wx.hideLoading();             }
          }
        }

        try {
          if (typeof res.data === "string") {
            res.data = JSON.parse(res.data);
          }

          // 成功
          if (res.data.code == 1) {
            if (_this.isFunction(o.successFn)) {
              o.successFn(res);
            }

            // 失败
          } else {
            wx.showModal({
              title: "提示",
              content: (_this.isBlank(res.data.errmsg) ? "上传失败，稍后再试！" : _this.getString(res.data.errmsg)),
              showCancel: false
            });

            if (_this.isFunction(o.successFailFn)) {
              o.successFailFn(res);
            }
          }
        } catch (e) {
          console.error(e);

          wx.showModal({
            title: "提示",
            content: "上传失败，稍后再试！",
            showCancel: false
          });
        }
      },
      fail: function (res) { // 上传失败
        if (_this.ajaxCount > 0) {
          _this.ajaxCount--;
        }

        if (o.loading) {
          if (_this.loadingAjaxCount > 0) {
            _this.loadingAjaxCount--;
          }

          if (_this.loadingAjaxCount === 0) {
            if(wx.hideLoading()){               wx.hideLoading();             }
          }
        }

        wx.showModal({
          title: "提示",
          content: "网络连接失败，稍后再试！",
          showCancel: false
        });

        if (_this.isFunction(o.failFn)) {
          o.failFn(res);
        }
      },
      complete: function (res) {
        // 请求完成执行
        if (_this.isFunction(o.completeFn)) {
          o.completeFn(res);
        }

        /**
         * 所有请求执行完毕。
         */
        if (_this.ajaxCount === 0) {
          if (_this.isFunction(o.completeAllFn)) {
            o.completeAllFn();
          }
        }
      },
    })
  },

  onLaunch: function() {
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        if (!((typeof res.userInfo === "undefined") || (res.userInfo == null))) {
          wx.setStorageSync("weixinUserInfo", res.userInfo);
        }
      }
    })
  }

  //----------[/方法]----------//
  ,
  globalData: {
    userInfo: null,
  // 手机号正则表达式 
    // serverIp: "https://www.gzwnks.com/sbb-web/phone/",
    // imageServerIp: "https://www.gzwnks.com/sbb-web/"

    serverIp: "http://192.200.200.21:9000/sbb-web/phone/",
    imageServerIp: "http://192.200.200.21:9000/sbb-web/"
  }
});
