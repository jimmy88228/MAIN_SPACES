<style lang="less">
</style>
	
<template>
	<div>
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
		
			<FormItem label="工单状态" prop="fb_status_str">
				<RadioGroup v-model="formItem.fb_status" @on-change="radioChange">
					<Radio :label="1">已受理</Radio>
					<Radio :label="2">已处理</Radio>
					<Radio :label="3">已确认</Radio>
				</RadioGroup>
			</FormItem>
			
			<div style="text-align: center;">
				<Button type="primary" size="small" @click="onSave">确定</Button>
				<Button size="small" @click="onCancel">取消</Button>
			</div>
		</Form>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>	

<script>
import util from '@/libs/util.js';

export default {
	name: 'feedbackStatusForm',
    components: {
	},
	props:{
		fbId:{
			type:Number,
			default:0
		},
		fbStatus:{
			type:Number,
			default:0
		}
	},
	data() {
		return{
			spinShow: false,
			
			formItem:{
				fb_status: 0,
				fb_status_str: '',
			},
			
			ruleValidate:{
				fb_status_str:[{ required: true, message: '状态不能为空', trigger: 'blur' }],
			},
		}
	},
	methods: {
		initData(){
			this.formItem.fb_status = this.fbStatus;
			if( this.formItem.fb_status != 0 && this.formItem.fb_status != '' && this.formItem.fb_status != null ){
				this.formItem.fb_status_str = 'OK';
			}
		},
		// 保存排序
		onSave(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
					this.spinShow = true;
					util.ajax.post( util.apiUrl.feedbackEdit, {
						id : this.fbId,
						fbStatus: this.formItem.fb_status,
					})
					.then( (response) => {
						this.spinShow = false;
						var res = response.data;
						
						if( res.code ){
							this.$Message.success( res.message );
							this.$emit('on-success', this.formItem.fb_status );
						}
						else{
							this.$Message.error( res.message );
						}
					});	
				}
			});
		},
		onCancel(){
			this.$emit('on-cancel');
		},
		radioChange( val ){
			this.formItem.fb_status_str = 'OK';
		},
	}
}
</script>