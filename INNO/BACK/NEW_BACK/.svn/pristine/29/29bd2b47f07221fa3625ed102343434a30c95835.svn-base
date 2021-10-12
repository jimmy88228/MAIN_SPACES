<template>
	<Modal
	        v-model="showM"
	        title="新增自定义渠道">
	        <div>
						<Form class="add-label-page" :model="formData" :rules="ruleValidate" ref="addChannelForm">
						  <FormItem label="渠道名称" prop="channel_name" :label-width="100">
						      <div class="limit-width">
						          <Input placeholder="请输入渠道名称，10字以内" v-model="formData.channel_name"></Input>
						      </div>
						  </FormItem>
						  <FormItem label="渠道代码" prop="channel_code" :label-width="100">
						      <div class="limit-width">
						          <div class="limit-width">
						              <Input placeholder="请输入渠道代码" :disabled="formData.id ? true : false" v-model="formData.channel_code"></Input>
						          </div>
						      </div>
						  </FormItem>
							<FormItem label="推广页面" prop="page_path" :label-width="100">
							    <div class="limit-width">
							        <div class="limit-width">
							            <Input placeholder="请输入推广页面" :disabled="formData.id ? true : false" v-model="formData.page_path"></Input>
							        </div>
							    </div>
							</FormItem>
							<FormItem label="备注" prop="remark" :label-width="100">
							    <div class="limit-width">
							        <div class="limit-width">
							            <Input placeholder="备注" type="textarea" v-model="formData.remark"></Input>
							        </div>
							    </div>
							</FormItem>
						</Form>
					</div>
					<div slot="footer">
						<Button type="default" @click="showM = false">取消</Button>
						<Button type="primary" @click="confirmAdd">确定</Button>
					</div>
	    </Modal>
</template>
<script>
	export default{
		data(){
			return {
				showM: false,
				formData: {
					channel_name: "",
					channel_code: "",
					page_path: "",
					remark: ""
				},
				ruleValidate: {
					channel_name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
					channel_code: [{ required: true, message: '请输入渠道代码', trigger: 'blur' }],
					page_path: [{ required: true, message: '请输入推广页面', trigger: 'blur' }]
				}
			}
		},
		methods:{
			showModal(info){
				console.log(info);
				this.formData = info || {};
				this.showM = true;
			},
			confirmAdd(){
				this.$refs['addChannelForm'].validate((valid)=>{
					if(valid){
						let formData = this.formData || {}
						if(formData.id){
							this.editCustomChannel();
						} else {
							this.addCustomChannel();
						}
					} else {
						this.$Message.error('请完善提交信息!');
					}
				})
			},
			editCustomChannel(){
				return this.$ajax.post(this.$api.customChannelEdit,{
					channel_name: this.formData.channel_name,
					id: this.formData.id,
					remark: this.formData.remark
				}).then((response) => {
						var res = response.data;
						if (res.code) {
							this.$emit("editCustomEvent");
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
						this.showM = false;
				});
			},
			addCustomChannel(){
				return this.$ajax.post(this.$api.customChannelAdd,{
					...this.formData
				}).then((response) => {
						var res = response.data;
						if (res.code) {
							this.$emit("editCustomEvent");
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
						this.showM = false;
				});
			}
		}
	}
</script>