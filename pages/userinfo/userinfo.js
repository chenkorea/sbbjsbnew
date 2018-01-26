// 获取应用实例
var app = getApp();

Page({
  data: {
    name: "",
    nameFocus: false,
    idNumber: "",
    idNumberFocus: false,
    city: "贵阳市",
    redirectUrl: "", // 重定向 Url
    serviceTypesItems: [], // 服务项目数组
    idNumberImageItems: [], // 身份证照片
    serviceTypesItemsTmp: [], // 临时服务项目数组
    deletedIdNumberImageIds: [], // 被删除的身份证照片 ID 数组
    myFlag: 1, // 获取个人信息的标记：1-获取中；2-获取成功；3-获取失败
    serviceTypesFlag: 1, // 获取服务项目的标记：1-获取中；2-获取成功；3-获取失败
    saveBtnDisabled: ""
  },
  bindNameInput: function (e) { // 设置姓名
    var _this = this;

    _this.setData({
      name: e.detail.value
    });
  },
  bindIdNumberInput: function (e) { // 设置身份证号
    var _this = this;

    _this.setData({
      idNumber: e.detail.value
    });
  },
  bindCityInput: function (e) {
    var _this = this;

    _this.setData({
      city: e.detail.value
    });
  },
  bindServiceTypesChange: function (e) { // 选择服务项目
    var _this = this;

    _this.setData({
      serviceTypesItems: e.detail.value
    });
  },
  bindDeleteIdNumberImageTap: function (e) { // 删除身份证照片
    var _this = this;
    // 取出数组索引
    var index = e.currentTarget.dataset.index;
    var idNumberImageItemsTmp1 = _this.data.idNumberImageItems;
    var deletedIdNumberImageIdsTmp = _this.data.deletedIdNumberImageIds;

    // 删除 index 指定的元素，并返回
    var idNumberImageTmp = idNumberImageItemsTmp1.splice(index, 1)[0];

    // 如果身份证照片的 ID 不为空
    if (app.isNotBlank(idNumberImageTmp.id)) {
      // 存入被删除的身份证照片 ID 数组中
      deletedIdNumberImageIdsTmp.push(app.getString(idNumberImageTmp.id));
    }

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
      deletedIdNumberImageIds: deletedIdNumberImageIdsTmp
    });
  },
  
  bindChooseIdNumberImageTap: function (e) { // 选择身份证照片
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
  bindPreviewIdNumberImageTap: function(e) { // 预览身份证照片
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

    if (_this.data.myFlag == 1) {
      wx.showModal({
        title: "提示",
        content: "正在获取个人信息…",
        showCancel: false
      });
    } else if (_this.data.myFlag == 3) {
      wx.showModal({
        title: "提示",
        content: "获取个人信息失败，稍后再试！",
        showCancel: false
      });
    } else if (_this.data.serviceTypesFlag == 1) {
      wx.showModal({
        title: "提示",
        content: "正在获取服务项目…",
        showCancel: false
      });
    } else if (_this.data.serviceTypesFlag == 3) {
      wx.showModal({
        title: "提示",
        content: "获取服务项目失败，稍后再试！",
        showCancel: false
      });

      // 校验姓名为空
    } else if (app.isBlank(_this.data.name)) {
      wx.showModal({
        title: "提示",
        content: "请输入姓名！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            nameFocus: true
          });
        }
      });

      // 校验身份证号为空
    } else if (app.isBlank(_this.data.idNumber)) {
      wx.showModal({
        title: "提示",
        content: "请输入身份证号！",
        showCancel: false,
        complete: function (res) {
          _this.setData({
            idNumberFocus: true
          });
        }
      });

      // 校验身份证号格式是否正确
    } 
    // else if (!app.checkIdNumber(_this.data.idNumber)) {
    //   wx.showModal({
    //     title: "提示",
    //     content: "身份证号格式不正确！",
    //     showCancel: false,
    //     complete: function (res) {
    //       _this.setData({
    //         idNumberFocus: true
    //       });
    //     }
    //   });

    //   // 校验是否选择服务项目
    // } 
    else if (!app.isArray(_this.data.serviceTypesItems) || (_this.data.serviceTypesItems.length == 0)) {
      wx.showModal({
        title: "提示",
        content: "至少选择一个服务项目！",
        showCancel: false
      });

      // 校验是否上传身份证照片
    } else if (!app.isArray(_this.data.idNumberImageItems) || (_this.data.idNumberImageItems.length == 0)) {
      wx.showModal({
        title: "提示",
        content: "至少上传一张身份证照片！",
        showCancel: false
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

      if (idNumberImagesTmp2.length == 0) {
        _this.save();

        // 上传身份证照片
      } else {
        for (var i = 0; i < idNumberImagesTmp2.length; i++) {
          var eTmp = idNumberImagesTmp2[i];

          app.uploadFile({
            url: "phone/openkey/uploadMobileFile",
            name: "file",
            loading: true,
            filePath: eTmp.path,
            formData: {
              parent_id: app.getUserInfo().id,
              file_type: "2"
            },
            loadingMsg: "正在上传身份证照片",
            completeAllFn: function () {
              _this.save();
            }
          });
        }
      }
    }
  },

  /**
   * 获取服务项目。
   */
  getServiceTypes: function () {
    var _this = this;

    app.request({
      url: "phone/js/user/service_types",
      method: "GET",
      loading: true,
      loadingMsg: "正在加载个人信息",
      beforSendFn: function () {
        _this.setData({
          serviceTypesFlag: 1
        });
      },
      successFn: function (res) {
        _this.setData({
          serviceTypesFlag: 2
        });

        // 所有的服务项目
        var serviceTypes = [];
        // 技师已有的服务项目
        var myServiceTypes = [];

        if (app.isNotBlank(app.getUserInfo().service_types)) {
          myServiceTypes = app.getUserInfo().service_types.split(",");
        }

        // 构建所有的服务项目，用于显示
        for (var i = 0; i < res.data.content.length; i++) {
          var e = res.data.content[i];

          serviceTypes.push({
            name: e.data_name,
            value: e.data_code,
            order: e.data_order,
            checked: false
          });

          // 选中技师已有的服务项目
          for (var j = 0; j < myServiceTypes.length; j++) {
            var code = serviceTypes[i].value;
            var myCode = myServiceTypes[j];

            if (code == myCode) {
              serviceTypes[i].checked = true;

              // 退出二层循环，提高效率
              break;
            }
          }
        }

        // 升序排序
        serviceTypes = app.sortObjArray(serviceTypes, "order", "asc");

        _this.setData({
          serviceTypesItems: myServiceTypes,
          serviceTypesItemsTmp: serviceTypes
        });
      },
      successFailFn: function () {
        _this.setData({
          serviceTypesFlag: 3
        });
      },
      failFn: function () {
        _this.setData({
          serviceTypesFlag: 3
        });
      }
    });
  },

  /**
   * 获取个人信息。
   */
  getMy: function () {
    var _this = this;

    app.request({
      url: "phone/js/user/my",
      data: {
        id: app.getUserInfo().id
      },
      method: "GET",
      loading: true,
      loadingMsg: "正在加载个人信息",
      beforSendFn: function () {
        _this.setData({
          myFlag: 1
        });
      },
      successFn: function (res) {
        _this.setData({
          myFlag: 2
        });

        // 设置用户信息
        app.setUserInfo(res.data.content[0]);
        
        var idNumberImageItemsTmp = [];

        // 判断是否已上传过身份证照片
        if (app.isNotBlank(app.getUserInfo().file_number_id)) {
          var idNumberImageIdsTmp = app.getUserInfo().file_number_id.split("|");
          var idNumberImagePathsTmp = app.getUserInfo().id_number_url.split("|");

          for (var i = 0; i < idNumberImageIdsTmp.length; i++) {
            idNumberImageItemsTmp.push({
              id: idNumberImageIdsTmp[i],
              path: (app.serverAddr + idNumberImagePathsTmp[i]),
              index: idNumberImageItemsTmp.length
            });
          }
        }

        _this.setData({
          name: app.getUserInfo().name,
          idNumber: app.getUserInfo().id_number,
          idNumberImageItems: idNumberImageItemsTmp
        });

        // 获取所有服务项目
        _this.getServiceTypes();
      },
      successFailFn: function () {
        _this.setData({
          myFlag: 3
        });
      },
      failFn: function () {
        _this.setData({
          myFlag: 3
        });
      }
    });
  },

  /**
   * 保存。
   */
  save: function () {
    var _this = this;
    var serviceTypesItemsStrTmp = _this.data.serviceTypesItems.join(",");
    var deletedIdNumberImageIdsTmp = "";

    if (_this.data.deletedIdNumberImageIds.length > 0) {
      deletedIdNumberImageIdsTmp = _this.data.deletedIdNumberImageIds.join(",");
    }

    app.request({
      url: "phone/js/user/update",
      data: {
        id: app.getUserInfo().id,
        name: _this.data.name,
        idNumber: _this.data.idNumber,
        city: "0",
        serviceTypesItems: serviceTypesItemsStrTmp,
        deletedIdNumberImageIds: deletedIdNumberImageIdsTmp
      },
      method: "POST",
      loading: true,
      loadingMsg: "正在保存",
      successFn: function (res) {
        // 设置用户信息
        app.setUserInfo(res.data.content[0]);

        var idNumberImageItemsTmp = [];

        // 判断是否已上传过身份证照片
        if (app.isNotBlank(app.getUserInfo().file_number_id)) {
          var idNumberImageIdsTmp = app.getUserInfo().file_number_id.split("|");
          var idNumberImagePathsTmp = app.getUserInfo().id_number_url.split("|");

          for (var i = 0; i < idNumberImageIdsTmp.length; i++) {
            idNumberImageItemsTmp.push({
              id: idNumberImageIdsTmp[i],
              path: (app.serverAddr + idNumberImagePathsTmp[i]),
              index: idNumberImageItemsTmp.length
            });
          }
        }

        _this.setData({
          name: app.getUserInfo().name,
          idNumber: app.getUserInfo().id_number,
          idNumberImageItems: idNumberImageItemsTmp
        });

        wx.showToast({
          title: "保存成功！",
          duration: 3000,
          complete: function() {
            _this.changeUserStatus('1')
          }
        })
      },
      completeFn: function() {
        // 启用保存按钮
        _this.setData({
          saveBtnDisabled: ""
        });
      }
    });
  },
  changeUserStatus: function (status) {
    var userInfo = app.getUserInfo();

    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {
      var _this = this;
      // 获取订单详细
      app.request({
        url: "/phone/js/orderview/changeUserStatus",
        data: {
          userId: userInfo.id,
          status: status
        },
        method: 'POST',
        loading: true,
        loadingMsg: "正在修改用户状态...",
        successFn: function (res) {
          if (res.data.code == 1) {
            if (app.isNotBlank(_this.data.redirectUrl)) {
              // 重定向到首页
              wx.redirectTo({
                url: _this.data.redirectUrl
              });
            }
          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },
  onLoad: function(param) { // 页面加载事件：param-携带有上一个页面传来的参数
    var _this = this;

    _this.setData({
      redirectUrl: app.getString(param.redirectUrl)
    });
  },

  onReady: function () { // 初始化
    var _this = this;

    _this.getMy();
  }
});