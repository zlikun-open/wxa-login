const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false
  },

  onLoad: function(e) {
    if (app.globals.userInfo) {
      this.setData({
        userInfo: app.globals.userInfo,
        hasUserInfo: true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globals.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },

  /**
   * 获取用户信息事件
   * https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject
   */
  onGotUserInfo: function(e) {
    // encryptedData: "E/no4mpQWV9aib5bbXGo1eJjDH96KVSGb6t5Sj3bjHLor32g0RI9HXtfUCH8ezLLlAPRxqXYNPU8Nkf2IYMln/Nv+1BWP8QquD1R/dq75APnQttzlivI6LIj4eQn1+mH/aZP9wz8TSE55Gnx87MelxR4y9s8beZcFxDG9mRtaWZ0Jj4yiu7X2j8LGO8yJeYNOs92cgai1IRJ4OopvjCpKehhPHnLFu7tOPudrxG4KQjEczbYhFQiH/rrQEVtdc+Er45NBny9u0C2X0Xp0dIH0CFckNovZgD0n75Yq3yWndLqEgZz9OYL2m/jXorapPrbS9tJqS1hpWr3GaSlXfaJOGWud2exkL1gKdw3U5BNRbx4WsSJepQyjy0VgXFd8sCYKK5+npH5SiYrkZoX2i0TwNb0N4SOi4OKqJkFYp2Rf8Ovwr0JWZNl5ZLGs0Nr9622TEIX9qXJqAEIj6aC37TOaQ=="
    // errMsg: "getUserInfo:ok"
    // iv: "qpiCIMGLeAKbL2G0gS3JiA=="
    // rawData: "{"nickName":"张立坤","gender":1,"language":"zh_CN","city":"","province":"","country":"中国","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIbokXDSvh8RNZTVYIFPu3RFw1UAfV7ZZ8Rh2RUTWzcwSvM7h8CxYAxjQRcYOk2nvWGicqIqTriaj8A/132"}"
    // signature: "b7248b7bd08a1d17e3a82d974bb60edf8c10ab38"
    // userInfo: $JSON
    console.log('onGotUserInfo', e.detail)
    if (e.detail.errMsg == "getUserInfo:ok") {
      // 这里已经取得用户基本信息（昵称、头像等），但其它信息需要与后端交互才能取得
      app.globals.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      // 执行登录
      const that = this
      // 检查sessionKey是否过期
      wx.checkSession({
        success: function() {
          //session_key 未过期，并且在本生命周期一直有效
          console.log("session_key尚未过期，不需要重新登录")
        },
        fail: function() {
          // session_key 已经失效，需要重新执行登录流程
          that.doLogin(function(token) {
            // 执行用户信息验签
            e.detail.token = token
            // 执行验签
            that.verifySignature(e.detail)
            // 执行解密
            that.decrypt(e.detail)
          })

        }
      })





    } else {
      // getUserInfo:fail auth deny
      console.log('onGotUserInfo', '授权被拒绝了！', e.detail.errMsg)
    }

  },

  /**
   * 执行登录
   * https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html
   */
  doLogin: function(fn) {
    console.log('mine', 'Login')
    wx.login({
      timeout: 200,
      success: res => {
        // res.errMsg, res.code
        console.log('mine', res)
        // 发起网络请求，实现登录
        wx.request({
          url: 'http://wx.zlikun.com/wxa/login',
          data: {
            "code": res.code
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            // res.statusCode: 200
            // res.header: $JSON
            // res.errMsg: "request:ok"
            // res.data: $JSON
            console.log(res)
            // 全局存储登录凭证
            app.globals.loginToken = res.data
            // 执行回调函数
            fn(res.data)
          }
        })
      }
    })
  },

  /**
   * 执行验签操作<br>
   * https://developers.weixin.qq.com/miniprogram/dev/api/signature.html<br>
   * 1. 通过调用接口（如 wx.getUserInfo）获取数据时，接口会同时返回 rawData、signature，其中 signature = sha1( rawData + session_key )<br>
   * 2. 开发者将 signature、rawData 发送到开发者服务器进行校验。服务器利用用户对应的 session_key 使用相同的算法计算出签名 signature2 ，比对 signature 与 signature2 即可校验数据的完整性。<br>
   * 3. 对 encryptedData 字段解密，取得unionId等关键信息<br>
   * 4. 由于验签时需要使用session_key，这意味着需要先登录：wx.login()
   */
  verifySignature: function(data) {
    console.log('mine', 'verify', data)
    wx.request({
      url: 'http://wx.zlikun.com/wxa/verify',
      data: {
        token: data.token,
        rawData: data.rawData,
        signature: data.signature,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        // 返回验签是否成功（仅供测试）
        console.log(res.data) // true
      }
    })

  },

  /**
   * 对查询用户API返回信息进行解密
   */
  decrypt: function(data) {
    console.log('mine', 'verify', data)
    wx.request({
      url: 'http://wx.zlikun.com/wxa/decrypt',
      data: {
        token: data.token,
        encryptedData: data.encryptedData,
        iv: data.iv
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        // 返回解密是否成功
        console.log(res.data) // OK
      }
    })
  },

  /**
   * 获取用户手机事件
   * https://developers.weixin.qq.com/miniprogram/dev/api/getPhoneNumber.html
   * 目前该接口针对非个人开发者，且完成了认证的小程序开放（不包含海外主体）
   */
  onGotPhoneNumber: function(e) {
    // 获取手机号需要先登录

    // getPhoneNumber:fail 该 appid 没有权限
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

})