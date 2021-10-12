<template>
	<Modal v-model="modalShow" width="360">
			<div>
					<Form ref="myForm" :model="formData" :rules="rules">
						<FormItem prop="goods_name" label="商品名称">
							<Input
							    class="search_input"
							    v-model="formData.goods_name"
							    placeholder="请输入商品名称"
							    clearable/>
						</FormItem>
						<FormItem prop="goods_sn" label="商品货号">
							<Input
							    class="search_input"
							    v-model="formData.goods_sn"
							    placeholder="请输入商品货号"
							    clearable/>
						</FormItem>
						<FormItem prop="is_virtual" label="商品类型">
							<Select v-model="formData.is_virtual">
								<Option :value="1">实物</Option>
								<Option :value="2">虚拟物品</Option>
							</Select>
						</FormItem>
					</Form>
			</div>
			<div slot="footer">
					<Button type="default" @click="modalShow = false">取消</Button>
					<Button type="primary" @click="comfirmGoods">确定</Button>
			</div>
	</Modal>
</template>
<script>
	export default{
		data(){
			return {
				modalShow: false,
				formData:{
					goods_name: "",
					goods_sn: "",
					is_virtual: 1
				},
				rules: {
					goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
					goods_sn: [{ required: true, message: '请输入商品编码', trigger: 'blur' }]
				}
			}
		},
		methods:{
			showModal(row){
				let goods_name, goods_sn, is_virtual = 1;
				if(row && row.goods_id){
					this.goods_id = row.goods_id;
					goods_name= row.goods_name;
					goods_sn= row.goods_sn;
					is_virtual = parseInt(row.is_virtual)
				}
				this.formData = {
					goods_name: goods_name,
					goods_sn: goods_sn,
					is_virtual: is_virtual
				}
				this.modalShow = true;
			},
			comfirmGoods(){
				this.$refs["myForm"].validate((valid)=>{
					if(valid){
						if(this.goods_id){
							this.editGoods();
						} else{
							this.addGoods();
						}
					} else {
						this.$Message.info("请输入完整资料");
					}
				})
			},
			addGoods () {
			  return this.$ajax.post(this.$api.MatrixPrizeGoodsAdd, {
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
			editGoods () {
			  return this.$ajax.post(this.$api.MatrixPrizeGoodsEdit, {
					...this.formData,
					goods_id: this.goods_id
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