<template>
	<Modal v-model="isShowModal">
		<div slot="header">{{formItem.id ? '编辑分组' : '新增分组'}}</div>
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :labelWidth="110" >
			<FormItem label="分组名称" prop="name">
				<Input style="width:300px;" placeholder="分组名称" v-model="formItem.name"></Input>
			</FormItem>
			<FormItem label="是否启用" prop="is_enabled">
				<i-switch v-model="formItem.is_enabled" false-value="0" true-value="1" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<!-- <span style="color:red;margin-left:10px;">注：开启后该分组内的会员在店铺导航中只显示分组内的店铺</span> -->
			</FormItem>
			<FormItem label="绑定自定义页" prop="page_id">
				<Button type="dashed" @click="choosePage">{{formItem.page_id ? pageInfo.name : '请选择绑定页面'}}</Button>
				<Input v-show="false" v-model="formItem.page_id" />
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
					name:'',
					is_enabled:'1',
				},
				pageInfo: {},
				ruleValidate:{
					name:[{required: true, message: '分组名称不能为空', trigger: 'blur'}],
					page_id:[{required: true, message: '请选择绑定的自定义页面', trigger: 'change'}],
				}
			}
		},
		methods:{
			showModal(editInfo){
				if(editInfo && editInfo.id) {
					this.pageInfo = editInfo.get_custom_pages || {};
					delete editInfo.get_custom_pages;
					this.formItem = editInfo || {};
				}
				this.isShowModal = true;
			},
			saveGroup(){
				this.$refs["formValidate"].validate((valid)=>{
					if(valid){
						this.spinShow = true;
						let id = parseInt(this.formItem.id) || 0;
						let req = id ? 'storeIndexGroupEdit' : 'storeIndexGroupAdd'
						this.$ajax.post(this.$api[req], this.formItem).then((response)=>{
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
			},
			choosePage(){
				this.$selectContent({
					mode: 'pages',
					type: 'radio',
					data: [this.pageInfo],
					getList:(data)=>{
						let info = data[0] || {};
						let id = info.id || 0;
						this.$set(this.formItem, 'page_id', id);
						this.$set(this.pageInfo, 'id', id);
						this.$set(this.pageInfo, 'name', info.name);
						this.$set(this.pageInfo, 'page_id', id);
					}
				})
			}
		}
	}
</script>