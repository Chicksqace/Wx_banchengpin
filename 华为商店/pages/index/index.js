var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: [
      "/pages/images/haibao/1.jpg",
      "/pages/images/haibao/2.jpg",
      "/pages/images/haibao/3.jpg"
    ],
    navs:[
      {
        "img": "/pages/images/icon/hwzq.jpg",
        "name":"华为专区"
      },
      {
        "img": "/pages/images/icon/ryzq.jpg",
        "name": "荣耀专区"
      },
      {
        "img": "/pages/images/icon/lqzx.jpg",
        "name": "领券中心"
      },
      {
        "img": "/pages/images/icon/axjj.jpg",
        "name": "安心居家"
      },
      {
        "img": "/pages/images/icon/pt.jpg",
        "name": "拼团"
      }
    ],
    hotList:[],
    phoneList:[],
    pcList:[],
    host: host
  },
  onLoad: function (options) {
    var page = this;
    page.getBannerList();
    page.getGoodsList();
  },
  getBannerList: function () {//获取海报轮播图片
    var page = this;
    wx.request({
      url: host + '/api/banner/getBannerList?type=1',
      method: 'GET',
      data: { },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var code = res.data.code;
        var list = res.data.data;
        if (code == '0000') {
          var code = res.data.code;
          var list = res.data.data;
          if (code == '0000') {
            var imgUrls = new Array();
            for (var i = 0; i < list.length; i++) {
              imgUrls.push(host + "/" + list[i].url);
            }
            console.log(imgUrls);
            page.setData({ imgUrls: imgUrls });
          } 
        } 
      }
    })
  },
  getGoodsList: function () {//获取商品图片
    var page = this;
    wx.request({
      url: host + '/api/goods/getHomeGoodsList',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var book = res.data.data;
        var phoneList = book.rmjs;
        var pcList = book.mssk;
        page.setData({ hotList: phoneList.concat(pcList) });//精品推荐列表
        page.setData({ phoneList: phoneList });//手机列表
        page.setData({ pcList: pcList });//笔记本电脑列表
      }
    })
  },
  onShareAppMessage: function () {// 用户点击右上角分享
    return {
      title: '华为商城', // 分享标题
      desc: '华为商城是华为旗下面向全国服务的电子商务平台官网,提供正品华为手机(华为P30系列、华为Mate20系列、华为nova系列、荣耀9X、荣耀智慧屏、荣耀20、荣耀V20等', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },
})