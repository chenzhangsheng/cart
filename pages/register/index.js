const app = getApp();
let form_data;
Page({
  data: {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      index: 0,
      region: ['浙江省', '温州市', '全部'],
      customItem: '全部',
      driverDate:'2000-01-01',
      vehicleRegisteDate:'2000-01-01',
      date: '',
      date1: '',
      tempFilePaths: [],
      actions5: [
        {
          name: '取消'
        },
        {
          name: '提交',
          color: '#ed3f14',
          loading: false
        }
      ],
      visible5: false,
      showFlag: true,
  },
  // onLoad: function () {
  //   var that = this
  //   var userInfo = wx.getStorageSync('userInfo')
  //   if (userInfo.cartIdNumber){
  //     console.log("显示审核中")
  //   }
  // },
  onShareAppMessage() {
    return {
      title: '司机师傅',
      path: '/pages/register/index',
      // imageUrl: 'url',
      success: res => {
        wx.showModal({
          title: '提示',
          content: '分享成功!',
        })
      },
      fail: () => {},
      complete: () => {}
    };
  },
  onPullDownRefresh: function(){
    wx.startPullDownRefresh()
  },
  binddriverDateChange: function (e) {
    console.log('driverDate选择改变，携带值为', e.detail.value)
    this.setData({
      driverDate: e.detail.value
    })
  },
  bindvehicleRegisteDateChange: function (e) {
    console.log('vehicleRegisteDate选择改变，携带值为', e.detail.value)
    this.setData({
      vehicleRegisteDate: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  img_item: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          ['tempFilePaths[' + e.target.id + ']']: res.tempFilePaths[0]
        })
      }
    })
  },
  handle({ detail }) {
    var that = this;
    console.log(detail,'this is detail')
    if (detail.index === 0) {
      this.setData({
        visible5: false
      });
    } else {
      const action = [...this.data.actions5];
      action[1].loading = true;
      this.setData({
        actions5: action
      });
      that.btn_up(that.data.tempFilePaths, 0)
      wx.request({
        method: 'POST',
        url: `${app.globalData.API_URL}/app/updateCart`,
        header: { 'Content-Type': 'application/json' },
        data: {
          'openId': wx.getStorageSync('openId'),
          'form_data': form_data,
          'region': this.data.region,
          'driverDate': this.data.driverDate,
          'vehicleRegisteDate': this.data.vehicleRegisteDate
        },
        success: function (res) {
          // if (getCurrentPages().length != 0) {
          //   //刷新当前页面的数据
          //   getCurrentPages()[getCurrentPages().length - 1].onLoad()
          // }
          wx.showToast({
            title: '提交成功',
            icon: 'succes',
            duration: 1000,
            mask:true
          })
          // wx.switchTab({
          //   url: '/pages/share/index'
          // })
        }
      })
    }
  },
  formSubmit: function (e) {
    var that = this;
    form_data = e.detail.value;
    let isformFull =  Object.keys(form_data)
    .map(key => form_data[key])
    .every(item => {
      return item != '' ;
    });
    if(isformFull){
      if(that.data.tempFilePaths.length===4){
          this.setData({
            visible5: true
          });
      }else{
        console.log("认证照片不完整")
        wx.showToast({
          title: '认证照片不完整',
        })
      }
     }else {
      wx.showToast({
        title: '填写完整信息',
       });
    };
  },
  btn_up: function (e,i) {
    let that = this;
    let openId = wx.getStorageSync('openId')
    if(i > 3){
      const action = [...this.data.actions5];
      action[1].loading = false;
      that.setData({
        visible5: false,
        actions5: action
      });
    }else{
      wx.uploadFile({
        url: `${app.globalData.API_URL}/app/upload`,
        filePath: e[i],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          'openId': openId,
          'id': i
        },
        success: function (res) {
          let result = JSON.parse(JSON.parse(JSON.stringify(res)).data);
          console.log("上传图片结果=" + result.code)
          if (result.code == 200) {
            i++;
            that.btn_up(that.data.tempFilePaths, i)
          }
        }
      })
    }
  }

});