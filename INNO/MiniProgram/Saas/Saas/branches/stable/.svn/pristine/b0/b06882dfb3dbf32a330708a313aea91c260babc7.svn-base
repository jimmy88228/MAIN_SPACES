const app = getApp();
Component(app.BTAB({
  properties: {
    type: {
      type: String,
      value: ""
    },
    length: {
      type: Number,
      value: 5
    },
    likeImage: {
      type: String,
      value: ""
    },
    unlikeImage: {
      type: String,
      value: ""
    },
    boxStyle: {
      type: String,
      value: ""
    },
    starStyle: {
      type: String,
      value: ""
    },
    gutter: {
      type: Number,
      value: 20
    },
    score: {
      type: Number,
      value: 0,
      observer(val) {
        this.animationStart()
      }
    },
    animation: {
      type: Boolean,
      value: true
    }
  },
  data: {
    animationClass: ''
  },
  methods: {
    handleStarTap(e) {
      const score = e.currentTarget.dataset.score
      this.triggerEvent("startap", score)
    },
    animationStart() {
      this.setData({animationClass: 'in'})
    },
    animationEnd() {
      if(this.data.animationClass) this.setData({animationClass: ''})
    }
  }
}))