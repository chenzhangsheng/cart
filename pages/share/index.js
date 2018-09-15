
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true,
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    this.showMask()
    
  },
  onLoad: function () {
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

    let rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth/375;
      },
    })
    const ctx = wx.createCanvasContext('shareCanvas')
    // 小程序码
    const qrImgSize = 110
    // 底图
    // ctx.drawImage('../../images/backg.png', 0, 0, 380*rpx, 600*rpx)
    ctx.drawImage('../../images/backg.png', 0, 0, 320*rpx, 590*rpx)
    // 作者名称
    ctx.setTextAlign('center')    // 文字居中
    ctx.setFillStyle('#000000')  // 文字颜色：黑色
    ctx.setFontSize(10)         // 文字字号：22px
    ctx.fillText('长按识别二维码', (430 - qrImgSize)*rpx / 2, 500*rpx)
    // ctx.drawImage('../../images/ma.png', (380 - qrImgSize)*rpx / 2, 400*rpx, qrImgSize*rpx, qrImgSize*rpx)
    ctx.drawImage('../../images/ma.png', (320 - qrImgSize)*rpx / 2, 380*rpx, qrImgSize*rpx, qrImgSize*rpx)
    ctx.stroke()
    ctx.draw()

    // setTimeout(function () {
    //   wx.canvasToTempFilePath({
    //     canvasId: 'shareCanvas',
    //     success: function (res) {
    //       console.log(res.tempFilePath)
    //       wx.saveImageToPhotosAlbum({
    //         filePath: res.tempFilePath
    //       })
    //     }
    //   })
    // }, 2000)
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showMask:function(){
    this.setData({ flag: false })
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        console.log(res.tempFilePath,'保存到相册')
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath
        })
      }
    })
  },
  closeMask: function () {
    this.setData({ flag: true })
  },
})
