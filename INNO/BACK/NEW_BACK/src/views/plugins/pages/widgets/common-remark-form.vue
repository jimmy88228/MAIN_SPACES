<template>
	<div class="remark-form-box">
		<Divider>组件备注名称</Divider>
		
		<Form ref="formValidate" :model="formItem">
			<FormItem>
				<Input v-model="formItem.widgetRemark" placeholder="请输入备注名称" 
				size="small"></Input>
				<div class="tips">注意：备注名称只对后台操作人员有用，修改后在“组件管理”可以看到这个备注，方便对组件排序；输入的备注信息，不会对前端显示有任何影响。</div>
			</FormItem>	
		</Form>	
	</div>
</template>

<script>
	/**
	 * 组件统一备注 - 组件
	 */
	export default {
		name: 'commonRemarkForm',
		components: {

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
					
				},
			}
		},
		methods: {
			// 初始化
			init(){
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[ this.currIndex ].setting;
				let formItem = this.formItem || {};

				if( typeof( this.formItem.widgetRemark ) == 'undefined' ){
					this.$set(this.formItem, 'widgetRemark', '');
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
	.remark-form-box{
		padding: 10px;
		
		.tips{
			margin-top:5px;
			font-size:12px;
			line-height: 1.5;
		}
		.ivu-form-item{
			margin-bottom: 0;
		}
	}
</style>
