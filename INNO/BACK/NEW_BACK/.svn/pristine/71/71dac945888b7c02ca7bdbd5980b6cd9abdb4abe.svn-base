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
				<FormItem label="视频号ID" prop="id">
					<Input v-model="formItem.id" placeholder=""></Input>
				</FormItem>
	        </Form>
		    
	    </Modal>    
	</div>
</template>	

<script>
/**
 * 小程序跳转视频号功能
 */
export default {
	name: 'jumpVideo',
	components: {
	},
	props: {
	},
	data () {
		return {
			modalShow: false,
	    	modalTitle: '跳转视频号',
	    	modalLoading: true,
			
			formItem:{
				id: '',
				sn: '',
				name: '',
				sourceTypeName: '跳转视频号',
			},
			
			// 表单数据规则
			ruleValidate:{
				id:[{ required: true, message: '请输入视频号ID', trigger: 'blur' },],
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
    	},
    	// 选中某项
    	onOk(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
					this.modalShow = false;
					
					this.formItem.name = this.formItem.id;
					
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