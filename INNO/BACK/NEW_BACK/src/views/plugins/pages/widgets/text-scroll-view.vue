<style lang="less">
.text-scroll-view{
	display: flex;
	overflow: hidden;
	
	.warp{
		width: 100%;
		margin: 0 auto;
		overflow: hidden;
		
		ul{
			list-style: none;
			padding: 0;
			margin: 0 auto;
			line-height: 3.5;
			
			ul.item-flex{
				display: flex;
				line-height: 3.5;
			}
		}
		
	}
	
	.primary{
		background-color: #ecf5ff;
		color: #2979ff;
	}
	.success{
		background-color: #dbf1e1;
		color: #19be6b;
	}
	.warning{
		background-color: #fdf6ec;
		color: #f90;
	}
	.error{
		background-color: #fef0f0;
		color: #fa3534;
	}
}
</style>
	
<template>
	<div class="text-scroll-view">
		<div v-if="info.showIcon" style="width:30px;text-align:center;" :class="info.type">
			<Icon type="md-volume-up" size="22" :style="{'margin-top': ( (info.fontSize) + (info.fontSize - 14) * 0.8 ) +'px'}"></Icon>
		</div>
		<div style="flex:1 1 0%;">
			<vue-seamless-scroll 
			ref="seamless-scroll"
			:key="t"
			class="warp"
			:class="info.type"
			:style="{height: (50+ (info.fontSize-14)*3 )+'px'}"
			:data="info.textList2"
			:classOption="info.option">
				<ul class="item" :class=" info.option.direction >=2 ? 'item-flex' : '' ">
					<li v-for="(item, index) in info.textList2" :key="index"
					v-if="item.is_enable">
						<div :style=" (info.fontSize !='' ? 'font-size:' + info.fontSize+'px;' : '') ">{{item.text}}</div>
					</li>
				</ul>
			</vue-seamless-scroll>
		</div>
	</div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll';
	
/**
 * 文字滚动组件
 */
export default {
	name: 'textScrollView',
    components: {
		vueSeamlessScroll,
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
	data() {
	    return {
			info:{
				option:{},
			},
			dataList:[],
			t: 0,
		}
	},
	computed: {

	},
	methods: {
		init(){
			this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
			this.info = this.dataList[ this.currIndex ].setting;
			
			if( typeof( this.info.option ) == 'undefined' ){
				this.$set(this.info, 'option', {
					direction: 0, // 滚动方向：0 往下 1 往上 2 向左 3 向右
					limitMoveNum:2,
				});
			}
			
			this.info.textList2 = [];
			if( this.info.textList.length == 1 ){
				this.info.textList2.push( this.info.textList[0] );
				this.info.textList2.push( this.info.textList[0] );
			}
			else{
				this.info.textList.forEach((item)=>{
					this.info.textList2.push( item );
				});
			}
		},
	},
	watch:{
		// 深度监听 info
		'info':{
			handler( to, from ){
				if( this.info.option.direction >= 2 ){
					this.$set( this.info.option, 'singleHeight', 0 );
				}
				else{
					this.$set( this.info.option, 'singleHeight', 50 );
				}
				// 监听到 direction 有变化，重新渲染
				this.t = (new Date()).valueOf();
			},
			deep: true,
		}
	},
	mounted () {
	    this.init();
	},
}	
</script>