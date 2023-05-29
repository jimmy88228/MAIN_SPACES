<template>
	<!-- loading 加载 -->
	<view class="mix-loading-content">
		<view class="mix-loading-wrapper" @click="closeLoading">
			<image 
				class="mix-loading-icon" 
				src=""
			/>
		</view>
	</view>
</template>

<script>
/*组件经过修改*/

export default {
	
	props: {
		top: {
			//距离顶部距离，单位upx
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			
		};
	},
	methods: {
		init(){
			
		},
		// 新增的方法
		closeLoading(){
			this.$emit('on-close');
		}
	},
	mounted(){
		this.init();
	}
}
</script>

<style>
.mix-loading-content{
	display:flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	
	/* #ifdef MP*/
	width: 750rpx;
	height: 1200rpx;
	/* #endif */
	
	/* #ifdef APP-PLUS*/
	width: 750rpx;
	height: 1200rpx;
	/* #endif */
	
	background-color: transparent;
}

.mix-loading-wrapper{
	display: flex;
	justify-content: center;
	align-items: center;
	animation: loading .5s ease-in infinite both alternate;
	background-color: rgba(0,0,0,.2);
	padding:20rpx;
	border-radius: 20rpx;
}

.mix-loading-icon{
	width: 80upx;
	height: 80upx;
	transition: .3s;
	border-radius: 100%;
}

@keyframes loading {
	0% {
		transform: translateY(-20upx) scaleX(1);
	}
	100% {
		transform: translateY(4upx)  scaleX(1.3);
	}
}
</style>
