<style lang="less">
.cs-worker-group-form{
	
}
</style>

<template>
	<div class="cs-worker-group-form">
		<Card v-show="modalShow">
			<div slot="title" class="icard-header">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
				</Tooltip>
				微页面分类设置
			</div>
			<div slot="extra">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
			
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
				<FormItem label="分类名称" prop="name">
					<Input v-model="formItem.name" placeholder="" style="width:220px;"  maxlength="20" show-word-limit></Input>
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
	name: 'pageCatForm',
    components: {
    },
    data () {
        return {
			// 表单内容
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
				};
			}
			else{
				this.isAdd = false;
				this.formItem = {
					id: row.id,
					name: row.name,
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
		        	this.$ajax.post( ( this.isAdd ? this.$api.cloudGoodsPageCatAdd : this.$api.cloudGoodsPageCatEdit ), {
						id: this.formItem.id,
						name: this.formItem.name,
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