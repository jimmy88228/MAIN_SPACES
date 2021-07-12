<template>
	<Modal
			width="500"
			v-model="showM"
			title="评论回复">
			<div>
				<Form :label-width="100" :model="formData" :rules="ruleValidate" ref="formValidate">
					<FormItem label="评论回复可见" prop="is_show_reply">
						<RadioGroup v-model="formData.is_show_reply">
							<Radio :label="0">只限当前会员</Radio>
							<Radio :label="1">所有会员</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="回复内容" prop="reply_msg">
						<Input type="textarea" v-model="formData.reply_msg" style="width:300px;"/>
					</FormItem>
				</Form>
			</div>
			<div slot="footer">
					<Button type="default" @click="showM = false">取消</Button>
					<Button type="primary" @click="onConfirm">确定</Button>
			</div>
	</Modal>
</template>
<script>
	import addSelfConmentForm from "./add-self-conment-form.vue";
	export default {
		props: [ "typeIndex" ],
		components: {
			addSelfConmentForm
		},
		data(){
			return {
				showM: false,
				tabAction: "",
				formData: {
					is_show_reply: 0,
					reply_msg: ""
				},
				ruleValidate: {
					reply_msg: [
							{ required: true, message: '请填写回复内容', trigger: 'blur' }
					],
				}
			}
		},
		methods:{
			showModule(row){
				this.showM = true;
				this.replyRow = row;
			},
			onConfirm(){
				this.$refs["formValidate"].validate((valid)=>{
					if(valid){
						console.log("replyRow", this.replyRow);
						if(!this.replyRow.id) return;
						return this.$ajax.post(this.$api.CloudGoodsUpdateCommentReply, {
							id: this.replyRow.id,
							is_show_reply: this.formData.is_show_reply,
							reply_msg: this.formData.reply_msg,
							type: this.typeIndex
						})
						.then(response => {
						  const res = response.data;
							console.log("评论", res);
						  if (res.code) {
								let data = res.data || {};
						    this.$emit("replyCallback");
								this.$Message.info(data.message);
								this.showM = false;
						  } else {
								this.$Message.info(res.message);
							}
						})
					} else {
						this.$Message.error('请完善回复信息！');
					}
				})
			}
		}
		
	}
</script>
<style>
	
</style>