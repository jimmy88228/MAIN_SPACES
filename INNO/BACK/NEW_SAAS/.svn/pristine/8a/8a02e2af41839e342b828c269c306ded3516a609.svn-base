<style lang="less">
.image-text-nav-view{
	padding:5px;
	
	.image-item{
		position: relative;
		overflow: hidden;
		line-height: 1;
		text-align: center;
		font-size: 12px;
		
		img{
			width:100%;
		}
		.text{
			margin: 5px 0;
		}
	}
	
	.text-item{
		line-height: 3.2;
		text-align: center;
		font-size: 12px;
	}
}	
</style>

<template>
	<div class="image-text-nav-view">
		
		<!-- 图文导航 -->
		<template v-if=" info.type == 'imageText' && info.items.length > 0 ">
			<Row type="flex" style="flex-wrap:wrap;" align="middle" :gutter="info.gutter">
				<template v-if="info.row == 5">
					<!--五张图的时候显示不下，只能采用自动适配-->
					<Col v-for="(item,index) in info.items" :key="index"
						v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= info.row ) "
						style="width:20%;"
						class="image-item">
						<img v-if="item.image != '' && info.open_icon == false" :src="item.image" />
						<Avatar v-else icon="md-image" :shape="info.icon_shape" :src="item.image" />
						<div class="text"><span>{{item.title}}</span></div>
					</Col>
				</template>
				<template v-else>
					<Col v-for="(item,index) in info.items" :key="index"
						v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= info.row ) "
						:span="( 24/info.row )"
						class="image-item">
						<img v-if="item.image != '' && info.open_icon == false" :src="item.image" />
						<Avatar v-else icon="md-image" :shape="info.icon_shape" :src="item.image" :size="40" />
						<div class="text">
							<span :style="{color: info.textColor}">{{item.title}}</span>
						</div>
					</Col>
				</template>
			</Row>
		</template>
		
		<!-- 文字导航 -->
		<div v-else>
			<Row type="flex" align="middle" :gutter="info.gutter">
				<Col v-for="(item,index) in info.items" :key="index"
					:style="{width: (100/info.items.length)+'%'}"
					class="text-item">
					<div class="text">
						<span :style="{color: info.textColor}">{{item.title}}</span>
					</div>
				</Col>
			</Row>
		</div>

	</div>
</template>	

<script>
/**
 * 图文导航渲染组件
 */
export default {
	name: 'imageTextNavigateView',
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
			
			t2_val:0,
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
	watch:{

	},
	mounted () {
	    this.init();
	},
}	
</script>