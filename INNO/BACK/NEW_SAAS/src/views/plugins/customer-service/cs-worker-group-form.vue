<style lang="less">
.cs-worker-group-form{
	
}
</style>

<template>
	<div class="cs-worker-group-form">
		<Card v-show="modalShow">
			<div slot="title">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
			</div>
			<div slot="extra">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
			
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
				<FormItem label="客服分组名称" prop="name">
					<Input v-model="formItem.name" placeholder="" style="width:200px;"  maxlength="12" show-word-limit></Input>
					<div>例如：“售前组”，“售后组”</div>
				</FormItem>
				<FormItem label="主动接入">
					<RadioGroup v-model="formItem.can_join">
						<Radio :label="1">
							<span>允许主动接入</span>
						</Radio>
						<Radio :label="0">
							<span>不允许</span>
						</Radio>
					</RadioGroup>
					<div>例如：设置分组“售后组”，售后组只能被转接入客户，那么选择“不允许”就可以了</div>
				</FormItem>
			</Form>
			
			<div class="form-footer-button-box">
				<Button @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>	
		</Card>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>

export default {
	name: 'csWorkerGroupForm',
    components: {
    },
    data () {
        return {
			// 管理员 表单内容
			formItem: {},
			
			// 表单数据规则
			ruleValidate:{
				name:[{ required: true, message: '分组名称不能为空', trigger: 'blur' },],
			},
			
			// 模态框
			modalShow: false,
			modalEditIndex: 0,
			
			isAdd: false,
			spinShow: false,
		}
	},
	methods: {
		// 初始化方法
		init () {
			
		},
		// 添加用户
		openModal( row ){
			this.modalShow = true;
		
			if( row.id === 0 ){
				this.isAdd = true;
				this.formItem = {
					id: 0,
					name:'',
					can_join: 1,
				};
			}
			else{
				this.isAdd = false;
				this.formItem = {
					id: row.id,
					name: row.name,
					can_join: row.can_join,
				};
			}
		
		},
		// 返回列表
		goBack(){
			this.modalShow = false;
			
			this.$emit('on-close', {});
		},
		// 模态框确认事件
		modalOk (){
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	this.spinShow = true;
		        	
		        	// ajax 保存编辑数据
		        	this.$ajax.post( ( this.isAdd ? this.$api.csWorkerGroupAdd : this.$api.csWorkerGroupEdit ), {
						id: this.formItem.id,
						name: this.formItem.name,
						can_join: this.formItem.can_join,
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			this.spinShow = false;
		    			
		    			if( res.code ){
		    				// 保存成功
		                    this.$Message.success( res.message );
							this.$emit('on-save');
							this.goBack();
		                }
		    		});
		        }
		        else {
		            this.$Message.error('必填项不能为空！');
		        }
		   });
		},
	},
}
</script>