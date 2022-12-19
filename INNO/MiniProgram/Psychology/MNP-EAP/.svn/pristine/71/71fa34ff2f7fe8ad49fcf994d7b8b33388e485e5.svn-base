<template>
<view class="count-down-area" v-if="isShow" :class="{ 'into': isInto,  'exit': isExit }">
  <view class="count-dow-bg"></view>
  <view class="count-down" >
    <view class="loop-pie">
      <view class="loop-pie-line loop-pie-r">
        <view class="loop-pie-c loop-pie-rm"></view>
      </view>
      <view class="loop-pie-line loop-pie-l">
        <view class="loop-pie-c loop-pie-lm"></view>
      </view>
    </view>
    <view class="count-down-str">
      {{count}}
    </view>
  </view>
</view>
</template>

<script>
const BaseComp = Page.BaseComp({
  data() {
    return {
      isShow: true,
      isInto: false,
      isExit: false,
      countDownTimer : null,
      initAnimateTimer: null,
      count: 3
    }
  },
  computed:{
    
  },
  components: {  },
  methods: {
    initAnimate(callback){
      this.isShow = true;
      this.$nextTick(()=>{
        this.isInto = true;
        this.initCountDown();
        this.initAnimateTimer = setTimeout(()=>{
          this.exitAnimate(callback)
          clearTimeout(this.initAnimateTimer);
          this.initAnimateTimer = null;
        }, 4000)
      })
    },
    initCountDown(){
      this.count = 3;
      let timer = setTimeout(()=>{
        this.countDownTimer = setInterval(()=>{
          this.count = this.count - 1;
          if(!(this.count > 0)){
            clearInterval(this.countDownTimer);
            this.countDownTimer = null;
          }
        }, 1000)
        clearTimeout(timer);
        timer = null;
      }, 1000)
    },
    exitAnimate(callback){
      if(!this.isExit) this.isExit = true;
      this.isInto = false;
      this.$nextTick(()=>{
        let timer = setTimeout(()=>{
          this.isShow = false;
          this.isExit = false;
          typeof(callback) == 'function' && callback();
          clearTimeout(timer);
          timer = null;
        }, 300)
      })
    },
    destroy(){
      this.isInto = false;
      this.isExit = false;
    }
  },
});
export default BaseComp
</script>

<style lang="scss" scoped>
.count-down-area{
  .count-dow-bg{
    position: fixed;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
    z-index: 10;
  }
  .count-down{
    z-index: 10;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(5);
    width: 315rpx;
    height: 315rpx;
    background-color:rgba(0,0,0,0.6);
    border-radius: 50%;
    opacity: 0;
    text-align:center;
  }
  .count-down-str{
    font-size: 138rpx;
    font-family: Arial;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 315rpx;
  }
  // 进度条
  .loop-pie{
    width:90%;
    padding-top: 90%;
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .loop-pie-line {
    position:absolute;
    width:50%;
    height:100%;
    top:0;
    overflow:hidden;
  }
  .loop-pie-l {
    top:0px;
    left:0px;
  }
  .loop-pie-r {
    top:0px;
    transform:rotate(180deg);
    right:0px;
  }
  .loop-pie-c {
    width:200%;
    height:100%;
    border:4px solid transparent;
    border-radius:50%;
    position:absolute;
    box-sizing:border-box;
    top:0;
    transform:rotate(-45deg);
  }
  .loop-pie-rm {
    border-top:4px solid transparent;
    border-left:4px solid transparent;
    border-bottom:4px solid #FFCD00;
    border-right:4px solid #FFCD00;
    transition: all .35s ease-in;
  }
  .loop-pie-lm {
    border-top:4px solid transparent;
    border-left:4px solid transparent;
    border-bottom:4px solid #FFCD00;
    border-right:4px solid #FFCD00;
    transition: all .35s ease-in .35s;
  }
}
.count-down-area.into{
  .count-down{
    animation-name: into;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
    animation-delay: 0.8s;
  }
  .loop-pie-rm {
    animation: circleProgressLoad_right 1.5s ease-in forwards 1s;
  }
  .loop-pie-lm {
    animation: circleProgressLoad_left 1s ease-out forwards 2.5s;
  }
}
.count-down-area.exit{
  .count-down{
    animation-name: exit;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
  }
}

@keyframes circleProgressLoad_right{
    0%{
        transform: rotate(-45deg);
    }
    100%{
        transform: rotate(-225deg);
    }
}
@keyframes circleProgressLoad_left{
    0%{
        transform: rotate(-45deg);
    }
    100%{
        transform: rotate(-225deg);
    }
}
@keyframes into {
  from{
    transform: translate(-50%, -50%) scale(5);
    opacity: 0;
  }
  to{
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
@keyframes exit {
  from{
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  to{
    transform: translate(-50%, -50%) scale(5);
    opacity: 0;
  }
}
</style>