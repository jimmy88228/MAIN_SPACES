<template>
	<view class="loading">
	    <view></view>
	    <view></view>
	    <view></view>
	</view>
</template>

<script>
	const pageOption = Page.BaseComp({
		
	})
	export default pageOption;
</script>

<style scoped>
	.loading,
	.loading > view {
	  position: relative;
	  box-sizing: border-box;
	}
	
	.loading {
	  display: block;
	  font-size: 0;
	  color: #000;
	}
	
	.loading.la-dark {
	  color: #333;
	}
	
	.loading > view {
	  display: inline-block;
	  float: none;
	  background-color: currentColor;
	  border: 0 solid currentColor;
	}
	
	.loading {
	  width: 81px;
	  height: 27px;
	}
	
	.loading > view {
	  width: 15px;
	  height: 15px;
	  margin: 4px;
	  border-radius: 100%;
	  opacity: 0;
	  animation: ball-fall 1s ease-in-out infinite;
	}
	
	.loading > view:nth-child(1) {
	  animation-delay: -200ms;
	}
	
	.loading > view:nth-child(2) {
	  animation-delay: -100ms;
	}
	
	.loading > view:nth-child(3) {
	  animation-delay: 0ms;
	}
	
	@keyframes ball-fall {
	  0% {
	    opacity: 0;
	    transform: translateY(-145%);
	  }
	
	  10% {
	    opacity: 0.5;
	  }
	
	  20% {
	    opacity: 1;
	    transform: translateY(0);
	  }
	
	  80% {
	    opacity: 1;
	    transform: translateY(0);
	  }
	
	  90% {
	    opacity: 0.5;
	  }
	
	  100% {
	    opacity: 0;
	    transform: translateY(145%);
	  }
	} 
</style>
