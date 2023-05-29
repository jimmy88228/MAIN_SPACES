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
    },
    scrollTop: {
      type: Number,
      value: 0
    },
    extraH: {
      type: Number,
      value: 0
    },
  },
  data: {
    formats: {},
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
  methods: {
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