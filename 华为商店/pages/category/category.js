var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    flag: 0,
    currentTab: 0,
    category: []
  },
  onLoad: function (options) {
    var page = this;
    this.loadCategory();
  },
  loadCategory:function(){
    var page = this;
    wx.request({
      url: host + '/api/category/getCategoryList',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var code = res.data.code;
        var category = res.data.data;
        if (code = '0000') {
          page.setData({ category: category });
        }
      }
    })
  },
  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({ currentTab: id });
    }
    page.setData({ flag: id });
  }
})