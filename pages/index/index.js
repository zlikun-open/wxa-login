// https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html

// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面第一次渲染使用的初始数据
   */
  data: {
    motto: '测试小程序',
  },

  /**
   * 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
   */
  onLoad: function(query) {
    console.log('index', 'onLoad', query)
  },

  /**
   * 页面显示/切入前台时触发。
   */
  onShow: function() {
    console.log('index', 'onShow')
  },

  /**
   * 页面隐藏/切入后台时触发。 如 navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
   */
  onHide: function() {
    console.log('index', 'onHide')
  },

  /**
   * 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
   * 注意：对界面内容进行设置的 API 如wx.setNavigationBarTitle，请在onReady之后进行。
   * https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html#生命周期
   */
  onReady: function() {
    console.log('index', 'onReady')
  },

  /**
   * 页面卸载时触发。如redirectTo或navigateBack到其他页面时。
   */
  onUnload: function() {
    console.log('index', 'onUnload')
  },

})