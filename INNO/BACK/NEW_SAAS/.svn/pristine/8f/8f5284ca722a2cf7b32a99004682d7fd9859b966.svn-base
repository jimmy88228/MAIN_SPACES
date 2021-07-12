<style lang="less">
.cs-form{
	padding:10px;
}	
</style>

<template>
	<div class="cs-form">
		<titleBar>客服组件 设置</titleBar>

		<Alert show-icon>在正式环境下，客服图标是浮动在右侧。这里只是方便编辑才固定在页面里面。</Alert>
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="标题文案" prop="name">
				<Input v-model="formItem.name" placeholder="" maxlength="4" show-word-limit></Input>
				<div>最多4个中文</div>
			</FormItem>
		</Form>
		
	</div>
</template>	

<script>
/**
 * 客服小工具
 */
import titleBar from '@/views/my-components/title-bar/title-bar';

export default {
	name: 'customerServiceForm',
	components:{
		titleBar,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
	},
    data () {
        return {
			formItem:{
				name: '在线咨询',
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
			if( typeof( this.formItem.name ) == 'undefined'){
				this.$set( this.formItem, 'name', '在线咨询');
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