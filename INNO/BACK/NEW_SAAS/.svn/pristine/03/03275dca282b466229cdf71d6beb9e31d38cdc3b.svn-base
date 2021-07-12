<template>
	<div class="goods-content-switch-form">
		<Divider>显示内容设置</Divider>
		
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="left" :label-width="250">
			<FormItem label="显示商品名称">
				<i-switch v-model="formItem.content_switch.show_goods_name" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
			<FormItem label="显示商品价格">
				<i-switch v-model="formItem.content_switch.show_price" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
		</Form>
	</div>
</template>

<script>
/**
 * 标题文本小工具
 */

export default {
	name: 'goodsContentSwitchForm',
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
    headerTitle:{
    	type:String,
    	default: ''
    }
	},
    data () {
        return {
			formItem:{
				content_switch:{}
			},

			// 表单数据规则
			ruleValidate:{},
        }
    },
    computed: {
	},
	methods: {
		init(){
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;

			// 对缺省内容的初始化
			if( typeof( this.formItem.content_switch ) == 'undefined'){
				this.$set( this.formItem, 'content_switch', {
					show_goods_name: true,
					show_price: true,
					show_time: true,
					show_button: true,
				});
			}
		},
	},
	watch:{
		'currIndex' (to){
			this.init();
		}
	},
	mounted () {
		this.init();
	},
}
</script>

<style lang="less">
.goods-content-switch-form{
	padding:10px;
}
</style>