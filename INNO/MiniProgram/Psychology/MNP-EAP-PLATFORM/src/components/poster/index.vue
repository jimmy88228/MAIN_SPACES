<template>
<view class="poster" @touchmove.stop.prevent="noAction">
  <ori-popup
      ref="popup"
      type="center"
      @change="change"
  >
    <template v-slot:content>
      <view
        class="poster-box"
      >
        <view v-show="!hasDraw" class="loading-box flex-c-c">
          <loading-view></loading-view>
        </view>
        <image v-show="hasDraw" :src="posterImg" mode="aspectFit" class="img-poster" :class="{'anim':anim}" />
        <div class="flex-b-c btn-box">
          <div class="btn-save C_fff flex-c-c" @click="reset(hasDraw)" :class="{'loading':saveLoading||!hasDraw}">重新生成</div>
          <div class="btn-save C_fff flex-c-c" @click="save(hasDraw)" :class="{'loading':saveLoading||!hasDraw}">保存至手机</div>
        </div>
      </view>
    </template>
  </ori-popup>
  <view class="l-painter-box">
    <canvas class="share-poster" :style="canvasStyle" type="2d" canvas-id="canvasId" id="canvasId"></canvas>
    
    <!-- <l-painter 
      is-canvas-to-temp-filePath
      @done="painterDone"
      @success="success" 
      pixel-ratio="2"
      ref="painter"   :board="posterData"></l-painter>
    <l-painter
      is-canvas-to-temp-filePath
      @done="painterDone"
      @success="success"
      ref="painter"
    >
    <l-painter-view css="width:650rpx;height:816rpx;border-radius:30rpx;background:red;">
      <l-painter-image
        css="margin:84rpx auto 0 auto;width:448rpx;height:448rpx;"
        :src="posterMsg.code || ''"
      ></l-painter-image>
      <l-painter-view
        css="text-align:center;margin-top:68rpx;font-weight:bold;font-size:42rpx;padding:0 40rpx;"
      >
        <l-painter-text :text="'AAA'||posterMsg.title || ''"></l-painter-text>
      </l-painter-view>
      <l-painter-view
        css="text-align:center;margin-top:20rpx;font-size:24rpx;padding:0 40rpx;"
      >
        <l-painter-text :text="'BBB'||posterMsg.tips || ''"></l-painter-text>
      </l-painter-view>
    </l-painter-view>
    </l-painter> -->
  </view>
</view>
</template>

<script>
import LoadingView from '@/components/css3/loading/loading.vue';
import oriPopup from "@/components/ori-comps/popup/ori-popup";
import painterMixin from "@/components/lime-painter/mixin.js"; 
import PosterH from "./poster-handler.js"; 

const BaseComp = Page.BaseComp({
  data() {
    return {
      showPoster: false,
      hasDraw: false,
      anim: false,
      posterMsg: {}, 
      posterImg:"", 

			popupShow: false,
			width: 650,
			height: 816, 
			canvasPath: "",
			sharePoster: null,
			query: null,
    }
  },
  computed:{ 
		canvasStyle (){
			let width = this.width || 0;
			let height = this.height || 0;
			return `width:${width}rpx;height:${height}rpx`;
		}
  },
  components: {
    oriPopup,
    LoadingView
  },
  mixins:[painterMixin],
  methods: {
    showModal(posterMsg) {
      // if(this.posterMsg.key && this.posterMsg.key == posterMsg.key){
      //   this.hasDraw = true;
      //   this.$refs.popup.show();
      //   this.$nextTick(()=>{this.anim = true;});
      //   return
      // }
      this.posterMsg = JSON.parse(JSON.stringify(posterMsg || {}));
      this.$refs.popup.show();
      this.initCanvas();
    },
    initCanvas(){
      if(!this.posterMsg)return
      this.hasDraw = false;
      const query = uni.createSelectorQuery().in(this);
      let sharePoster = query.select("#canvasId");
			PosterH.initCanvas(this.posterMsg.view, sharePoster, this).then((poster)=>{
				this.posterImg = poster && poster.tempFilePath || "";
        this.hasDraw = true;
        this.$nextTick(()=>{
          this.anim = true;
        })
			})
    },
    reset(isCanSave){
      if(this.saveLoading||!isCanSave)return
      this.initCanvas();
    },
    change(e) {
      if (!e.show) {
        this.anim = false;
        // this.showPoster = false;
        setTimeout(() => {
          this.hasDraw = false;
        }, 300);
      }
      this.$emit('change',e);
    },
    // painterDone(e){
    //   // console.log('painterDone',e);
    // },
    // success(e){
    //   console.log('poster success',e,this.showPoster);
    //   this.draw(e);
    //   this.$emit('success',e);
    // },
    // draw(pic){
    //   if(this.showPoster){
    //     this.posterImg = pic;
    //     this.hasDraw = true;
    //     this.$nextTick(()=>{
    //       this.anim = true;
    //     })
    //   }
    //   this.$emit('success',pic);
    // },
  },
});
export default BaseComp
</script>

<style lang="scss" scoped>
.poster{
  position: relative;
  overflow: hidden;
  .l-painter-box{
    position: fixed;
    opacity: 0;
    left: -3000px;
    top:-3000px;
    z-index: -1;
  }
  .btn-box{
    width: 650rpx;
    position: fixed;
    bottom: 48rpx;
    left: 50%;
    transform: translateX(-50%);
  }
  .btn-save {
    // width: 650rpx;
    width: 300rpx;
    height: 100rpx;
    background: $uni-main-color;
    border-radius: 16rpx; 
    font-size: 36rpx;
    transition: opacity 0.3s;
    &.loading{
      opacity: 0.5;
    }
  }
  .img-poster,.loading-box{
    margin:auto;
    width:650rpx;
    height:816rpx;
  }
  .img-poster{
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 30rpx;
    &.anim{
      opacity: 1;
    }
  }
  .poster-box{
    border-radius: 30rpx;
    overflow: hidden;
    background-color: #fff;
  }
}
</style>