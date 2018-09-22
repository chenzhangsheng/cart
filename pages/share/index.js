
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true,
    shareTextflag:false,
    shareNum:100,
    qrCodeUrl:"",
    shareCount: 0,
    loading: false,
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  getPhoneNumber: function (e) {
    console.log(e,99999999)
    if(e.detail.errMsg!='getPhoneNumber:ok'){
      return;
    }
    var that = this;
    that.setData({ loading: true })
    var userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo.wxPhone + ":" + userInfo.qrcodeUrl)
    if (userInfo.wxPhone){
      that.setData({
        qrCodeUrl: userInfo.qrcodeUrl,
      })
      that.drawpopPic()
      setTimeout(this.showMask, 2000)
    }else{
      wx.request({
        method: 'POST',
        url: `${app.globalData.API_URL}/app/getphone`,
        header: { 'Content-Type': 'application/json' },
        data: {
          'openId': wx.getStorageSync('openId'),
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv,
          'sessionKey': wx.getStorageSync('sessionKey')
        },
        success: function (res) {
          let result = JSON.parse(JSON.stringify(res)).data;
          console.log(result.data)
          if (result.code == 200) {
            that.setData({
              qrCodeUrl: result.data,
            })
            that.drawpopPic()
            setTimeout(this.showMask, 2000)
          }
        },
        fail: function (res) {
          console.log(JSON.stringify(res))
        }
      })
    }
  },
  onLoad: function () {
    var that = this 
    wx.request({
      method: 'POST',
      url: `${app.globalData.API_URL}/app/getCount`,
      header: { 'Content-Type': 'application/json' },
      data: {
        'openId': wx.getStorageSync('openId'),
      },
      success: function (res) {
        let result = JSON.parse(JSON.stringify(res)).data;
        if (result.code == 200) {
          that.setData({
            shareCount: result.data
          });
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log("index else")
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  onReady: function () {
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  drawpopPic:function(){
    var that = this 
    let rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth/375;
      },
    })

    wx.getImageInfo({
      src: that.data.qrCodeUrl,//服务器返回的带参数的小程序码地址
      success: function (res) {
        //res.path是网络图片的本地地址
        let qrCodePath = res.path;
        that.setData({
          localImageUrl: qrCodePath
        })
        const ctx = wx.createCanvasContext('shareCanvas')
        // 小程序码
        const qrImgSize = 110
        // 底图
        ctx.drawImage('../../images/backg.png', 0, 0, 320 * rpx, 590 * rpx)
        // 作者名称
        ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#000000')  // 文字颜色：黑色
        ctx.setFontSize(10)         // 文字字号：22px
        ctx.fillText('长按识别二维码', (430 - qrImgSize) * rpx / 2, 500 * rpx)
        console.log("qrCodeUrl=" + that.data.qrCodeUrl)
        ctx.drawImage(that.data.localImageUrl, (320 - qrImgSize) * rpx / 2, 380 * rpx, qrImgSize * rpx, qrImgSize * rpx)
        ctx.stroke()
        ctx.draw()
      },
    });
  },
  savepopPic:function(){
    var that = this 
    wx.getSetting({
      success(res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.canvasToTempFilePath({
                canvasId: 'shareCanvas',
                success: function (res) {
                  console.log(res.tempFilePath, '保存到相册')
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath
                  })
                  that.setData({ shareTextflag: true })
                
                }
              })
            }
          })
      }
    })
   
  },
  showMask:function(){
    var that = this;
    that.savepopPic()
    that.setData({ flag: false })
    that.setData({ loading: false })
  },
  closeMask: function () {
    var that = this;
    that.setData({ flag: true, shareTextflag: false })
  },
})
