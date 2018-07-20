
//获取应用实例
var app = getApp()
Page({
  data: {
    order_list: [],
    total:0.0,
    date: '2016-09-01',
  },
  //事件处理函数
  toMoneyView: function (e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?oder=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  onLoad: function () {
    var that = this;
    var date = new Date();
    var time = date.getFullYear() + '-' + ((date.getMonth() + 2) > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))
    this.setData({
      date: time
    })    
    app.request({
      url: "phone/js/user/getAllorder",
      data: {
        uid: app.getUserInfo().id,
        date: time
      },
      method: "POST",
      loading: true,
      loadingMsg: "正在努力加载...",
      successFn: function (res) {
        if (res.data.code == '1') {
          var total = 0;
          for (var i = 0; i < res.data.content.length;i++){
           total += Number(res.data.content[i].service_price)
          }
          that.setData({
            order_list: res.data.content,
            total: Number(total).toFixed(2)
          })
        }
      }
    });
  },
  bindDateChange: function (e) {
    var that = this;
    this.setData({
      date: e.detail.value
    })
    app.request({
      url: "phone/js/user/getAllorder",
      data: {
        
        uid: app.getUserInfo().id,
        date: e.detail.value
      },
      method: "POST",
      loading: true,
      loadingMsg: "正在努力加载...",
      successFn: function (res) {
        if (res.data.code == '1') {
          var total = 0;
          for (var i = 0; i < res.data.content.length; i++) {
            total += Number(res.data.content[i].service_price)
            if (res.data.content[i].create_time.length>19){
              res.data.content[i].create_time = res.data.content[i].create_time.substr(0,19)
            }
          }

          that.setData({
            order_list: res.data.content,
            total: Number(total).toFixed(2)
          })
        }
      },
      completeFn:function(e){
      }
    });
  },
})
