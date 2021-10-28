// pages/main/main.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: 0,
    tapTime: '',		// 防止两次点击操作间隔太快
    entryInfos: [
      { icon: "../Resources/play.png", title: "test", desc: "<mlvb-live-room>", navigateTo: "../RTCplayer-mqtt/RTCplayer-mqtt" },
      { icon: "../Resources/push.png", title: "test", desc: "<live-pusher>", navigateTo: "../RTCplayer-mqtt/RTCplayer-mqtt" },
      { icon: "../Resources/play.png", title: "test", desc: "<live-player>", navigateTo: "../live-player-demo/play" },
      { icon: "../Resources/rtplay.png", title: "低延时播放", desc: "<live-player>", navigateTo: "../rtc-player-demo/rtplay" }

    ],
    headerHeight: app.globalData.headerHeight, //
    statusBarHeight: app.globalData.statusBarHeight,
  },

  onEntryTap: function (e) {
    if (this.data.canShow) {
    // if(1) {
      // 防止两次点击操作间隔太快
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
        return;
      }
      var toUrl = this.data.entryInfos[e.currentTarget.id].navigateTo;
      console.log(toUrl);
      console.log(app.globalData.mqtt_client)
      if(app.globalData.mqtt_client.connected==false){
        wx.showModal({
          title: '网络问题',
          content: '未连接mqtt,请稍后再试',
          showCancel: false
        });
      }else{
        wx.navigateTo({
          url: toUrl,
        });
      }
      this.setData({ 'tapTime': nowTime });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
        showCancel: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
  },
  // getUserProfile(e) {
  //   let that=this;
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  //   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       app.globalData.userInfo=res.userInfo
  //       console.log("app.globalData.userInfo=")
  //       console.log(app.globalData.userInfo)

  //       wx.login({
  //         success(res) {
  //           if (res.code) {
  //             request({
  //               url: 'https://www.dontstayup.com:8089/user/login',
  //               method:"POST",
  //               data: {
  //                 code: res.code,
  //                 name:app.globalData.userInfo.nickName,
  //                 avatar:app.globalData.userInfo.avatarUrl
  //               },
  //               header: {
  //                 'content-type': 'application/x-www-form-urlencoded'
  //               },
  //             }).then(res=>{
  //               console.log("login res:");
  //               console.log(res);

  //               app.globalData.token=res.header.token
  //               wx.removeStorage({
  //                 key:"loginInfo",
  //                 success:res=>{
  //                   console.log(res)
  //                 },
  //                 fail:err=>{
  //                   console.log(err)
  //                 }
  //               })
  //               wx.setStorage({
  //                 key:"loginInfo",
  //                 data:{
  //                   token:res.header.token,
  //                   userInfo:app.globalData.userInfo
  //                 },
  //                 success:res=>{
  //                   console.log(res)
  //                 },
  //                 fail:err=>{
  //                   console.log(err)
  //                 }
  //               })
  //               console.log("app.globalData.token=")
  //               console.log(app.globalData.token)
  //               that.setData({
  //                 isLogin:true,
  //                 name:app.globalData.userInfo.nickName,
  //                 avatar:app.globalData.userInfo.avatarUrl
  //               })
  //             })
  //           }
  //         }
  //       })
  //     }
  //   }) 
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    if(!wx.createLivePlayerContext) {
      setTimeout(function(){
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
          showCancel: false
        });
      },0);
    } else {
      // 版本正确，允许进入
      this.data.canShow = 1;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage");
    return {
      title: '5GVR播放器',
      path: '/pages/home-page/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  }
})