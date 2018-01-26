//keymarkets.js

//获取应用实例
var app = getApp();
var request = require('./util/datarequest.js');
var market_util = require('./util/utils.js');
var urlutil = require('../utils/util.js');
Page({
  data:{
    goods: []
  },
  onLoad:function(options){
    var that = this
    console.log(',isnull:' + (options.cid == null));
    // 获取商品列表
    if (options.cid == null){
      request.getallgoods('', function (res) {
        if (res.data.code == '1') {
          for (var i = 0; i < res.data.content.length; i++) {
            var urls = [];
            if (res.data.content[i].archives_url == undefined){
              urls.push(urlutil.no_pic);
              res.data.content[i]['archives_url'] = urls
            }else{
              var url = res.data.content[i].archives_url.split(',');
              for (var j = 0; j < url.length; j++) {
                if (url[j] != '') {
                  urls.push(getApp().globalData.imageServerIp + url[j])
                }
              }
              res.data.content[i].archives_url = urls
            }
          }
          that.setData({
            goods: res.data.content
          })
        }
      });
    }else{
      request.getallgoods(options.cid, function (res) {
        if (res.data.code == '1') {
          for (var i = 0; i < res.data.content.length; i++) {
            var urls = [];
            if (res.data.content[i].archives_url == undefined) {
              urls.push(urlutil.no_pic);
              res.data.content[i]['archives_url'] = urls
            } else {
              var url = res.data.content[i].archives_url.split(',');
              for (var j = 0; j < url.length; j++) {
                if (url[j] != '') {
                  urls.push(getApp().globalData.imageServerIp + url[j])
                }
              }
              res.data.content[i].archives_url = urls
            }
          }
          that.setData({
            goods: res.data.content
          })
        }
      });
    }
    
    
  },
  chooseclsfy:function(){
    wx.redirectTo({
      url: './goodsclsfy/goodsclsfy',
    })
  },
  goodsdetail:function(e){
    // 获取商品
    var goods = e.currentTarget.dataset.item;
    goods.selectnum = '1'
    wx.getStorage({
      key: 'selctgoodsAr',
      success: function(res) {
        console.log(res.data);
        var goodsAr = res.data;
        goodsAr[goodsAr.length] = goods;
        wx.setStorage({
          key: 'selctgoodsAr',
          data: goodsAr,
        })
        wx.navigateBack({})
      },
      fail: function () {
        var goodsAr = [];
        goodsAr[0] = goods;
        wx.setStorage({
          key: 'selctgoodsAr',
          data: goodsAr,
        })
        wx.navigateBack({})
      }
    })
  }
})