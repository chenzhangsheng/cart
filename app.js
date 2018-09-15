//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    console.log("wx.getStorageSync('openId')=" + (wx.getStorageSync('openId') == ""))
    if (wx.getStorageSync('openId') == "") { // 第一次登录
       wx.login({
        success: res => {
          wx.setStorageSync('code', res.code)
          wx.request({
            method: 'POST',
            url: `${this.globalData.API_URL}/app/login`,
            data: {
              code: wx.getStorageSync('code'),
            },
            success: function (res) {
              console.log("login result=" + res.data.code )
              if (res.data.code == 200) {
                wx.setStorageSync('openId', res.data.data.openid)
                console.log('sessionKey=' + res.data.data.session_key)
                wx.setStorageSync('sessionKey', res.data.data.session_key)
              }
            }
          })
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  
  globalData: {
    userInfo: null,
    API_URL: 'http://localhost:9090',
  },

})