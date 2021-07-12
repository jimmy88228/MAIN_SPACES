<style lang="less">
.login{
    background: #50a3a2;
	background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
	background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
	opacity: 0.8;

	.ivu-card{
    	background: rgba(255,255,255,0.3);
    }
    .ivu-card-head{
    	border-bottom:1px solid rgba(255,255,255,0.5);
    }
}

/*动态背景样式*/
.login-tx{
	.bg-bubbles {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  z-index: -1;
	}
	.bg-bubbles li {
	  position: absolute;
	  list-style: none;
	  display: block;
	  border-radius: 100%;
	  width: 40px;
	  height: 40px;
	  background-color: rgba(255, 255, 255, 0.15);
	  bottom: -160px;
	  -webkit-animation: square 25s infinite;
	  animation: square 25s infinite;
	  -webkit-transition-timing-function: linear;
	  transition-timing-function: linear;
	}
	.bg-bubbles li:nth-child(1) {
	  left: 10%;
	}
	.bg-bubbles li:nth-child(2) {
	  left: 20%;
	  bottom: 70%;
	  width: 80px;
	  height: 80px;
	  -webkit-animation-delay: 2s;
	          animation-delay: 2s;
	  -webkit-animation-duration: 17s;
	          animation-duration: 17s;
	}
	.bg-bubbles li:nth-child(3) {
	  left: 25%;
	  bottom: 25%;
	  -webkit-animation-delay: 4s;
	          animation-delay: 4s;
	}
	.bg-bubbles li:nth-child(4) {
	  left: 40%;
	  bottom: 40%;
	  width: 60px;
	  height: 60px;
	  -webkit-animation-duration: 22s;
	          animation-duration: 22s;
	  background-color: rgba(255, 255, 255, 0.25);
	}
	.bg-bubbles li:nth-child(5) {
	  left: 70%;
	  bottom: 65%;
	}
	.bg-bubbles li:nth-child(6) {
	  left: 80%;
	  bottom: 80%;
	  width: 120px;
	  height: 120px;
	  -webkit-animation-delay: 3s;
	          animation-delay: 3s;
	  background-color: rgba(255, 255, 255, 0.2);
	}
	.bg-bubbles li:nth-child(7) {
	  left: 32%;
	  bottom:15%;
	  width: 160px;
	  height: 160px;
	  -webkit-animation-delay: 7s;
	          animation-delay: 7s;
	}
	.bg-bubbles li:nth-child(8) {
	  left: 55%;
	  width: 20px;
	  height: 20px;
	  -webkit-animation-delay: 15s;
	          animation-delay: 15s;
	  -webkit-animation-duration: 40s;
	          animation-duration: 40s;
	}
	.bg-bubbles li:nth-child(9) {
	  left: 25%;
	  bottom: 50%;
	  width: 10px;
	  height: 10px;
	  -webkit-animation-delay: 2s;
	          animation-delay: 2s;
	  -webkit-animation-duration: 40s;
	          animation-duration: 40s;
	  background-color: rgba(255, 255, 255, 0.3);
	}
	.bg-bubbles li:nth-child(10) {
	  left: 90%;
	  bottom: 17%;
	  width: 160px;
	  height: 160px;
	  -webkit-animation-delay: 11s;
	          animation-delay: 11s;
	}
	.bg-bubbles li:nth-child(11) {
	  left: 90%;
	  width: 90px;
	  height: 90px;
	  -webkit-animation-delay: 1s;
	          animation-delay: 1s;
	}
	.bg-bubbles li:nth-child(12) {
	  left: 50%;
	  width: 60px;
	  height: 60px;
	  -webkit-animation-delay: 4s;
	          animation-delay: 4s;
	}
	.bg-bubbles li:nth-child(13) {
	  left: 45%;
	  width: 160px;
	  height: 160px;
	  -webkit-animation-delay: 17s;
	          animation-delay: 17s;
	}
	.bg-bubbles li:nth-child(14) {
	  left: 55%;
	  top: 30%;
	  width: 20px;
	  height: 20px;
	  -webkit-animation-delay: 3s;
	          animation-delay: 3s;
	}
	.bg-bubbles li:nth-child(15) {
	  left: 56%;
	  bottom:10%;
	  width: 220px;
	  height: 220px;
	  -webkit-animation-delay: 0s;
	          animation-delay: 0s;
	}
	.bg-bubbles li:nth-child(16) {
	  left: 25%;
	  width: 65px;
	  height: 65px;
	  -webkit-animation-delay: 12s;
	          animation-delay: 12s;
	}
}
@-webkit-keyframes square {
  0% {
    -webkit-transform: translateY(50px);
            transform: translateY(50px);
  }
  100% {
    -webkit-transform: translateY(-900px) rotate(600deg);
            transform: translateY(-900px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    -webkit-transform: translateY(50px);
            transform: translateY(50px);
  }
  100% {
    -webkit-transform: translateY(-900px) rotate(600deg);
            transform: translateY(-900px) rotate(600deg);
  }
}
</style>

<template>
	<div class="login-tx">

		<ul class="bg-bubbles">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>

			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>

	</div>
</template>

<script>
/**
 * 登录页面特效
 */
export default {
  name: 'loginTx',
  components: {
  },
  data () {
    return {
    }
   	},
   	methods: {
   	},
   	mounted () {
   	}
}
</script>
