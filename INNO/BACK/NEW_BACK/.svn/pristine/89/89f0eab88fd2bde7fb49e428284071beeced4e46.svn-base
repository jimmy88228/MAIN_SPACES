<style lang="less">
.body-card{
	margin:5px 10px;
	
	.body-content{
		.content-box{
			padding:10px;
			overflow: hidden;
		}
	}
	
	.goods-desc-image{
		cursor: pointer;
	}
}	
</style>
	
<template>
	<Card class="body-card">
		<!--<div slot="title">
			{{info.title}}
		</div>-->
		
		<div class="body-content" v-viewer>
			<div v-html="info.content"></div>
		</div>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>	

<script>
/**
 * 用于后台显示文档内容
 */
export default {
	name: 'docInfoContent',
    data () {
        return {
			spinShow: false,
			
			info:{
				title:'',
				content: '',
				created_at_format:'',
			}
		}
	},
	methods: {
		initData( code = '' ){
			this.spinShow = true;
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.docInfo, {
				code: code == '' ? this.code : code,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					this.info = res.data;
				}
			});
		},
	},
}
</script>