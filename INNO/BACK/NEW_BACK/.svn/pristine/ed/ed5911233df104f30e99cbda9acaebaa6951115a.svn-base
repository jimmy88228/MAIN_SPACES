<template>
	<div class="circle-animate-box" id="circle-animate-box" :style="boxStyle">
		<slot></slot>
	</div>
</template>
<script>
	export default{
		props: {
			boxStyle:{
				type: String,
				default: ""
			}
		},
		data(){
			return {
				
			}
		},
		mounted(){
			this.initEvent();
		},
		methods:{
			initEvent(){
				document.getElementById('circle-animate-box').addEventListener('mousemove', function(e) {
				  // let body = document.querySelector('body');
					let target = e.target;
					if(target.id != "circle-animate-box") return;
				  let circle = document.createElement('span');
				  let x = e.offsetX;
				  let y = e.offsetY;
					circle.className = "circle-animate"
				  circle.style.left = x + 5 + "px";
				  circle.style.top = y + 5 + "px";
				  let size = Math.random() * 100;
				  circle.style.width = 20 + size + "px";
				  circle.style.height = 20 + size + "px";
				  this.appendChild(circle);
				  setTimeout(function() {
				    circle.remove();
				  }, 1800);
				});
			}
		}
	}
</script>
<style lang="less">
	.circle-animate-box{
		width:100%;
		height:100%;
		position:relative;
	}
	.circle-animate {
	  height: 50px;
	  width: 50px;
	  border-radius: 50%;
	  position: absolute;
	  pointer-events: none;
	  background: #55b9f3;
	  transform: translate(-50%, -50%);
	  animation: blow 4s linear infinite;
		opacity: 0.6;
	}
	@keyframes blow {
	  0% {
	    transform: translate(-50%, -50%);
	    opacity: 0.6;
	    filter: hue-rotate(0deg);
	  }
	  100% {
	    transform: translate(-50%, -1000%);
	    opacity: 0;
	    filter: hue-rotate(720deg);
	  }
	}
</style>