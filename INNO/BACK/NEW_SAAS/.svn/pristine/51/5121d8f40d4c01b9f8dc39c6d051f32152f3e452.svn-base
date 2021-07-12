<style lang="less">
.cs-view{
	padding:32px;
	position: relative;
	
	.cs-box{
		border-radius: 100% 0 0 100%;
		position: absolute;
		right: 0;
		top: 8px;
		
		.cs-inner-box{
			border-radius: 60px 0 0 60px;
			text-align: center;
			padding: 3px 4px 3px 15px;
			box-shadow: 0 0 5px  rgba(0,0,0,.3);
			.txt{
				font-size: 10px;
			}
		}
	}
}	
</style>

<template>
	<div class="cs-view">
		<div class="cs-box">
			<div class="cs-inner-box">
				<Icon class="ionmy ion-my-kefu2" size="20"></Icon>
				<div class="txt">{{info.name}}</div>
			</div>
		</div>
	</div>
</template>	

<script>
/**
 * 标题文本渲染组件
 */
export default {
	name: 'textView',
    components: {
		
    },
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
		// 是否使用用在 tab 导航页面内
		inTab:{
			type: Boolean,
			default: false,
		}
	},
	data () {
	    return {
			info:{},
			dataList:[],
		}
	},
	computed: {

	},	
	methods: {
		init(){
			this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
			this.info = this.dataList[ this.currIndex ].setting;
		},
	},
	mounted () {
	    this.init();
	},
}	
</script>