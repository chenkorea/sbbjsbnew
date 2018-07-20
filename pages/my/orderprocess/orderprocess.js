// orderprocess.js
var Util = require('../../../utils/address.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userOrder: {},
    ordersProcess:[],
    hidePhone: '',
    userLocation: {},
    hasGuarantee:true
  },
  getUserShiFuOrdersProcess: function (orderId) {
    wx.showLoading({ title: '数据加载中...', })
    var that = this;
    
    Util.getUserShiFuOrdersProcess(function (data) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = data.data.code;
      if (code == "1") {
        that.setData({ ordersProcess: data.data.content })
      } else {
        // 失败
        that.setData({ ordersProcess: [] })
      }
    }, orderId);
  },
  toDetail: function () {
    var jsonStr = JSON.stringify(this.data.userOrder);
    wx.navigateTo({
      url: '../../my/myorder/myorder?jsonStr=' + jsonStr,
    })
  },

  getUserLocation: function (techid) {
    var that = this;

    Util.gettechlocation(function (data) {
      console.log(data);

      var code = data.data.code;
      if (code == "1") {
        var locations = data.data.content;
        if (locations && locations.length > 0) {
          var userLocation = locations[0];
          that.setData({ userLocation: userLocation })
        }

      } else {
        // 失败
        that.setData({ userLocation: [] })
      }
    }, techid);
  },
  /**
   * 显示技师位置地图
   */
  showLocation: function () {

    var latitude = this.data.userLocation.latitude;
    var longitude = this.data.userLocation.longitude;

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jsonStr = options.jsonStr;
    
    var userOrder = JSON.parse(jsonStr);
    if (typeof userOrder.guarantee === "undefined"
      || userOrder.guarantee == ""
      || typeof userOrder.guarantee_date_type === "undefined"
      || userOrder.guarantee_date_type == ""){
      this.setData({ hasGuarantee: false })
    }
    this.setData({ 
      userOrder: userOrder,
      hidePhone: userOrder.user_phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
    })

    console.log(userOrder.order_id);

    this.getUserShiFuOrdersProcess(userOrder.order_id);


    var tech_id = this.data.userOrder.process_person_id;
    console.log('tech_id==' + tech_id)
    this.getUserLocation(tech_id);
  },
  toPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.userOrder.user_phone,
    })
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
  
  }
})