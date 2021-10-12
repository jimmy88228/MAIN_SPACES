<template>
	<Modal v-model="isShowModal">
		<div slot="header">{{formItem.id ? '编辑分组' : '新增分组'}}</div>
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :labelWidth="100" >
			<FormItem label="分组名称" prop="group_name">
				<Input style="width:300px;" placeholder="分组名称" v-model="formItem.group_name"></Input>
			</FormItem>
			<FormItem label="显示控制" prop="is_enabled">
				<i-switch v-model="formItem.is_enabled" false-value="0" true-value="1" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<span style="color:red;margin-left:10px;">注：开启后该分组内的会员在店铺导航中只显示分组内的店铺</span>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button @click="isShowModal = false">返回</Button>
			<Button type="primary" @click="saveGroup">保存</Button>
		</div>
	</Modal>
</template>
<script>
	export default{
		data(){
			return {
				isShowModal: false,
				formItem:{
					id:0,
					group_name:'',
					is_enabled:'1'
				},
				ruleValidate:{
					group_name:[{required: true, message: '分组名称不能为空', trigger: 'blur'}],
				}
			}
		},
		methods:{
			showModal(editInfo){
				if(editInfo && editInfo.id) this.formItem = editInfo || {};
				this.isShowModal = true;
			},
			saveGroup(){
				this.$refs["formValidate"].validate((valid)=>{
					if(valid){
						this.spinShow = true;
						let id = parseInt(this.formItem.id) || 0;
						let req = id ? 'storeNavigationGroupEdit' : 'storeNavigationGroupAdd'
						this.$ajax.post(this.$api[req],{
							id: id,
							group_name: this.formItem.group_name,
							is_enabled: this.formItem.is_enabled
						}).then((response)=>{
							let res = response.data || {};
							if(res.code){
								this.$Message.success(res.message);
								this.isShowModal = false;
								this.$emit("saveCallback")
							}
						}).finally(()=>{
							this.spinShow = false;
						})
					}
				})
			}
		}
	}
</script>