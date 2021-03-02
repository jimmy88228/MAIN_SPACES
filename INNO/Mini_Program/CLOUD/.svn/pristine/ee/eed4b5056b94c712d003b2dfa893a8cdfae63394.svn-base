// pages/micro_mall/video_shopping/v_page/v_components/v_video.js
const app = getApp();
Component(app.BTAB({
  properties: {
    hasMore:{
      type:Boolean,
      value:true
    }
  },
  data: {
    progressVal: 0,
    v_arr: [],
    cur_v: 0,
    hide_cur:-1,
    waiting: true,
    showLoad: false,
  },
  attached() {
    this.last_cur = 0;
    this.cur_finish = 0;
  },
  methods: {
    onChange(e) {
      // console.log(e.detail.current, '切换', e);
      let detail = e.detail || {};
      let cur_v = detail.current || 0;
      let data = {};
      data.cur_v = cur_v;
      this.setData({
        cur_v,
        hide_cur:-1
      })
      this.triggerEvent('onChange', data)
    },
    animationfinish(e) {
      // console.log('切换完成', e);
      clearTimeout(this.initVideoId);
      let detail = e.detail || {};
      let cur_v = detail.current || 0;
      this.cur_finish = cur_v;
      if (cur_v == this.last_cur){
        this.setData({
          hide_cur: cur_v, 
        })
        return
      }
      let v_arr = this.data.v_arr || [];
      let time = 0;
      if (v_arr[cur_v] && v_arr[cur_v].coverPicture){
        time = 1400;
      }
      let data = {};
      data.cur_v = cur_v;
      data.cur_last = this.last_cur;
      this.triggerEvent('onFinish', data);
      this.toggleFnc(this.last_cur, true, {
        setFalse: true
      });
      setTimeout(()=>{
        this.setData({
          progressVal: 0
        })
      },100)
      this.last_cur = cur_v;
      clearTimeout(this.showCoverId);
      clearTimeout(this.showCoverId_TWO);
      this.showCoverId = setTimeout(()=>{
        this.showCoverId_TWO = setTimeout(() => {
          this.setData({
            hide_cur: cur_v
          })
          this.seekCheck = cur_v ;
          // this.arr && this.arr[cur_v] && this.arr[cur_v].seek(0);
          this.toggleFnc(cur_v, true, {
            setTrue: true
          });
        }, 100)
        // }, 150)
      }, time)
       
    },
    onPlay(e) {
      if (this.seekCheck == this.data.cur_v){
        this.seekCheck = -1;
        this.arr && this.arr[this.data.cur_v] && this.arr[this.data.cur_v].seek(0);
      }
      // console.log('onstaus onPlay',e)
      trigger_Event.call(this, e, 'onPlay');
    },
    onPause(e) {
      // console.log('onstaus onPause', e)
      trigger_Event.call(this, e, 'onPause');
    },
    onEnded(e) {
      // console.log('onstaus onEnded', e)
    },
    onError(e) {
      let index = e.currentTarget.dataset && e.currentTarget.dataset.index || 0;
      if (this.data.cur_v == index) {
        console.log('onStaus onError', e);
        console.log('该视频暂时无法播放:', index, e);
        app.SMH.showToast({
          title: `该视频暂时无法播放`
        })
      }
      // this.toggleFnc(index, true, { setFalse: true });
    },
    onWaiting(e) {
      // console.log('onStaus onWaiting',e);
      if (!this.data.waiting) {
        this.data.waiting = true;
        this.setData({
          waiting: true
        })
      }
    },
    onLoadedMetaData(e) {
      // console.log('onStaus 预加载', e.currentTarget.dataset.index,e);
    },
    onProgress(e) {
      // console.log('onStaus onProgress', e.currentTarget.dataset.index, e);
    },
    onTimeupdate(e) {
      let dataset = e.currentTarget.dataset || {};
      let detail = e.detail || {};
      let progressVal = parseInt((detail.currentTime / detail.duration) * 100);
      this.setData({
        progressVal
      })
      if (this.data.waiting) {
        this.data.waiting = false;
        setTimeout(() => {
          this.setData({
            waiting: false
          })
        }, 500);
      }
    },
    loadData(data = []) {
      data = data || [];
      this.arr = this.arr || [];
      this.tempData = this.tempData || [];
      if (data && data.length > 0) {
        let index = this.arr.length || 0;
        data.map((item) => {
          item.toggle = false;
          let id = `video_${index}`;
          index += 1;
          let context = wx.createVideoContext(id, this);
          this.arr.push(context);
          this.tempData.push(item);
        })
      }
      this.setData({
        v_arr: this.tempData
      })
      if (!this.init) {
        this.init = true;
        this.setLoad(true);
        let time = 1000;
        if (this.data.v_arr[0] && this.data.v_arr[0].coverPicture){
          time = 3000;
        }
        this.initVideoId = setTimeout(() => {
          this.toggleFnc(0, true, {
            setTrue: true,
          }); 
          this.setData({
            hide_cur: 0
          })
        }, time)
        setTimeout(() => {
           this.setLoad(false);
        }, 1000)
      }
      console.log('数据初始化', this.tempData);
      console.log('视频初始化', this.arr);
    },
    toggleFnc(index = 0, action = true, obj = {}) {
      obj = obj || {};
      let arr = this.arr || [];
      let data = this.tempData || [];
      if (!data[index]) {
        return
      } else if (data[index].toggle || obj.setFalse) {
        data[index].toggle = false;
        action && arr[index].pause();
      } else if (!data[index].toggle || obj.setTrue) {
        data[index].toggle = true
        action && arr[index].play();
      }
    },
    tap_v(e) {
      onClick.call(this, e);
    },
    setLoad(bool = false) {
      this.setData({
        progressVal: 0,
        showLoad: bool
      })
    },
    onTapStart(e) {
      this.startVal = e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY;
    },
    onTapEnd(e) {
      // console.log(e, this.data.v_arr.length, this.data.cur_v);
      let len = this.data.v_arr && this.data.v_arr.length || 0
      if ((len == (this.cur_finish + 1)) && !this.data.hasMore) {
        this.endtVal = e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY;
        this.distance = this.startVal - this.endtVal;
        if (this.distance > 60) {
          showEmpty.call(this);
        }
      }
      this.startVal = 0;
      this.endtVal = 0;
    }
  },
}))

function onClick(e) {
  if (this.on_single) {
    doubleTap.call(this, e);
  }
  this.on_single = true;
  clearTimeout(this.click_id);
  this.click_id = setTimeout(() => {
    this.on_single = false;
    if (!this.on_double) {
      singleTap.call(this, e);
    }
    this.on_double = false;
  }, 500)
}

function singleTap(e) {
  let dataset = e.target.dataset || {};
  // let dataset = e.currentTarget.dataset || {};
  let index = dataset.index || 0;
  trigger_Event.call(this, e, 'singleTap');
  this.toggleFnc(index);
}

function doubleTap(e) {
  // console.log('双击中',x,y,e);
  let detail = e.detail || {};
  let dataset = e.currentTarget.dataset;
  let x = detail.x || 0;
  let y = detail.y || 0;
  let data = {
    x,
    y
  };
  this.on_double = true;
  clearTimeout(this.click_id);
  this.triggerEvent('doubleTap', data);
}

function trigger_Event(e, name = '') {
  let dataset = e.currentTarget.dataset || {};
  let id = dataset.id || 0;
  let index = dataset.index || 0;
  this.triggerEvent(name, {
    index,
    id
  })
}

function showEmpty() {
  app.SMH.showToast({
    title: "暂时没有更多视频了"
  })
}