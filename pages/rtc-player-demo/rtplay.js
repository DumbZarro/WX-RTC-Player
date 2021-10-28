const app = getApp()
import mqtt from "../../utils/mqtt.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    videoContext: {},
    fullScreen: false,
    playUrl: "http://txlive.dumbzarro.top/live/test.flv",
    // playUrl: "webrtc://txlive.dumbzarro.top/live/test",
    // playUrl: "rtmp://txlive.dumbzarro.top/live/test",
    orientation: "vertical",
    objectFit: "contain",
    muted: false,
    backgroundMuted: false,
    debug: false,
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    Gyroscope: {
      gyroX:0,
      gyroY:0,
      gyroZ:0,
    },
    client:null,
    init_flag:false,
    init_alpha:0,
    cycle:0,
    last_alpha:0
  },

  onLoad: function () {
    let that = this;
    console.log(app.globalData.mqtt_client)
    that.setData({
      client:app.globalData.mqtt_client
    })
     
    wx.startDeviceMotionListening({
      interval:"game",  //normal,game,ui
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err)
      }
    })
    wx.onDeviceMotionChange(
      res => {
        let that = this;
        if(that.data.init_flag==false){
          that.data.init_flag=true;
          that.data.init_alpha=res.alpha
        }
        let fix_alpha = res.alpha - that.data.init_alpha
        
        if(fix_alpha<0){
          fix_alpha+=360
        }

        if((that.data.last_alpha>270)&&(fix_alpha<90)){
          that.data.cycle += 1
        }
        if((that.data.last_alpha<90)&&(fix_alpha>270)){
          that.data.cycle -= 1
        }




        that.data.last_alpha = fix_alpha;

        let true_alpha = that.data.cycle*360 + fix_alpha  //真实度数



        
        that.setData({
          Gyroscope: {
            gyroX: parseInt(true_alpha),
            gyroY: parseInt(res.beta),
            gyroZ: parseInt(res.gamma),
          }
        })
        
        // 发送MQ
        console.log("发送的数据是")
        let message = JSON.stringify(that.data.Gyroscope)
        console.log(message)
        that.data.client.publish("VrPlayer", message)
      },
    )

    //  //开始监听陀螺仪
    //  wx.startGyroscope({
    //   interval:"game",  //normal,game,ui
    //   success: res => {
    //     // console.log("陀螺仪数据")
    //     // console.log(res);
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })

    // // 这个API接受的是一个回调函数
    // wx.onGyroscopeChange(
    //   res => {
    //     // console.log("陀螺仪数据")
    //     // console.log(res);

    //     let sendX=parseInt(res.x * 10)+that.data.Gyroscope.gyroX
    //     let sendY=parseInt(res.y * 10)+that.data.Gyroscope.gyroY
    //     let sendZ=parseInt(res.z * 10)+that.data.Gyroscope.gyroZ
    //     that.setData({
    //       Gyroscope: {
    //         gyroX: sendX,
    //         gyroY: sendY,
    //         gyroZ: sendZ,
    //       }
    //     })
    //     // 发送MQ
    //     console.log("发送的数据是")
    //     let message = JSON.stringify(that.data.Gyroscope)
    //     console.log(message)
    //     // that.data.client.publish("VrPlayer", message)
    //   },
    // )

  },
  


  onScanQR: function () {
    this.stop();
    this.createContext();
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        self.setData({
          playUrl: res.result
        })
      }
    })
  },

  onPlayClick: function () {
    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {} else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {}
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.videoContext.play();
      console.log("video play()");
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.videoContext.stop();
      console.log("video stop()");
      wx.hideLoading();
    }
  },

  onOrientationClick: function () {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }

    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug
    })
    var that = this;
    setTimeout(() => {
      that.setData({
        exterFlag: !that.data.exterFlag
      })
    }, 10)
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },

  onFullScreenClick: function () {

    if (!this.data.fullScreen) {
      this.data.videoContext.requestFullScreen({
        direction: 0,

      })

    } else {
      this.data.videoContext.exitFullScreen({

      })
    }
  },

  onPlayEvent: function (e) {
    console.log(e.detail.code);
    if (e.detail.code == -2301) {
      this.stop();
      wx.showToast({
        title: '拉流多次失败',
      })
    }
    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onFullScreenChange: function (e) {
    this.setData({
      fullScreen: e.detail.fullScreen
    })
    console.log(e);
    wx.showToast({
      title: this.data.fullScreen ? '全屏' : '退出全屏',
    })
  },

  stop: function () {
    this.setData({
      playing: false,
      // playUrl: "rtmp://2157.liveplay.myqcloud.com/live/2157_wx_live_test1",
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      fullScreen: false,
      backgroundMuted: false,
      debug: false,
      exterFlag: false,
    })
    this.data.videoContext.stop();
    wx.hideLoading();
  },

  createContext: function () {
    this.setData({
      videoContext: wx.createLivePlayerContext("video-livePlayer")
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.createContext();
    console.log(this.data.videoContext);

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.stop();

    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      // title: '直播播放器',
      // path: '/pages/play/play',
      path: '/pages/home-page/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  }
})