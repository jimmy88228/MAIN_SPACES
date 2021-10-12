<template>
	<Modal v-model="modalShow" width="360">
			<div>
					<Form ref="myForm" :model="formData" :rules="rules">
						<FormItem prop="type_name" label="优惠券名称">
							<Input
							    class="search_input"
							    v-model="formData.type_name"
							    placeholder="请输入优惠券名称"
							    clearable/>
						</FormItem>
						<FormItem prop="type_code" label="优惠券编码">
							<Input
							    class="search_input"
							    v-model="formData.type_code"
							    placeholder="请输入优惠券编码"
							    clearable/>
						</FormItem>
					</Form>
			</div>
			<div slot="footer">
					<Button type="default" @click="modalShow = false">取消</Button>
					<Button type="primary" @click="comfirmCoupon">确定</Button>
			</div>
	</Modal>
</template>
<script>
	export default{
		data(){
			return {
				modalShow: false,
				formData:{
					type_name: "",
					type_code: ""
				},
				rules: {
					type_name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
					type_code: [{ required: true, message: '请输入优惠券编码', trigger: 'blur' }]
				}
			}
		},
		methods:{
			showModal(row){
				let type_name, type_code;
				if(row && row.type_id){
					this.type_id = row.type_id;
					type_name= row.type_name,
					type_code= row.type_code
				}
				this.formData = {
					type_name: type_name,
					type_code: type_code
				}
				this.modalShow = true;
			},
			comfirmCoupon(){
				this.$refs["myForm"].validate((valid)=>{
					console.log("valid", valid)
					if(valid){
						if(this.type_id){
							this.editCoupon();
						} else{
							this.addCoupon();
						}
					} else {
						this.$Message.info("请输入完整资料");
					}
				})
			},
			addCoupon () {
			  return this.$ajax.post(this.$api.MatrixPrizeBonusAdd, {
					...this.formData
				})
			  .then(response => {
			    const res = response.data;
			    if (res.code) {
						this.$Message.info(res.message);
						this.modalShow = false;
						this.searchPage()
					} else {
						this.$Message.warning(res.message);
					}
					
			  });
			},
			editCoupon () {
			  return this.$ajax.post(this.$api.MatrixPrizeBonusEdit, {
					...this.formData,
					type_id: this.type_id
				})
			  .then(response => {
			    const res = response.data;
			    if (res.code) {
			    	this.$Message.info(res.message);
			    	this.modalShow = false;
			    	this.searchPage()
			    } else {
						this.$Message.warning(res.message);
					}
			    
			  });
			},
			searchPage(){
				this.$emit("search", this.formSearch)
			}
		}
	}
</script>