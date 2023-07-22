var app = getApp();
var host = app.globalData.host;
var timer;
var timeSecond = false, sendBolen = false;
Page({
  data: {
    currentTab: 0,
    form_info: '',
    yzmvalue: '获取验证码',
    mobile: '',
    timevalue: 60,
    flag: true,
    verifyCode: '',
    code: '',
    winHeight:500
  },
  onLoad: function (options) {
    this.getNewCode();
  },
  getNewCode: function () {//登录页面进行一次获取新的code,用户登录凭证（有效期五分钟）
    var that = this;
    wx.login({
      success: function (data) {
        that.setData({
          code: data.code
        });
      }
    })
  },
  switchNav: function (e) {//账号密码登录和手机快捷登录切换
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({ currentTab: e.target.dataset.current });
      that.setData({ form_info: '' });
    }
  },
  toRegister: function (e) {//跳转注册页面
    wx.navigateTo({
      url: '../register/register'
    })
  },
  formSubmit: function (e) {//表单登录，进行提交
    var that = this;
    var loginName = e.detail.value.loginName;
    var mobile = e.detail.value.mobile;
    var loginPassword = e.detail.value.loginPassword;
    var verifyCode = e.detail.value.verifyCode;
    var loginType = that.data.currentTab;
    var code = that.data.code;
    //验证表单输入
    var ret = that.checkLogin(loginName, mobile, loginPassword, verifyCode, loginType);
    if (ret) {
      wx.request({
        url: host + '/api/user/swxLogin',
        method: 'GET',
        data: { 'loginName': loginName, 'mobile': mobile, 'loginPassword': loginPassword, 'verifyCode': verifyCode, 'loginType': loginType, 'code': code },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          var code = res.data.code;
          var msg = res.data.data;
          if (code == '0000') {
            app.globalData.userId = res.data.data.user.userId;
            wx.setStorageSync('userId', res.data.data.user.id);
            wx.setStorageSync('nickName', res.data.data.user.nickName)
            wx.setStorageSync('swx_session', res.data.data.swx_session);
            wx.setStorageSync('userMobile', res.data.data.user.mobile);
            wx.setStorageSync('openId', res.data.data.openId);
            wx.setStorageSync('token', res.data.data.token);
            wx.reLaunch({
              url: '../index/index'
            })
            console.log("2")
          } else {
            that.showTip(msg);
            return false
          }
        }
      })
    }
  },
  checkLogin: function (loginName, mobile, loginPassword, verifyCode, loginType) {//校验登录表单参数
    var that = this;
    if (loginType == 0) {
      if (loginName == "") {
        that.showTip('用户名不能为空！');
        return false
      }
      if (loginPassword == '') {
        that.showTip('密码不能为空！');
        return false
      }
    } else {
      if (mobile == '') {
        that.showTip('手机号不能为空！');
        return false
      }

      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(mobile)) {
        that.showTip('手机号不合法！');
        return false;
      }

      if (verifyCode == '') {
        that.showTip('验证码不能为空！');
        return false
      }
    }
    return true
  },
  showTip:function(message){//弹出消息提示
    wx.showModal({
      title: '温馨提示',
      showCancel:false,
      content: message
    })
  },
  getcode: function (e) {//获取验证码
    var that = this;
    if (that.data.mobile == "") {
      that.showTip('请输入手机号！');
      return false;
    }
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(that.data.mobile)) {
      that.showTip('手机号不合法！');
      return false;
    }
    that.setData({ flag: false });//显示时间
    timer = setInterval(that.settime, 1000);//验证码倒计时
    wx.request({
      url: host + '/api/user/getVerifyCode',
      method: 'GET',
      data: {
        'mobile': this.data.mobile
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var code = res.data.code;
        var msg = res.data.data;
        if (code == '0000') {
         // clearInterval(timer);
          that.setData({ verifyCode: msg });
        } else {
          clearInterval(timer);
          that.setData({
            yzmvalue: '获取验证码',
            timevalue: 60,
            flag: true
          });
          that.showTip(msg);
          return false
        }
      }
    })

    console.log(this.data.mobile);
    console.log(e);
  },
  getMobile: function (e) {//获取手机号
    this.setData({
      mobile: e.detail.value
    })
  },
  settime: function () {//验证码倒计时
    var timevalue = this.data.timevalue;

    if (timevalue == 0) {
      clearInterval(timer)
      this.setData({
        yzmvalue: '重新获取',
        timevalue: 60,
        flag: true
      })
      timeSecond = false;
      sendBolen = false;
      return;
    }
    timevalue--;
    timeSecond = true;
    sendBolen = true;
    this.setData({
      timevalue: timevalue,
      flag: false
    })
  },
})