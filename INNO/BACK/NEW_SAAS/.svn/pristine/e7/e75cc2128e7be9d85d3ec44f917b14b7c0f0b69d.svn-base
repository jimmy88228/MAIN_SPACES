<style lang="less">
.release-form{
	
}
</style>

<template>
	<Card v-show="modalShow" class="release-form">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			编辑系统发布日志
		</div>
		<div slot="extra">
			<Button type="primary" @click="modalOk">保存</Button>
		</div>
		
		<!--表单-->
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
			<FormItem label="版本号" prop="name">
				<Input v-model="formItem.name" placeholder="请输入版本号" style="width:300px;"></Input>
				<div>例如：1.0.1.20201121</div>
			</FormItem>
			<FormItem label="版本别名" prop="alias_name">
				<Input v-model="formItem.alias_name" placeholder="请输入版本别名" style="width:300px;"></Input>
				<div>给版本号定义一个好听的别名，例如：棉花糖</div>
			</FormItem>	
			<FormItem label="发布日期" prop="release_date">
				<DatePicker 
				v-model="formItem.release_date" 
				:options="options"
				type="date" 
				placeholder="" 
				style="width: 120px"
				@on-change="onDateChange"></DatePicker>
				<div>计划发布的日期</div>
			</FormItem>	
			<div class="form-footer-button-box">
				<Button type="default" @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
		</Form>	
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>	
</template>

<script>
/**
 * 编辑发布日志表单
 */	
export default {
	name: 'releaseForm',
	components: {
	},
	props: {
	},
	data () {
    	return {
			modalShow: false,
			
			// 表单内容
			formItem: {
				id: 0,
				name: '',
				alias_name: '',
				release_date: '',
			},
			
			// 表单数据规则
			ruleValidate:{
				name:[{ required: true, message: '版本号不能为空', trigger: 'blur' },],
				release_date:[{ required: true, message: '发布日期不能为空', trigger: 'blur' },],
			},
			
			options: {
				disabledDate (date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			
			// 加载提示
			spinShow: false,
		}
	},
	methods: {
		// 打开模态框
		openModal (row){
			this.modalShow = true;
			
			if( typeof(row.id) == 'undefined' || row.id == 0 ){
				this.formItem.id = 0;
				this.formItem.name = '';
				this.formItem.alias_name = '';
				this.formItem.release_date = '';
			}
			else{
				// 编辑时候的初始化数据
				this.formItem.id = row.id;
				this.formItem.name = row.name;
				this.formItem.alias_name = row.alias_name;
				this.formItem.release_date = row.release_date;
				
				this.onDateChange( row.release_date );
			}
		},
		// 保存按钮
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	this.spinShow = true;
					
					this.$ajax.post( ( this.formItem.id == 0 ? this.$api.releaseAdd : this.$api.releaseEdit ), {
						id: this.formItem.id,
						name: this.formItem.name,
						alias_name: this.formItem.alias_name,
						release_date: this.formItem.release_date,
					})
					.then( (response) => {
						var res = response.data;
						this.spinShow = false;
						
						if( res.code ){
							this.$Message.success( res.message );
							
							this.modalShow = false;
							this.$emit('on-success', res );
						}
					});
				}
			});
		},
		onDateChange( val ){
			this.formItem.release_date = val;
			
			// 检查某个字段
			this.$refs['formValidate'].validateField('release_date', ( msg )=>{
				// 检查图片是否为空
			});
		},
		// 返回列表
		goBack(){
			this.modalShow = false;
			this.$emit('on-close', {});
		},
	},
}
</script>	