// 获取应用实例
var app = getApp();

Page({
  data: {
    id: '',
    name: "",
    brand: "",
    price: "",
    warranty_period_unit: "",
    warranty_period: "",
    summary: '',
    status: "1",
    category_code: "",
    category_name: "请选择分类",
    idNumberImageItems: [], // 商品图片
    kindTrees: [],  //分类
    serverOpt: [], //质保期单位
    multiArray: [],
    isFirst: true,
    isFirstZBQ: true,
    multiIndex: [0,0],
    saveBtnDisabled: "",
    nameFocus:false,
    brandFocus:false,
    priceFocus:false,
    warrantyPeriodFocus:false,
    summaryFocus:false,
    saveBtnDisabled: ""
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      isFirst: false,
      multiIndex: e.detail.value,
    })
    var categoryName = this.data.multiArray[0][this.data.multiIndex[0]].text + '—' + this.data.multiArray[1][this.data.multiIndex[1]].text;
    this.setData({
      category_name: categoryName,
      category_code: this.data.multiArray[1][this.data.multiIndex[1]].id
    })
 
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
    if(e.detail.column == 0) {
      for (var i = 0; i < this.data.kindTrees.length; i++) {
        if (i == data.multiIndex[0]) {
          ishav = true;
          var tempArr = new Array();
          data.multiArray[1] = this.data.kindTrees[i].children;
         
          break;
        }
      }
      if(!ishav) {
        data.multiIndex[1] = 0;
      }
    }
    this.setData(data);
    console.log(data.multiIndex[0], data.multiArray[0], this.data.multiArray[1][this.data.multiIndex[1]].id);
    var categoryName = data.multiArray[0][data.multiIndex[0]].text + '—' + data.multiArray[1][data.multiIndex[1]].text;
    this.setData({
      isFirst: false,
      category_name: categoryName,
      category_code: data.multiArray[1][data.multiIndex[1]].id
    })
  },

  //保质期单位选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var dataCode = this.data.serverOpt[e.detail.value].data_code;
    this.setData({
      isFirstZBQ: false,
      index: e.detail.value,
      warranty_period_unit: dataCode
    })
  },
 
  bindNameInput: function (e) { // 设置品名
    var _this = this;
    _this.setData({
      name: e.detail.value
    });
  },
  bindBrandInput: function (e) { // 设置品牌
    var _this = this;

    _this.setData({
      brand: e.detail.value
    });
  },

  bindPriceInput: function (e) { // 输入价格
    var _this = this;
    _this.setData({
      price: e.detail.value
    });
  },

  bindPeriodInput: function (e) { // 输入质保期
    var _this = this;
    _this.setData({
      warranty_period: e.detail.value
    });
  },

  // bindSummaryInput: function (e) { // 输入商品简介
  //   var _this = this;
  //   console.log(e.detail.value)
  //   _this.setData({
  //     summary: e.detail.value
  //   });
  // },

  bindTextAreaBlur: function (e) {
    var _this = this;
    console.log(e.detail.value)
    _this.setData({
      summary: e.detail.value
    });
    // console.log(e.detail.value)
  },

  //是否上架
  switch1Change: function (e) {
    if (e.detail.value) {
      _this.setData({
        status: 1
      });
    } else {
      _this.setData({
        status: 0
      });
    }
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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
  bindSaveTap: function (e) { // 保存
    var _this = this;

    if (_this.data.multiArray.length == 0) {//没有分类
        return;
    } else {
      var categoryName = this.data.multiArray[0][this.data.multiIndex[0]].text + '—' + this.data.multiArray[1][this.data.multiIndex[1]].text;
      if(_this.data.category_name != categoryName) {
        wx.showModal({
          title: "提示",
          content: "请选择分类！",
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

    if (app.isBlank(_this.data.warranty_period_unit)) {
      wx.showModal({
        title: "提示",
        content: "请选择质保期单位！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            nameFocus: true
          });
        }
      });
    } else if (app.isBlank(_this.data.name)) {
      wx.showModal({
        title: "提示",
        content: "请输入品名！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            nameFocus: true
          });
        }
      });

    } else if (app.isBlank(_this.data.brand)) {
      wx.showModal({
        title: "提示",
        content: "请输入品牌！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            brandFocus: true
          });
        }
      });

    } else if (app.isBlank(_this.data.price)) {
      wx.showModal({
        title: "提示",
        content: "请输入价格！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            priceFocus: true
          });
        }
      });

    } else if (app.isBlank(_this.data.warranty_period)) {
      wx.showModal({
        title: "提示",
        content: "请输入保质期！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            warrantyPeriodFocus: true
          });
        }
      });

    } else if (app.isBlank(_this.data.summary)) {
      wx.showModal({
        title: "提示",
        content: "请输入商品简介！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            summaryFocus: true
          });
        }
      });

    } else {
      // 禁用保存按钮
      _this.setData({
        saveBtnDisabled: "disabled"
      });

      var idNumberImagesTmp1 = _this.data.idNumberImageItems;
      var idNumberImagesTmp2 = [];

      // 如果身份证照片有 ID 的话，表示已经上传过了，不需要在上传
      for (var i = 0; i < idNumberImagesTmp1.length; i++) {
        var eTmp = idNumberImagesTmp1[i];

        if (app.isBlank(eTmp.id)) {
          idNumberImagesTmp2.push(eTmp);
        }
      }
      _this.save();
    }
  },

  /**
   * 获取质保期单位。
   */
  getDictData: function () {
    var _this = this;

    app.request({
      url: "/phone/js/user/getZBDictData",
      data: {},
      method: "GET",
      loading: true,
      loadingMsg: "正在加载...",
      beforSendFn: function () {
      },
      successFn: function (res) {
        console.log(res.data.content);
        if(res.data.code == '1') {
          _this.setData({
            serverOpt: res.data.content, //质保期单位
          });
        }
      },
      successFailFn: function () {
      },
      failFn: function () {
      }
    });
  },

  /**
  * 获取商品分类。
  */
  getGoodKindTree: function () {
    var _this = this;

    app.request({
      url: "/phone/js/user/listCategoryTreeMobile",
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
          _this.setData({
            kindTrees: res.data.content,
            multiArray: allArray
          })

          console.log('ct==============' + _this.data.multiArray);
        }
      },
      successFailFn: function () {
      },
      failFn: function () {
      }
    });
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

  /**
   * 保存。
   */
  save: function () {
    var _this = this;
    var formObj = {};
    formObj.name = _this.data.name;
    formObj.brand = _this.data.brand;
    formObj.price = _this.data.price;
    formObj.status = _this.data.status;
    formObj.summary = _this.data.summary;
    formObj.warranty_period_unit = _this.data.warranty_period_unit;
    formObj.warranty_period = _this.data.warranty_period;
    formObj.category_code = _this.data.category_code;
    formObj.category_name = _this.data.category_name;

    app.request({
      url: "phone/js/user/saveOrUpdateMobile",
      data: {
        sysGoodsStr: JSON.stringify(formObj),
        operator_id: app.getUserInfo().id,
        operator_name: app.getUserInfo().name,
      
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
                  file_type: "4",
                  operator_name: app.getUserInfo().name,
                  personId: app.getUserInfo().id,
                },
                loadingMsg: "正在上传商品图片",
                completeAllFn: function () {
                  //上传完成
                  _this.initData();
                  // 启用保存按钮
                  _this.setData({
                    saveBtnDisabled: ""
                  });
                }
              });
            }
          }
        }

        

        wx.showToast({
          title: "保存成功！",
          duration: 3000,
          complete: function () {
            //上传基本信息完成
            if (_this.data.idNumberImageItems.length == 0) {
              _this.initData();
            }
          }
        })
      },
      completeFn: function () {    
      }
    });
  },
  
  initData:function(){
    this.setData({
      id:'',
      name: "",
      brand: "",
      price:"",
      warranty_period_unit:"",
      warranty_period:"",
      summary:'',
      status:"1",
      category_code:"",
      category_name: "请选择分类",
      idNumberImageItems:[],
      isFirst:true,
      isFirstZBQ:true

    })
    
  },

  onLoad: function (param) { // 页面加载事件：param-携带有上一个页面传来的参数
    var _this = this;

    _this.getDictData();
    _this.getGoodKindTree();
  },

  onReady: function () { // 初始化
    var _this = this;
  }
});