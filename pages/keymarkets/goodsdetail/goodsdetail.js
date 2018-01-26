Page({
  data: {
    imgUrls: [
      'http://www.quanjing.com/image/2016index/gryy1.jpg',
      'http://www.quanjing.com/image/2016index/gryy2.jpg',
      'http://img.hb.aicdn.com/e1432b68297d3faed808ebac7007556596d9a3be1462-mA26Of_fw658',
      'http://www.quanjing.com/image/2016index/gryy3.jpg'
    ],
    imageWidth: wx.getSystemInfoSync().windowWidth,//图片宽度 
    indicatorDots: 4,
    name: '',
    brand: '',
    price: '',
    id: '',
    contentText: '程序设计过程中，我们常常用树形结构来表征某些数据的关联关系，如企业上下级部门、栏目结构、商品，省份存储，分类等等，通常而言，这些树状结构需要借助于数据库完成持久化。然而目前的各种基于关系的数据库，都是以二维表的形式记录存储数据信息，因此是不能直接将Tree存入DBMS，设计合适的Schema及其对应的CRUD算法是实现关系型数据库中存储树形结构的关键。理想中树形结构应该具备如下特征：数据存储冗余度小、直观性强；检索遍历过程简单高效；节点增删改查CRUD操作高效'
  },
  onLoad: function (info){
    var e = JSON.parse(info.infor)
    this.setData({
      name: e.name,
      brand: e.brand,
      price: e.price,
      id: e.sp_no,
      contentText: e.summary,
      // imgUrls: e.archives_url
    })
  },
  preview: function (e) {
    var str = JSON.stringify(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.imgUrls,
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})