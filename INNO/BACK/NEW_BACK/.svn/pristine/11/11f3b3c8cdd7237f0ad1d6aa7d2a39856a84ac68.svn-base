<style lang="less">
.activity-header-view{
	padding:15px;
	margin-bottom:0;
	
	.name{
		position: relative;
	}
}
</style>

<template>
	<div class="activity-header-view" :style="boxStyle">

		<div v-if="typeof(info.headerTitle) != 'undefined' && info.headerTitle != '' && this.info.openHeader " >
			<div class="name" :style="nameStyle">
				<template v-if="info.showMore">
					<Row  type="flex" justify="center" align="top">
						<Col :span="24">{{info.headerTitle}}</Col>
					</Row>
					<span :style="showMoreStyle">
						<template v-if="info.showMoreStyle == 'style1' || info.showMoreStyle == 'style2' ">
							{{info.showMoreText != '' ? info.showMoreText : '查看更多'}}
						</template>
						<template v-if="info.showMoreStyle == 'style2' || info.showMoreStyle == 'style3' ">
							<Icon type="ios-arrow-forward" size="14" />
						</template>
					</span>
				</template>
				<template v-else>
					{{info.headerTitle}}
				</template>
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
		// 整体样式
		boxStyle(){
			return {
				'text-align': this.info.textAlign,
				'background-color': this.info.bgColor,
			};
		},
		// 标题样式
		nameStyle(){
			return {
				'font-size': this.info.nameFontSize + 'px',
				color: this.info.textColor,
			};
		},
		// 内容样式
		descStyle(){
			return {
				'font-size': this.info.descFontSize + 'px',
				color: this.info.textColor,
			};
		},
		showMoreStyle(){
			var mstyle = {};
			switch( this.info.showMoreStyle ){
				case 'style1':
					mstyle = {
						'font-size': '12px',
					};
					break;

				case 'style2':
					mstyle = {
						'font-size': '12px',
					};
					break;

				case 'style3':
					mstyle = {

					};
					break;
			}
			
			mstyle['position'] = "absolute";
			mstyle['right'] = "0";
			mstyle['top'] = "3px";
			return mstyle;
		},
	},
	methods: {
		init(){
			this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
			this.info = this.dataList[ this.currIndex ].setting;
			
			if( typeof(this.info.headerTitle) != 'undefined' ){
				if( typeof(this.info.openHeader) == 'undefined' ){
					this.$set(this.info, 'openHeader', true);
				}
			}
		},
	},
	mounted () {
	    this.init();
	},
}
</script>
