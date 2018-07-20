// 获取应用实例
var app = getApp();
var Util = require('../../../utils/address.js')
Page({
  data: {
    id: '',
    user_phone: "", //客户电话
    user_name: "", //客户名字
    service_item_id: "", //服务项目id
    service_address: "请选择服务地址", //服务地址
    service_type: "", //服务大类data_code
    id_card: "", //身份证ID
    car_card: "", //行驶证号
    drive_card: "", //驾驶证号
    other_card: "", //其他号
    service_price: "", //服务费
    additional_service_price: "", //额外服务费。
    typeTopOpt: [],
    typeOpt: [],
    serviceType: "",
    selctgoodsAr: [],
    is_showCard: false,
    category_name: "请选择分类",
    multiArray: [],
    isFirst: true,
    multiIndex: [0, 0],
    saveBtnDisabled: "",
    nameFocus: false,
    phoneFocus: false,
    carCardFocus: false,
    driveCardFocus: false,
    otherFocus: false,
    priceFocus: false,
    addPriceFocus: false,
    addressFocus: false,
    saveBtnDisabled: "",
    longitude: '',
    latitude: '',
    isNeed: '0',
    isAddrFirst: true,
    idNumberImageItems: [], // 商品图片
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      isFirst: false,
      multiIndex: e.detail.value,
    })
    var categoryName = this.data.multiArray[0][this.data.multiIndex[0]].service_item + '—' + this.data.multiArray[1][this.data.multiIndex[1]].service_item;
    this.setData({
      category_name: categoryName,
      service_item_id: this.data.multiArray[1][this.data.multiIndex[1]].id
    })

    this.getFinishNeedStatus();
    console.log('picker发送选择改变，携带值为', e.detail.value, this.data.multiArray[1][this.data.multiIndex[1]].id)
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value, this.data.multiArray);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    var ishav = false;
    if (e.detail.column == 0) {
      for (var i = 0; i < this.data.typeTopOpt.length; i++) {
        if (i == data.multiIndex[0]) {
          ishav = true;
          var tempArr = new Array();
          data.multiArray[1] = this.data.typeTopOpt[i].children;

          break;
        }
      }
      if (!ishav) {
        data.multiIndex[1] = 0;
      }
    }
    this.setData(data);

    var categoryName = data.multiArray[0][data.multiIndex[0]].service_item + '—' + data.multiArray[1][data.multiIndex[1]].service_item;
    var service_type = this.data.multiArray[1][this.data.multiIndex[1]].service_type;
    console.log('service_type=', service_type);
    this.setData({
      isFirst: false,
      category_name: categoryName,
      service_type: service_type,
      serviceType: service_type,
      service_item_id: data.multiArray[1][data.multiIndex[1]].id
    })
    console.log(data.multiIndex[0], data.multiArray[0], this.data.multiArray[1][this.data.multiIndex[1]].id);
  },


  bindNameInput: function (e) { // 设置客户名称
    var _this = this;
    _this.setData({
      user_name: e.detail.value
    });
  },
  bindPhoneInput: function (e) { // 设置客户电话号码
    var _this = this;

    _this.setData({
      user_phone: e.detail.value
    });
  },

  bindIdcardInput: function (e) { // 输入身份证号
    var _this = this;
    _this.setData({
      id_card: e.detail.value
    });
  },

  bindCarcardInput: function (e) { // 输入行驶证号
    var _this = this;
    _this.setData({
      car_card: e.detail.value
    });
  },

  bindDrivecardInput: function (e) { // 输入驾驶证号
    var _this = this;
    _this.setData({
      drive_card: e.detail.value
    });
  },

  bindOthercardInput: function (e) { // 输入其他
    var _this = this;
    _this.setData({
      other_card: e.detail.value
    });
  },

  bindServicepriceInput: function (e) { // 输入服务费
    var _this = this;
    _this.setData({
      service_price: e.detail.value
    });
  },

  bindAddpriceInput: function (e) {
    var _this = this;
    _this.setData({
      additional_service_price: e.detail.value
    });
  },

  bindServiceAddrInput: function (e) { // 输入服务地址
    var _this = this;
    _this.setData({
      service_address: e.detail.value
    });
  },


  bindSaveTap: function (e) { // 保存
    var _this = this;

    if (_this.data.multiArray.length == 0) {//没有分类
      return;
    } else {
      var categoryName = this.data.multiArray[0][this.data.multiIndex[0]].service_item + '—' + this.data.multiArray[1][this.data.multiIndex[1]].service_item;
      if (_this.data.category_name != categoryName) {
        wx.showModal({
          title: "提示",
          content: "请选择服务项目！",
          showCancel: false,
          complete: function (res) {
            _this.setData({
              nameFocus: true
            });
          }
        });
        return;
      }
    }

    if (app.isBlank(_this.data.user_phone)) {
      wx.showModal({
        title: "提示",
        content: "请输入客户电话！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            nameFocus: true
          });
        }
      });
    } else if (app.isBlank(_this.data.user_name)) {
      wx.showModal({
        title: "提示",
        content: "请输入客户名称！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            phoneFocus: true
          });
        }
      });

    } else if (app.isBlank(_this.data.service_price)) {
      wx.showModal({
        title: "提示",
        content: "请输入服务费用！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            priceFocus: true
          });
        }
      });

    } else {
      // 禁用保存按钮
      _this.setData({
        saveBtnDisabled: "disabled"
      });
      _this.save();
    }
  },

  /**
   * 保存。
   */
  save: function () {
    var _this = this;

    var selcAr = [];
    for (var i = 0; i < _this.data.selctgoodsAr.length; i++) {
      var orders = {
        goods_id: _this.data.selctgoodsAr[i].id,
        amount: _this.data.selctgoodsAr[i].selectnum,
        price: _this.data.selctgoodsAr[i].price
      };
      selcAr[i] = orders;
    }
    var addGoodsStr = JSON.stringify(selcAr);
    console.log('service_typedfds=', _this.data.service_type);
    console.log('service_item_id=', _this.data.service_item_id);
    app.request({
      url: "/phone/js/user/saveRecordOrder",
      data: {
        orderId: _this.data.id,
        js_id: app.getUserInfo().id,
        js_name: app.getUserInfo().name,
        js_phone: app.getUserInfo().phone,
        user_phone: _this.data.user_phone,
        user_name: _this.data.user_name,
        id_card: _this.data.id_card,
        service_type: _this.data.service_type,
        service_item_id: _this.data.service_item_id,
        service_price: _this.data.service_price,
        additional_service_price: _this.data.additional_service_price,
        service_address: _this.data.service_address,
        car_card: _this.data.car_card,
        drive_card: _this.data.drive_card,
        other_card: _this.data.other_card,
        addGoodsStr: addGoodsStr
      },
      method: "POST",
      loading: true,
      loadingMsg: "正在保存",
      successFn: function (res) {
        if (res.data.code == '1') {
          _this.setData({
            id: res.data.content[0].id
          });
          if (_this.data.idNumberImageItems.length > 0) {
            for (var i = 0; i < _this.data.idNumberImageItems.length; i++) {
              var eTmp = _this.data.idNumberImageItems[i];
              app.uploadFile({
                url: "phone/openkey/uploadMobileFile",
                name: "file",
                loading: true,
                filePath: eTmp.path,
                formData: {
                  parent_id: res.data.content[0].id,
                  file_type: "5",
                  operator_name: app.getUserInfo().name,
                  personId: app.getUserInfo().id,
                },
                loadingMsg: "正在上传商品图片",
                completeAllFn: function () {
                  // //上传完成
                  // _this.initData();
                  // // 启用保存按钮
                  // _this.setData({
                  // 	saveBtnDisabled: ""
                  // });
                }
              });
            }
          }
          wx.showToast({
            title: "保存成功！",
            duration: 3000,
            complete: function () {
              _this.initData();
            }
          })
          // 启用保存按钮
          _this.setData({
            saveBtnDisabled: ""
          });

        }

      },
      completeFn: function () {
      }
    });
  },

  initData: function () {
    this.setData({
      id: "",
      user_phone: "",//客户电话
      user_name: "", //客户名字
      service_item_id: "", //服务项目id
      service_address: "", //服务地址
      service_type: "", //服务大类data_code
      id_card: "", //身份证ID
      car_card: "", //行驶证号
      drive_card: "", //驾驶证号
      other_card: "", //其他号
      service_price: "", //服务费
      additional_service_price: "", //额外服务费。
      selctgoodsAr: [],
      idNumberImageItems: []

    });
    wx.removeStorage({
      key: 'selctgoodsAr',
      success: function (res) { },
    })

    wx.removeStorage({
      key: 'selctgoodsNumAr',
      success: function (res) { },
    })


  },

  chooseLocationMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(JSON.stringify(res));
        var addre = res.address;
        if (app.isNotBlank(addre) && addre.length > 12) {
          addre = addre.substring(0, 12) + '...';
        }

        that.setData({
          isAddrFirst: false,
          service_address: addre,
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
  },

  getCurrentLoc: function () {
    Util.getLocationInfoCT(function (e) {
      if (!((typeof e === "undefined") || (e == null))) {
        wx.setStorageSync("latObj", e);
        console.log(e);
        console.log('ctQQLoc' + e.latitude + ' ' + e.longitude + ' ')
      }
    })
  },

  getLocationInfoct: function () {
    var _this = this;
    Util.getCityName(function (e) {
      if (!((typeof e === "undefined") || (e == null))) {
        _this.setData({
          service_address: e.address
        });
      }
    })
  },

  /** 获取服务项目 */
  getServiceTopType: function () {

    var _this = this;

    app.request({
      url: "/phone/openkey/getServiceTypeNew",
      data: {},
      method: "GET",
      loading: true,
      loadingMsg: "正在加载...",
      beforSendFn: function () {
      },
      successFn: function (res) {

        if (res.data.code == '1') {
          var allArray = new Array();
          allArray[0] = res.data.content;
          allArray[1] = res.data.content[0].children;
          console.log(JSON.stringify(res.data.content));
          _this.setData({
            typeTopOpt: res.data.content,
            service_type: res.data.content[0].data_code,
            serviceType: res.data.content[0].data_code,
            // type: res.data.content[0].children[0].id,
            multiArray: allArray
          })
          // _this.getFinishNeedStatus();
        }
      },
      successFailFn: function () {
      },
      failFn: function () {
      }
    });
  },

  /**完工时的身份证或需要的其他证件是否需要录入 */
  getFinishNeedStatus: function () {

    var _this = this;

    app.request({
      url: "/phone/js/orderview/getFinishNeedStatus",
      data: { service_item_id: _this.data.service_item_id },
      method: "GET",
      loading: true,
      loadingMsg: "正在加载...",
      beforSendFn: function () {
      },
      successFn: function (res) {
        if (res.data.code == "1") {
          _this.setData({
            isNeed: res.data.content[0].is_need,
            is_showCard: true
          });
        } else if (res.data.code == "2") {
          //没有数据
          _this.setData({
            is_showCard: false
          });
        } else {
          // this.$toast(data.msg);
        }
      },
      successFailFn: function () {
      },
      failFn: function () {
      }
    });

  },

	/**
   * 选择商品
   */
  selectGoods: function () {
    wx.navigateTo({
      url: '../../keymarkets/keymarkets',
    })
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数  
  },
  bindOneInput: function (e) {
    var index = e.currentTarget.dataset.id;
    this.data.selctgoodsAr[index].selectnum = e.detail.value;
    this.setData({
      inputOneValue: e.detail.value
    })
    this.plusPrice();
  },

	/**
		* 生命周期函数--监听页面显示
		*/
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'selctgoodsAr',
      success: function (res) {
        that.setData({ selctgoodsAr: res.data });
      },
    })
  },
	/**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    wx.removeStorage({
      key: 'selctgoodsAr',
      success: function (res) { },
    })

    wx.removeStorage({
      key: 'selctgoodsNumAr',
      success: function (res) { },
    })


  },
  onLoad: function (param) { // 页面加载事件：param-携带有上一个页面传来的参数
    var _this = this;
    //分类全部下载，前台过滤
    _this.getServiceTopType();
    // _this.getServiceType();
    _this.getLocationInfoct();
  },

  onReady: function () { // 初始化
    var _this = this;
  },
  bindChooseIdNumberImageTap: function (e) { // 选择商品照片
    var _this = this;

    wx.chooseImage({
      count: 9,
      sizeType: ["original"],
      success: function (res) {
        var idNumberImageItemsTmp = _this.data.idNumberImageItems;

        for (var i = 0; i < res.tempFiles.length; i++) {
          var file = res.tempFiles[i];

          idNumberImageItemsTmp.push({
            id: "",
            path: file.path,
            index: idNumberImageItemsTmp.length
          });
        }

        _this.setData({
          idNumberImageItems: idNumberImageItemsTmp
        });
      }
    });
  },

  bindPreviewIdNumberImageTap: function (e) { // 预览身份证照片
    var _this = this;
    // 取出数组索引
    var index = e.currentTarget.dataset.index;
    var idNumberImagePaths = [];

    if (_this.data.idNumberImageItems.length > 0) {
      for (var i = 0; i < _this.data.idNumberImageItems.length; i++) {
        var eTmp = _this.data.idNumberImageItems[i];

        idNumberImagePaths.push(eTmp.path);
      }
    }

    if (idNumberImagePaths.length > 0) {
      var currIdNumberImagePath = idNumberImagePaths[index];

      wx.previewImage({
        current: currIdNumberImagePath, // 当前显示图片的http链接
        urls: idNumberImagePaths
      });
    }
  },
  bindDeleteIdNumberImageTap: function (e) { // 删除身份证照片
    var _this = this;
    // 取出数组索引
    var index = e.currentTarget.dataset.index;
    var idNumberImageItemsTmp1 = _this.data.idNumberImageItems;

    // 删除 index 指定的元素，并返回
    var idNumberImageTmp = idNumberImageItemsTmp1.splice(index, 1)[0];

    // 从新整理数组
    var idNumberImageItemsTmp2 = [];

    for (var i = 0; i < idNumberImageItemsTmp1.length; i++) {
      var eTmp = idNumberImageItemsTmp1[i];

      idNumberImageItemsTmp2.push({
        id: app.getString(eTmp.id),
        path: app.getString(eTmp.path),
        index: idNumberImageItemsTmp2.length
      });
    }

    _this.setData({
      idNumberImageItems: idNumberImageItemsTmp2,
    });
  },
});