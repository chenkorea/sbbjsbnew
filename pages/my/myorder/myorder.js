
//获取应用实例
var Util = require('../../../utils/address.js')
var app = getApp()
Page({
  data: {
    titleText: '',
    userOrder: {},
    hasGuarantee:true,
    selectPicAr: [],
    imageWidth: getApp().screenWidth / 4 - 10
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserOrderPic: function (orderId) {
    wx.showLoading({ title: '数据加载中...', })
    var that = this;

    Util.getUserOrderPic(function (data) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = data.data.code;
      if (code == "1") {
        var pics = data.data.content;
        if (pics != null && pics.length > 0) {
          var nowPics = [];
          for (var i = 0; i < pics.length; i++) {
            nowPics[i] = getApp().globalData.imageServerIp + pics[i].archives_url;
          }
          that.setData({ selectPicAr: nowPics});
        } else {
          that.setData({ selectPicAr: [] })
        }
      } else {
        // 失败
        that.setData({ selectPicAr: [] })
      }
    }, orderId);
  },
  /**
   * 查看图片信息
   */
  seeMovieInfo: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    var typename = e.currentTarget.dataset.type;
    if (typename == 'open') {
      var count = that.data.selectPicAr.length;
      wx.previewImage({
        current: that.data.selectPicAr[index], // 当前显示图片的http链接
        urls: that.data.selectPicAr // 需要预览的图片http链接列表
      })
    }
  },
  onLoad: function (optains) {
    var jsonStr = optains.jsonStr;
    var userOrder = JSON.parse(jsonStr);
    if (typeof userOrder.guarantee === "undefined"
      || userOrder.guarantee == ""
      || typeof userOrder.guarantee_date_type === "undefined"
      || userOrder.guarantee_date_type == "") {
      this.setData({ hasGuarantee: false })
    }
    var that = this
    that.setData({ userOrder: userOrder})
    that.getUserOrderPic(userOrder.order_id);
  }
})
