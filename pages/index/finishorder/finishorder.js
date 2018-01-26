// finishorder.js
var app = getApp();
var Util = require('../../../utils/address.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selctgoodsAr:[],
    selctgoodsNumAr: [],
    userOrder: {},
    selctgoods: {},
    inputOneValue: '',
    inputTwoValue: '',
    inputThreeValue: '',
    allPrice: '',
    payment: '在线支付',
    payments: [
      { name: '1', value: '在线支付', checked: true },
      { name: '2', value: '技师代付'}],
    fdmindex: 0,
    processObj:{},
    service_price:'',
    additional_service_price: '',
    dispatching_id:'',
    zhifuprice: 0,
    isShowPay: true,
    savebutton:"save-en-button",
    loopid:[],
    guarantee:0,
    guarantee_date_type:'1'
  },
  listenerRadioGroup: function (e) {
    //改变index值，通过setData()方法重绘界面
    if (e.detail.value == '1') {
      this.setData({ payment: '在线支付' });
    } else {//2
      this.setData({ payment: '技师代付' });
    }
    this.setData({
      fdmindex: e.detail.value
    });
    console.log(this.data.payment);
  }, 
  powerDrawer: function (e) {
    var that = this;

    var item = e.currentTarget.dataset.item;

    that.setData({ userOrder: item });

    var currentStatu = e.currentTarget.dataset.statu;
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
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
  bindSePInput: function (e) {
    var price = e.detail.value;
    this.setData({ service_price: price})  
    this.plusPrice();
  },
  bindAddPInput: function (e) {
    var price = e.detail.value;
    this.setData({ additional_service_price: price })
    this.plusPrice();
  },
  bindguaranteePInput: function (e) {
    var period = e.detail.value;
    this.setData({ guarantee: period })
  },
  //查询当前页面是否有更改服务价格行为
  getIsUpdatePrice:function(id){
    var that = this
    app.request({
      url: 'phone/js/user/getOderUpdateProcess',
      data: {
        dispatching_id: this.data.userOrder.dispatching_id,
        order_id: this.data.userOrder.order_id,
        tech_id: this.data.userOrder.technician_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      // loading: true,
      // loadingMsg: "正在查询",
      successFn: function (res) {
        console.log('ctres==' + JSON.stringify(res))
        if (res.data.code == '1' && res.data.content.length>0){
          that.setData({
            service_price: res.data.content[0].service_price == '' ? 0.0 : res.data.content[0].service_price*1,
            additional_service_price: res.data.content[0].additional_service_price == '' ? 0.0 : res.data.content[0].additional_service_price * 1
          })
          that.plusPrice();
          if (res.data.content[0].is_current == '1' && res.data.content[0].is_pass=='1'){
            if(id != ''){
              clearInterval(id);//关闭定时器
              that.data.loopid.pop(id);
            }
            that.data.userOrder.service_price = (res.data.content[0].service_price == '' ? 0.0 : res.data.content[0].service_price * 1)
            that.data.userOrder.additional_service_price = (res.data.content[0].additional_service_price == '' ? 0.0 : res.data.content[0].additional_service_price * 1)
            that.setData({
              savebutton: "save-en-button",
            })
            wx.showModal({
              title: '提示',
              content: '管理员核准了您的价格变更请求',
              showCancel: false
            })
          } else if (res.data.content[0].is_current == '1' && res.data.content[0].is_pass == '0') {
            if (id != '') {
              clearInterval(id);//关闭定时器
              that.data.loopid.pop(id);
            }
            that.setData({
              savebutton: "save-en-button",
            })

            wx.showModal({
              title: '提示',
              content: '管理员驳回了您的价格变更请求',
              showCancel: false
            })
            that.plusPrice();
          }else{
            that.setData({
              savebutton: "save-un-button",
            })
          }
        }else{
          clearInterval(id);//关闭定时器
          that.data.loopid.pop(id);
        }
      }
    })
  },
  //查询当前页面是否有更改服务价格行为
  updatePrice: function () {
    var that = this
    app.request({
      url: 'phone/js/user/updateOrderPrice',
      data: {
        dispatching_id: this.data.userOrder.dispatching_id,
        order_id: this.data.userOrder.order_id,
        tech_id: this.data.userOrder.technician_id,
        service_price: this.data.service_price == '' ? 0.0 : this.data.service_price * 1,
        additional_service_price: this.data.additional_service_price == '' ? 0.0 : this.data.additional_service_price * 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      loading: true,
      loadingMsg: "正在提交更改..",
      successFn: function (res) {
        if (res.data.code == '-1') {
          wx.showToast({
            title: '更新服务价格失败，请稍后重试',
          })
        } else if (res.data.code == '1'){
          var id = setInterval(function () {
            //定时执行的代码
            that.getIsUpdatePrice(id);
          }, 3000);
          that.data.loopid.push(id);
        }
      }
    })
  },
  updateOrderPayStatus: function(uid, uname, orderId) {
    app.request({
      url: "phone/openkey/updateOrderPayStatus",
      data: {
        uid: uid,
        uname: uname,
        orderId: orderId
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      successFn: function (res) {
        console.log('updateOrderPayStatus-----------' + JSON.stringify(res));
        if (res.data.code == '1'){
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1]; //当前页面
            var prevPage = pages[pages.length - 2];
            //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 
            console.log('-----------' + prevPage.data.orderstatus)
            prevPage.setData({
              orderstatus: '5',
              isCommitSuccess: true
            })
            wx.navigateBack({})
        }else{
          wx.showModal({
            title: '提示',
            content: '订单提交失败...',
            showCancel:false
          })
        }
      },
      failFn:function(res){
        wx.showModal({
          title: '提示',
          content: '订单提交异常...',
          showCancel: false
        })
      }
    })
  },

  // 发送极光推送通知
  sendJPushMsg: function (user_id, status) {
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
  },
  saveData: function () {
    var that = this
    if (that.data.userOrder.is_vip == '1'){
      that.updateOrderPayStatus(that.data.userOrder.user_id, that.data.userOrder.user_name, that.data.userOrder.order_id)
      /*wx.showModal({
        title: '提示',
        content: '皇冠VIP客户免除电子锁具和汽车钥匙，所有APP服务费用',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })*/
      return;
    } 
    /*else if (that.data.userOrder.is_vip == '2') {
      wx.showModal({
        title: '提示',
        content: '蓝钻VIP客户免机械锁具产品和开锁服务费用',
        showCancel: false,
      })
    }*/
    if (this.data.savebutton == "save-un-button"){
        wx.showModal({
          title: '提示',
          content: '费用更改后处于审核状态,暂时不能提交',
          showCancel:false
      })
    }else{
      var service_price = (that.data.service_price == '' ? 0.0 : that.data.service_price * 1)
      var uservice_price = (that.data.userOrder.service_price == '' ? 0.0 : that.data.userOrder.service_price * 1)
      var additional_service_price = (that.data.additional_service_price == '' ? 0.0 : that.data.additional_service_price * 1)
      var uadditional_service_price = (that.data.userOrder.additional_service_price == '' ? 0.0 : that.data.userOrder.additional_service_price * 1)
      // if (service_price != uservice_price || additional_service_price != uadditional_service_price) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '是否要更改服务费用',
      //     success: function (res) {
      //       if (res.confirm) {
      //         that.setData({
      //           savebutton: "save-un-button"
      //         })
      //         that.updatePrice()
      //       } else if (res.cancel) {
      //         // that.submitSaveData();
      //       }
      //     }
      //   })
      // } else {
      //   this.submitSaveData();
      // }
      if(this.data.guarantee == 0){
        wx.showModal({
          title: '提示',
          content: '确认本次服务没有保修期？',
          success: function (res) {
            if (res.confirm) {
              wx.showModal({
                title: '提示',
                content: '确认提交该订单？',
                success: function (res) {
                  if (res.confirm) {
                    that.submitSaveData()
                  } else if (res.cancel) {
                    // that.submitSaveData();
                  }
                }
              })
            } else if (res.cancel) {
              // that.submitSaveData();
            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '确认提交该订单？',
          success: function (res) {
            if (res.confirm) {
              that.submitSaveData()
            } else if (res.cancel) {
              // that.submitSaveData();
            }
          }
        })
      }
        
    }
  },
  //订单提交
  submitSaveData:function(){
    // 构建
    var selcAr = [];
    for (var i = 0; i < this.data.selctgoodsAr.length; i++) {
      var addid = this.data.selctgoodsAr[i].addid;
      if (addid != undefined || "" != addid) {
        var orders = {
          id: addid,
          goods_id: this.data.selctgoodsAr[i].id,
          amount: this.data.selctgoodsAr[i].selectnum,
          price: this.data.selctgoodsAr[i].price,
          dispatching_id: this.data.userOrder.dispatching_id
        }
        selcAr[i] = orders;
      } else {
        var orders = {
          goods_id: this.data.selctgoodsAr[i].id,
          amount: this.data.selctgoodsAr[i].selectnum,
          price: this.data.selctgoodsAr[i].price,
          dispatching_id: this.data.userOrder.dispatching_id
        }
        selcAr[i] = orders;
      }
    }

    console.log(selcAr);

    var pants = '1';
    if (this.data.payment == '技师代付') {
      this.data.processObj.process_stage = '06';
      pants = '2';
    } else if (this.data.payment == '在线支付') {
      this.data.processObj.process_stage = '06';
      pants = '1';
    }

    var oneStr = JSON.stringify(this.data.processObj);
    var twoStr = JSON.stringify(selcAr);
    console.log(oneStr);
    console.log(twoStr);
    console.log(pants);
    // 上传
    // this.commitOrderViewStatus(oneStr, twoStr, pants);
    this.saveForServier(oneStr, twoStr, pants, this.data.service_price, this.data.additional_service_price);
  },
  saveForServier: function (oneStr, twoStr, pants, prone, prtwo) {
    wx.showLoading({
      title: '数据提交中...',
    })
    var that = this;
    // 提交数据
    Util.finishOrder(function (data) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = data.data.code;
      if (code == "1") {
        // 上传数据成功
        wx.showModal({
          title: '提交订单成功',
          content: '订单已完工成功！',
          showCancel: false,
        })

        var pages = getCurrentPages(); 
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; 
        //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 
        console.log(pants + prevPage.data.orderstatus)
        if (pants == '1') {
          prevPage.setData({
            orderstatus: '4',
            isCommitSuccess: true
          })
        } else if (pants == '2') {
          prevPage.setData({
            orderstatus: '4',//由技师代付客户消费金额，客户现金支付给技师
            isCommitSuccess: true
          })
        }

        // 推送消息
        that.sendJPushMsg(that.data.userOrder.user_id, '06');
        wx.navigateBack({})
      } else {
        wx.showToast({
          title: '提交订单失败！',
        })
      }
    }, oneStr, twoStr, pants, prone, prtwo
      , that.data.guarantee,that.data.guarantee_date_type)
  },
  /**
   * 获取商品
   */
  getUserOrderGoods: function (dispatching_id) {
    var that = this;
    wx.showLoading({
      title: '获取商品中...',
    })
    // 提交数据
    Util.getUserOrderGoods(function (data) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = data.data.code;
      if (code == "1") {
        var goodsAr = data.data.content;
        if (goodsAr != undefined && goodsAr.length!=0) {
          that.setData({ selctgoodsAr: goodsAr})
          wx.setStorage({
            key: 'selctgoodsAr',
            data: goodsAr,
          })
          that.plusPrice();
        }
      } else {
        wx.showToast({
          title: '获取订单商品失败！',
        })
      }
    }, dispatching_id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var jsonclStr = options.jsonclStr;
    var userOrder = JSON.parse(jsonclStr);
    if (userOrder.is_vip == '1'){
      this.setData({
        savebutton: "save-en-button"
      })
    }
    var jsonStr = options.jsonStr;
    var processObj = JSON.parse(jsonStr);

    this.setData({ service_price: userOrder.service_price == '' ? 0.0 : userOrder.service_price*1})
    this.setData({ additional_service_price: userOrder.additional_service_price == '' ? 0.0 : userOrder.additional_service_price * 1 })
    
    this.setData({ userOrder: userOrder })
    this.setData({ processObj: processObj})
    this.setData({ zhifuprice: userOrder.tatal_price })
    
    if (userOrder.user_id == undefined || userOrder.user_id == '') {
      this.setData({ payment: '技师代付' });
      this.setData({ isShowPay: false});
    } else {
      this.setData({ isShowPay: true });
    }
    
    this.setData({ dispatching_id: userOrder.dispatching_id })
    this.getUserOrderGoods(this.data.dispatching_id);
    // var id = setInterval(function () {
    //   //定时执行的代码
    //   that.getIsUpdatePrice(id);
    // }, 3000);

    // this.data.loopid.push(id);
  },
  commitOrderViewStatus: function (objStr, goodsStr, payType) {
    var _this = this;
    // 获取订单详细
    app.request({
      url: "phone/js/orderview/commitOrderViewStatus",
      data: {
        objStr: objStr,
        goodsStr: goodsStr,
        pay_type: payType
      },
      method: 'POST',
      loading: true,
      loadingMsg: "正在提交状态...",
      successFn: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '提交成功',
          })
          wx.navigateBack({})
        } else {
          wx.showToast({
            title: '提交失败',
          })
        }
      },
      successFailFn: function () {

      },
      failFn: function () {

      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
        that.plusPrice();
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    for(var i=0;i<this.data.loopid;i++){
      clearInterval(this.data.loopid[i]);//关闭定时器
    }
    wx.removeStorage({
      key: 'selctgoodsAr',
      success: function (res) { },
    })

    wx.removeStorage({
      key: 'selctgoodsNumAr',
      success: function (res) { },
    })

    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  plusPrice: function () {
    var servicePrice = parseFloat(this.data.service_price == "" ? 0.0:this.data.service_price*1);
    var addiservicePrice = 0;
    if (this.data.additional_service_price) {
      addiservicePrice = parseFloat(this.data.additional_service_price == "" ? 0.0 : this.data.additional_service_price * 1);
    }
    // 计算商品价格
    var allP = 0;
    for (var i = 0; i < this.data.selctgoodsAr.length; i++) {
      var num = 0;
      if (this.data.selctgoodsAr[i].selectnum) {
        num = parseInt(this.data.selctgoodsAr[i].selectnum);
      }
      var price = parseFloat(this.data.selctgoodsAr[i].price);
      allP += num * price;
    }
    var cun = servicePrice + addiservicePrice + allP;
    this.setData({ zhifuprice: ''+cun})
  }
})