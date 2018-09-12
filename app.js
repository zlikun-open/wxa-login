// https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html
App({

  /**
   * 自定义全局变量
   */
  globals: {
    userInfo: null
  },

  /**
   * 小程序初始化完成时（全局只触发一次）
   */
  onLaunch: function(obj) {
    console.log('onLaunch', obj)
  },

  /**
   * 小程序启动，或从后台进入前台显示时
   */
  onShow: function(obj) {
    console.log('onShow', obj)
  },

  /**
   * 小程序从前台进入后台时
   */
  onHide: function() {
    console.log('onHide')
  },

  /**
   * 小程序发生脚本错误，或者 api 调用失败时触发，会带上错误信息
   */
  onError: function(error) {
    console.log('onError', error)
  },

  /**
   * 小程序要打开的页面不存在时触发，会带上页面信息回调该函数
   */
  onPageNotFound: function(obj) {
    console.log('onPageNotFound', obj)
  },


})