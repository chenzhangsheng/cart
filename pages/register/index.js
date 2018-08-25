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
  },
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
  formSubmit: function (e) {
    var that = this;
    form_data = e.detail.value;
    // 选择器的值需要手动塞入
    console.log(form_data, this.data.region, this.data.driverDate,this.data.vehicleRegisteDate)
    console.log( that.data.tempFilePaths, that.data.tempFilePaths.length );
    let isformFull =  Object.keys(form_data)
    .map(key => form_data[key])
    .every(item => {
      return item != '' ;
    });
    if(isformFull){
      if(that.data.tempFilePaths.length===4){
        for( let a = 0; a < that.data.tempFilePaths.length; a++){
          console.log(that.data.tempFilePaths[a]);
          console.log('调用上传的逻辑');
          that.btn_up(that.data.tempFilePaths[a])
        } 
      }else{
        wx.showToast({
          title: '请上传完整的认证照片',
        })
      }
    } else {
      wx.showToast({
        title: '请填写完整认证信息',
      });
    };
  },
  btn_up: function (e) {
    let that = this;
    console.log(this,'btn_up', e)
    //  拿到了四个本地的地址 请求上传图片的处理逻辑
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
      filePath: e,
      name: 'file',
      formData:{
        'user': 'test'
      },
      success: function(res){
        var data = res.data
        //do something
      }
    })
  }

});