<style lang="less">
.paste-image{	
	height: 100%;
	width:100%;
	overflow: hidden;
	border-bottom: 1px solid #ddd;
		
	.box-title{
		height:33px;
		line-height: 2.4;
		box-shadow:0 1px 4px rgba(204, 204, 204, 0.6);
		background-image: linear-gradient(to bottom, #ffffff, #f2f2f2);
		text-align: center;
		font-size:13px;
	}
	.paste-box{
		width:100%;
		height:100%;
		background-color: #fff;
		
		img{
			width:100%;
			padding:5px;
		}
	}
}
</style>
	
<template>
	<div class="paste-image">
		<div class="box-title">截图粘贴区域 <a @click="clearData">[清空]</a></div>
		<div ref="paste-box" contenteditable="true" class="paste-box"
		@paste.stop.prevent="pasteImg($event)"></div>
	</div>
</template>

<script>
export default {
	name: 'pasteImage',
	components: {

	},
	data () {
	    return {
			base64Data: '',
		}
	},
	methods: {
		init(){
		},
		pasteImg(e) {
		    const cbd = e.clipboardData;
			const ua = window.navigator.userAgent;
			
			// 如果是 Safari 直接 return
			if ( !(e.clipboardData && e.clipboardData.items) ) {
				return ;
			}
			if(cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
				cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
				ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49){
				return;
			}
			for(let i = 0; i < cbd.items.length; i++) {
		        let item = cbd.items[i];
		        if(item.kind == "file"){
					// blob 就是从剪切板获得的文件，可以进行上传或其他操作
					const blob = item.getAsFile();
					//console.log('获得blob', blob);
					if (blob.size === 0) {
						return;
					}
					const reader = new FileReader();
					const imgs = new Image(); 
					imgs.file = blob;
					var that = this;
					reader.onload = ( (aImg) => {
						return function(e) {
							//console.log('获得粘贴的结果', e.target.result);
							that.base64Data = e.target.result;
							aImg.src = e.target.result;
						};
		            })(imgs);
					reader.readAsDataURL(blob);
					this.$refs['paste-box'].appendChild(imgs);
		        }
		    }
		},
		// 清楚数据
		clearData(){
			this.base64Data = '';
			
			this.$refs['paste-box'].innerHTML = '';
		},
		// 提供给父组件使用
		getBase64Data(){
			return this.base64Data;
		}
	},
	mounted () {
	    this.init();
	},
}
</script>