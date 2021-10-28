//app.js
import mqtt from "./utils/mqtt.js";
App({
  globalData: {
    userInfo: null,
    headerHeight : 0,
    statusBarHeight : 0,
    mqtt_client:null,
  },
  onLaunch: function (options) {
    let that = this;
    const { model, system, statusBarHeight } = wx.getSystemInfoSync();
    var headHeight;
    if (/iphone\s{0,}x/i.test(model)) {
      headHeight = 88;
    } else if (system.indexOf('Android') !== -1) {
      headHeight = 68;
    } else {
      headHeight = 64;
    }
    that.globalData.headerHeight = headHeight;
    that.globalData.statusBarHeight = statusBarHeight;
    //连接MQTT
    if(that.globalData.mqtt_client==null){
      that.connectMQ();
    }
  },
  
  //连接mqtt方法
  connectMQ:function(){
    let that = this
    // 连接选项
    //用过EMQ的应该知道，tcp端口为1883，ssl端口为8883，ws端口为8083，wss端口为8084
    const options = {
      connectTimeout: 4000, // 超时时间
      // 认证信息 按自己需求填写
      clientId: 'wx_vr_player:'+Math.floor(Math.random() * 10001),
      port: 8084,  //重点注意这个,默认443
      // username: 'Aienss',
      // password: 'password', 
    }

    // mqtt.connect([url], options)
    // const client = mqtt.connect('wxs://5gmqtt.dumbzarro.top/mqtt', options)
    // const client = mqtt.connect('wx://42.194.131.65/mqtt', options)
    // const client = mqtt.connect('wxs://1.15.135.81/mqtt', options)
    // const client = mqtt.connect('wxs://www.dumbzarro.top/mqtt', options)
    // const client = mqtt.connect('wxs://81.70.254.168/mqtt', options)

    // const client = mqtt.connect('wxs://42.194.131.65', options)
    // const client = mqtt.connect('wx://42.194.131.65', options)
    if(that.globalData.mqtt_client==null){
      that.globalData.mqtt_client=mqtt.connect('wxs://mqtt.dumbzarro.top/mqtt', options)
      
    }else{
      return ;
    }

    
    // const client = mqtt.connect(options)
    // console.log("client="+client)
 
    that.globalData.mqtt_client.on('connect', (e) => {
      console.log('成功连接服务器')
        //订阅一个主题
      // client.subscribe('phone_' + phone, { qos: 0 }, function (err) {
      //   if (!err) {
      //     // 
      //     console.log("订阅成功")
      //   }
      // })
      // mqtt.Client#publish(topic, message, [options], [callback])
      // that.data.client.publish("VrPlayer", that.data.Gyroscope)
      return ;
    })

    console.log("buggggggg")

    that.globalData.mqtt_client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
 
    that.globalData.mqtt_client.on('error', (error) => {
      console.log('连接失败:', error)
    })
 
    //监听mq的返回
    that.globalData.mqtt_client.on('message', function (topic, message, packet) {
      // message is Buffer
      console.log("packet", packet.payload.toString())
      that.globalData.mqtt_client.end()
    })
  },
  // testToken: function () {
  //   let that = this;
  //   wx.getStorage({
  //     key: "loginInfo",
  //     success: res => {
  //       console.log(res);
  //       that.globalData.token = res.data.token;
  //       that.globalData.userInfo = res.data.userInfo;
  //       // TODO 测试Token是否过期
  //       request({
  //         url: 'https://www.dontstayup.com:8089/user/checkToken',
  //         method: "POST",
  //         data: {
  //           token: that.globalData.token
  //         },
  //         header: {
  //           'content-type': 'application/x-www-form-urlencoded',
  //         },
  //       }).then(res=>{
  //         console.log(res)
  //         if(res.data.resultCode==200){
  //           that.haveToken();
  //         }else{
  //           that.noToken();
  //         }
  //       })
  //     },
  //     fail: err => {
  //       console.log(err)
  //       that.noToken();
  //     }
  //   })
  // },
  // noToken: function () {
  //   wx.switchTab({
  //     url: './pages/my/my',
  //   });
  //   toastException("请先授权登陆")
  // },
  // haveToken: function () {
  //   toastException("登陆成功")
  // }
})