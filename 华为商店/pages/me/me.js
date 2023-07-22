var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    nickName: '授权登录',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    headIcon:'/pages/images/icon/head.png'
  },
  onLoad: function(options) {
    this.checkLogin();
  },
  bindGetUserInfo: function (e) {//授权登录
    var data = e.detail.userInfo;
    this.setData({
      nickName: data.nickName,
      headIcon: data.avatarUrl
    });
  },
  switchLogin: function () {//切换账号登录
    wx.navigateTo({
      url: '../login/login',
    })
  },
  checkLogin: function() {//校验登录，优先使用账号登录，再使用微信授权登录
    var userId = wx.getStorageSync("userId");
    if (userId != null && userId != "") {
      this.setData({
        nickName: wx.getStorageSync("nickName")
      });
    }else{
      var that = this;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({// 已经授权，可以直接调用 getUserInfo 获取头像昵称
              success: function (res) {
                var data = res.userInfo;
                that.setData({
                  nickName: data.nickName,
                  headIcon: data.avatarUrl
                });
              }  
            })
          }
        }
      })
    } 
  }
})