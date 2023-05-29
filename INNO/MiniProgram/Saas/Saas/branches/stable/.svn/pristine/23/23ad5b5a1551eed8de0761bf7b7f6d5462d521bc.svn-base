// components/custom/alert.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    title: "标题",
    content: "内容",
    show_cancel: true,
    cancel_btn: "取消",
    cancel_callback: {},
    show_confirm: true,
    confirm_btn: "确定",
    confirm_callback: {},
    //
    show_alert: false,
    alert_animate: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setAlertTitle(content) {
      if (!content) {
        return
      }
      this.setData({
        title: content
      })
    },
    setAlertContent(content) {
      if (!content) {
        return
      }
      this.setData({
        content: content
      })
    },
    setAlertCancel(show, content, callback) {
      this.setData({
        show_cancel: show,
        cancel_btn: content ? content : '',
        cancel_callback: callback,
      })
    },
    setAlertConfirm(show, content, callback) {
      this.setData({
        show_confirm: show,
        confirm_btn: content ? content : '',
        confirm_callback: callback,
      })
    },
    confirmClick() {
      this.alertShowHIde();
      var confirm_callback = this.data.confirm_callback;
      if (typeof(confirm_callback) === 'function') {
        confirm_callback();
      }
    },
    cancelClick() {
      this.alertShowHIde();
      var cancel_callback = this.data.cancel_callback;
      if (typeof(cancel_callback) === 'function') {
        cancel_callback();
      }
    },
    alertShowHIde(show) {
      var that = this;
      if (show == "show") {
        this.setData({
          show_alert: true,
          alert_animate: true
        })
      } else {
        this.setData({
          alert_animate: false
        })
        let _time = setTimeout(function() {
          clearTimeout(_time);
          that.setData({
            show_alert: false
          })
        }, 350)
      }
    }
  }
})