//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    order: ''
  },
  onLoad: function (e) {
    var res = JSON.parse(e.oder)
    this.setData({
      order: res
    })
  }
})
