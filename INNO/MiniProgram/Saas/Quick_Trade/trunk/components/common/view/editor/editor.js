const App = getApp();
Component(App.BC({
  properties: {
    placeholder: {
      type: String,
      value: ""
    },
    height: {
      type: Number,
      value: 0
    }
  },
  data: {
    formats: {},
    placeholder: '请输入商品详情',
    editorHeight: 1000,
    keyboardHeight: 0,
    isIOS: false
  },
  lifetimes: {
    attached() {
      this.getEditorPromise = new Promise(rs => {
        this.editorReady = rs;
      })
    },
  },
  ready() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (keyboardHeight === 0) {
        this.triggerEvent("keyBoradDown")
      } else {
        this.triggerEvent("keyBoradUp")
      }
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  methods: {
    updatePosition(keyboardHeight) {
      const toolbarHeight = 50
      const height = this.properties.height || wx.getSystemInfoSync().windowHeight;
      let editorHeight = keyboardHeight > 0 ? (height - keyboardHeight - toolbarHeight) : height
      this.setData({
        editorHeight,
        keyboardHeight
      })
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync()
      const {
        statusBarHeight,
        platform
      } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
      const that = this;
      wx.createSelectorQuery().in(that).select('#editor').context(res => {
        that.editorCtx = res.context;
        this.editorReady && this.editorReady(that.editorCtx);
      }).exec()
    },
    format(e) {
      let {
        name,
        value
      } = e.target.dataset
      if (!name) return
      this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({
        formats
      })
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      this.triggerEvent("insertImage")
      // const that = this
      // wx.chooseImage({
      //   count: 1,
      //   success: function (res) {
      //     that.editorCtx.insertImage({
      //       src: res.tempFilePaths[0],
      //       data: {
      //         id: 'abcd',
      //         role: 'god'
      //       },
      //       width: '80%',
      //       success: function () {
      //         console.log('insert image success')
      //       }
      //     })
      //   }
      // })
    },

    insertImageNode(filePaths = []) {
      filePaths.forEach(filePath => {
        this.editorCtx.insertImage({
          src: filePath,
          width: '100%',
          success: function () {
            console.log('insert image success')
          }
        })
      })
    },

    // 初始化内容
    setContents({html}) {
      return new Promise((rs, rj) => {
        this.editorCtx ? this.editorCtx.setContents({html, success: rs, fail: rj})
        : this.getEditorPromise.then(ctx => ctx.setContents({html, success: rs, fail: rj}))
      })
    },

    getContents() {
      return new Promise((rs, rj) => {
        this.editorCtx ? this.editorCtx.getContents({success: rs, fail: rj})
        : this.getEditorPromise.then(ctx => ctx.getContents({success: rs, fail: rj}))
      })
    }
  }
}))