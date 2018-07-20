//goodsclsfy.js
var market_util = require('../util/datarequest.js');
Page({
  data: {
    navItems: [],
    curNav: 0,
    curIndex: 0
  },
  onLoad: function () {
    // 加载的使用进行网络访问，把需要的数据设置到data数据对象

    var that = this
    market_util.getgoodsclsfy(function(res){
      that.setData({
        navItems: res.data.content
      })
    });
  },

  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  //分类项点击
  responseclsfy:function(e){
    wx.redirectTo({
      url: '../keymarkets?cid=' + e.currentTarget.dataset.code
    })
  }

})