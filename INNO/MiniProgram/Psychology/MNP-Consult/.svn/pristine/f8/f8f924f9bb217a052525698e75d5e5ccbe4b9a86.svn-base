<template>
	<u-popup v-model="popupShow" :round="5" :mode="mode" >
		<view class="share_poster">
		  <view class="load-view" v-if="!canvasPath">
				<!-- <u-loading :show="true" mode="circle"></u-loading> -->
		  </view>
			<u-image class="poster-view" :show-loading="false" :src="canvasPath" :fade="true" :width="width + 'rpx'" :height="height + 'rpx'"></u-image>
		  <view class="hidden-canvas">
		    <canvas class="share-poster" :style="canvasStyle" type="2d" canvas-id="sharePoster" id="sharePoster"></canvas>
		  </view>
		  <view>
		    <view class="operate-btns">
					<button class="operate-btn" type="default" text="月落" @click="createCanvasHandle">重新生成</button>
					<button class="operate-btn save-operate" type="primary" text="月落" @click="activeCanvasSave">保存</button>
		    </view>
		  </view>
		</view>
	</u-popup>
</template>
<script>
import PosterH from "./poster-handler.js"; 
 const pageOption = Page.BaseComp({
	props: {
		mode: {
			type: String,
			default: "center"
		}
	},
	data(){
		return {
			popupShow: false,
			width: 600,
			height:677,
			rpx: 1,
			saveMult: 2,
			canvasPath: "",
			sharePoster: null,
			query: null
		}
	},
	computed: {
		canvasStyle (){
			let width = this.width || 0;
			let height = this.height || 0;
			return `width:${width * this.saveMult}rpx;height:${height * this.saveMult}rpx`;
		}
	},
	mounted(){},
	methods:{
		showView(data){
		  let drawData = data || {};
			this.drawData = drawData;
			this.popupShow = true;
			//
			const query = uni.createSelectorQuery().in(this);
			let sharePoster = query.select("#sharePoster");
			console.log("sharePoster", sharePoster)
			
			PosterH.initCanvas(data.view, sharePoster, this).then((poster)=>{
				console.log("posterSrc", poster)
				this.canvasPath = poster.tempFilePath;
			})
		},
	}
})
export default pageOption;
</script>
<style lang="less" scoped>
	.share_poster{
	  position:fixed;
	  top:50%;
	  left:50%;
	  z-index:100;
	  width:600rpx;
	  background:rgb(235, 235, 235); 
	  transform: translate(-50%,-60%);
	  border-radius:10rpx;
	  overflow: hidden;
	}
	.load-view{
	  position: absolute;
	  top:50%;
	  left:50%;
	  transform: translate(-50%,-50%);
		z-index: 2;
	}
	.operate-btns{
	  margin-top:40rpx;
	  display:flex;
	  justify-content: center;
	}
	.operate-btn{
		font-size: 26rpx;
	  width:180rpx;
	  height:80rpx;
	  flex:1;
	  display:flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	  /* border-radius:8rpx; */
	}
	.save-operate{
	  color:#fff;
	}
	.btn-stay{
	  width:100rpx;
	}
	
	.share-poster{
	  
	}
	.hidden-canvas{
	  position: absolute;
	  top:0px;
	  left:0px;
	  transform: translate(-100%, 100%)
	}
</style>