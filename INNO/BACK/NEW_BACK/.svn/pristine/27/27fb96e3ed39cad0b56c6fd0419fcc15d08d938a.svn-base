<style lang="less">
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :width="500"
	        :title="modalTitle"
			:loading="modalLoading"
	        @on-cancel="onCancel"
			@on-ok="onOk">
	        
	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
				<FormItem label="小程序APPID" prop="name">
					<Input v-model="formItem.name" placeholder=""></Input>
				</FormItem>
	        	<FormItem label="小程序路径" prop="sn">
	        		<Input v-model="formItem.sn" placeholder=""></Input>
	        	</FormItem>
	        </Form>
		    
	    </Modal>    
	</div>
</template>	

<script>
/**
 * 小程序跳转
 */
export default {
	name: 'appletJump',
	components: {
	},
	props: {
	},
	data () {
		return {
			modalShow: false,
	    	modalTitle: '小程序跳转',
	    	modalLoading: true,
			
			formItem:{
				id: 0,
				sn: '',
				name: '',
				sourceTypeName: '小程序跳转',
			},
			
			// 表单数据规则
			ruleValidate:{
				name:[{ required: true, message: '请输入小程序的APPID', trigger: 'blur' },],
				sn:[{ required: true, message: '请输入小程序存在的路径', trigger: 'blur' },],
			},
			
			// 双向绑定的id
			sourceId: 0,
			sourceCode:'',
	    }
	},
	methods: {
    	// 初始化
    	init(){
    	},
    	// 打开模态框
    	openBox( code , id ){
    		this.modalShow = true;
    		this.sourceId = id;
    		this.sourceCode = code;
			
			this.formItem.name = '';
			this.formItem.sn = '';
    	},
    	// 选中某项
    	onOk(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
					this.modalShow = false;
					// 回调父组件
					this.$emit('on-ok', this.sourceCode, this.formItem);
				}
				else{
					// 验证失败，不关闭模态框
					this.modalShow = true;
					this.$Message.error('必填项不能为空！');
					this.modalLoading = false;
					
					setTimeout(() => {
						this.modalLoading = true;
					}, 50);
				}
			});	
    	},
    	onCancel(){
    		// 回调父组件
    		this.$emit('on-cancel', {});
    	},

   	},
	mounted () {
    	this.init();
    },
}
</script>