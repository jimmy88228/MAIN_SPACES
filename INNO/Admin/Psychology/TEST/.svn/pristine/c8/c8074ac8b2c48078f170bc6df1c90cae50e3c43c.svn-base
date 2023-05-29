<template>
  <div :class="setClass()">
    <svg :width="width" :height="width" ref="load-svg">
      <defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="20%" :stop-color="fromColor"></stop>
          <stop offset="100%" :stop-color="toColor"></stop>
        </linearGradient>
      </defs>
      <circle fill="#fff" stroke="none" :stroke-width="width / 20" :cx="width / 2" :cy="width / 2" :r="width / 2 - (width / 20)" class="circle" stroke-linecap="round" />
      <circle fill="none" :stroke="fromColor" :stroke-width="width / 20" :cx="width / 2" :cy="width / 2" :r="width / 2 - (width / 20)" class="circle-stroke" stroke-linecap="round" />
      <polyline fill="none" :stroke="fromColor && toColor ? 'url(#linear)' : fromColor" :stroke-width="width * 0.06" :points="points" stroke-linecap="round" stroke-linejoin="round" class="tick" />
      <polyline fill="none" :stroke="warnColor" :stroke-width="width * 0.06" :points="warnPointsL" stroke-linecap="round" stroke-linejoin="round" class="warn-l" />
      <polyline fill="none" :stroke="warnColor" :stroke-width="width * 0.06" :points="warnPointsR" stroke-linecap="round" stroke-linejoin="round" class="warn-r" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 200
    },
    fromColor: {
      type: String,
      default: "#9BD685"
    },
    toColor: String,
    warnColor: {
      type: String,
      default: "#d62d20"
    },
    state: Number | String
  },
  data(){
    return {
      stateJson: {
        0: "pedding",
        1: "success",
        2: "fail"
      }
    }
  },
  computed: {
    points(){
      let dpr = this.width / 400;
      return `${140 * dpr},${220 * dpr} ${185 * dpr},${259 * dpr} ${290 * dpr},${150 * dpr}`;
    },
    warnPointsL(){
      let dpr = this.width / 400;
      return `${140 * dpr},${140 * dpr} ${260 * dpr},${260 * dpr}`;
    },
    warnPointsR(){
      let dpr = this.width / 400;
      return `${260 * dpr},${140 * dpr} ${140 * dpr},${260 * dpr}`;
    }
  },
  methods:{
    setClass(){
      let state = this.state;
      return this.stateJson[state] || "";
    }
  }
}
</script>

<style lang="less" scoped>
.tick {
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
}
.warn-l,.warn-r {
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
}
.circle-stroke{
  stroke-dasharray: 400, 400;
  stroke-dashoffset: 400;
}
.pedding svg .circle-stroke {
  transform-origin: center center;
  stroke-dasharray: 1, 400;
  stroke-dashoffset: 0;
  animation: dash 0.8s ease-in-out infinite, rotate 6s ease-in-out infinite;
  stroke-linecap: round;
}
.success svg .tick {
  animation: tick .8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: .2s;
}
.fail svg .warn-l{
  animation: warn .8s ease-out;
  animation-fill-mode: forwards;
}
.fail svg .warn-r{
  animation: warn .8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: .2s;
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 400;
    stroke-dashoffset: 0
  }
  50% {
    stroke-dasharray: 178, 400;
    stroke-dashoffset: -70
  }

  to {
    stroke-dasharray: 178, 400;
    stroke-dashoffset: -390
  }
}

@keyframes rotate {
  to {
    transform: rotate(1turn)
  }
}

@keyframes tick {
  from {
    stroke-dashoffset: 350;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes warn {
  from {
    stroke-dashoffset: 350;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>