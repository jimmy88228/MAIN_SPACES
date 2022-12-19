import utils from "../../../../common/utils/normal/index"
const App = getApp();


Component(App.BC({
  externalClasses: [
    'enter-class',
    'enter-active-class',
    'enter-to-class',
    'leave-class',
    'leave-active-class',
    'leave-to-class',
  ],
  properties: {
    customStyle: {
      type: String,
      value: "",
    },
    show: {
      type: Boolean,
      value: true,
      observer: 'observeShow'
    },
    duration: {
      type: null,
      value: 300,
      observer: 'observeDuration',
    },
    name: {
      type: String,
      value: 'fade',
    },
  },
  data: {
    type: "",
    inited: false,
    display: false
  },
  ready() {
    if (this.data.show === true) {
      this.observeShow(true, false);
    }
  },
  methods: {
    observeShow(value, old) {
      if (value === old) return;
      value ? this.enter() : this.leave();
    },
    enter: function () {
      let {
        duration,
        name
      } = this.data;
      let classNames = getClassNames(name);
      let currentDuration = isObj(duration) ? duration.enter : duration;
      this.status = 'enter';
      this.triggerEvent('before-enter');
      utils.requestAnimationFrame(() => {
        if (this.status !== 'enter') {
          return;
        }
        this.triggerEvent('enter');
        this.setData({
          inited: true,
          display: true,
          classes: classNames.enter,
          currentDuration,
        });
        utils.requestAnimationFrame(() => {
          if (this.status !== 'enter') {
            return;
          }
          this.transitionEnded = false;
          this.setData({
            classes: classNames['enter-to']
          });
        });
      });
    },
    leave() {
      if (!this.data.display) return;
      let {
        duration,
        name
      } = this.data;
      let classNames = getClassNames(name);
      let currentDuration = isObj(duration) ? duration.leave : duration;
      this.status = 'leave';
      this.triggerEvent('before-leave');
      utils.requestAnimationFrame(() => {
        if (this.status !== 'leave') return;
        this.triggerEvent('leave');
        this.setData({
          classes: classNames.leave,
          currentDuration: currentDuration,
        });
        utils.requestAnimationFrame(() => {
          if (this.status !== 'leave') {
            return;
          }
          this.transitionEnded = false;
          setTimeout(() => {
            return this.onTransitionEnd();
          }, currentDuration);
          this.setData({
            classes: classNames['leave-to']
          });
        });
      });
    },
    onTransitionEnd: function () {
      if (this.transitionEnded) return;
      this.transitionEnded = true;
      this.triggerEvent("after-".concat(this.status));
      let {show, display} = this.data;
      if (!show && display) {
        this.setData({
          display: false
        });
      }
    },
  },
}))

function getClassNames(name) {
  return ({
    enter: `${name}-enter ${name}-enter-active enter-class enter-active-class`,
    'enter-to': `${name}-enter-to ${name}-enter-active enter-to-class enter-active-class`,
    leave: `${name}-leave ${name}-leave-active leave-class leave-active-class`,
    'leave-to': `${name}-leave-to ${name}-leave-active leave-to-class leave-active-class`,
  });
};

function isObj(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}