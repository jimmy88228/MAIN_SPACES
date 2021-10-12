<template>
	<div>
		<Modal v-model="modalShow" 
		:title="modalTitle" 
		:loading="modalLoading" 
		:width="800"
		@on-ok="modalOk">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
				<FormItem label="区域名称" prop="area_name">
					<Input v-model="formItem.area_name" placeholder="" style="width:220px;"  maxlength="30" show-word-limit></Input>
				</FormItem>
				<FormItem label="地区绑定">
					<!--地区选择器-->
					<Row type="flex" v-for="(addr, index) in address" :key="index" style="width:260px;margin-bottom: 5px;">
						<Col style="flex:1 1 0%;">
							<addressSelect :initData="addr" selectRange="city" @click.native="onClickArea(index)" @selectArea="onSelectArea"></addressSelect>
						</Col>
						<Col style="width:50px;">
							<Icon v-if="index > 0" 
							type="md-close-circle" 
							size="22" color="orange" 
							style="cursor: pointer;margin-top:5px;" 
							title="移除"
							@click.native="removeArea(index)"/>
						</Col>
					</Row>

					<Button @click="addArea" icon="md-add">新增地区</Button>
				</FormItem>
				<FormItem label="推荐门店绑定">
					<Tag v-for="(store, index) in stores" :key="index" closable size="large"
						@on-close="storeClose(index)">{{store.store_name}} {{store.store_code}} {{store.cancel == 'Y' ? "（店铺已关闭）" : ""}}</Tag>
					<div>
						<Button @click="onSelectStore" icon="md-add">添加店铺</Button>
					</div>
					
				</FormItem>
			</Form>	
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>

		<!--店铺选择器-->
		<storeSelect ref="store-select" @on-ok="onStoreOk"></storeSelect>
	</div>
</template>

<script>
	import storeSelect from '@/views/my-components/store-select/store-select';
	import addressSelect from '@/views/my-components/address/index.vue';
	
	/**
	 * 区域编辑框
	 */
	export default {
		name: 'tabAreaForm',
		components: {
			addressSelect,
			storeSelect,
		},
		data() {
			return {
				modalShow: false,
				modalTitle: '区域编辑框',
				modalLoading: true,
				
				stores:[],
				address:[],
				currAddressIndex: 0,
				formItem: {
					id: 0,
					area_name: '',
				},
				// 表单数据规则
				ruleValidate:{
					area_name:[{ required: true, message: '区域名称不能为空', trigger: 'blur' },],
				},
				spinShow: false
			}
		},
		methods: {
			openModal(row){
				this.modalShow = true;
				
				if( row.id == null ){
					this.formItem.id = 0;
					this.formItem.area_name = '';
					this.stores = [];
					this.address = [['']];
				}
				else{
					var tmpAddr = [];
					for(var i in row.get_region){
						var arrAddr = [];
						arrAddr.push(row.get_region[i].province_id);
						row.get_region[i].city_id > 0 ? arrAddr.push(row.get_region[i].city_id) : '';
						tmpAddr.push(arrAddr);
					}
					tmpAddr.length == 0 ? tmpAddr = [['']] : '';
					
					this.formItem.id = row.id;
					this.formItem.area_name = row.area_name;
					this.stores = row.get_store;
					this.address = tmpAddr;
				}
				
			},
			// 选择门店
			onSelectStore(){
				this.$refs['store-select'].openModal( [], 'checkbox' );
			},
			// 移除门店
			storeClose( index ){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete( this.stores, index );
					},
				});
			},
			// 选门店的组件的 回调
			onStoreOk( items ){
				// 检查重复
				var tmp = [];
				for(var j in this.stores){
					tmp.push( this.stores[j].store_id );
				}
				
				for(var i in items){
					if( tmp.indexOf( items[i].id ) == -1 ){
						this.stores.push({
							'store_id': items[i].id,
							'store_name': items[i].name,
							'store_code': items[i].code,
						});
					}
				}
			},
			// 提交表单
			modalOk(){
				this.$refs['formValidate'].validate((valid) => {
				    if (valid) {
						// 抑制马上关闭弹出框
						this.modalShow = true;
						this.modalLoading = true;
						
						// ajax提交数据
						this.spinShow = true;
						this.$ajax.post( this.formItem.id == 0 ? this.$api.visitAreaAdd : this.$api.visitAreaEdit, {
							id: this.formItem.id,
							area_name: this.formItem.area_name,
							stores: this.stores,
							address: this.address,
						})
						.then(response => {
							this.spinShow = false;
							const res = response.data;
							if (res.code) {
								this.$Message.success( res.message );
								this.modalShow = false;
								this.modalLoading = false;
								
								// 刷新列表
								this.$emit('on-success');
							}
							else{
								this.modalShow = true;
								this.$Message.error( res.message );
								this.modalLoading = false;
								
								setTimeout(() => {
									this.modalLoading = true;
								}, 50);
							}
						});
					}
					else{ 
						this.modalShow = true;
						this.$Message.error("必填项不能为空");
						this.modalLoading = false;

						setTimeout(() => {
							this.modalLoading = true;
						}, 50);
					}
				});
			},
			// 选中地区组件的回调
			onSelectArea( res ){
				var dataVal= [];
				for(var i in res){
					dataVal.push( res[i].value );
				}
				this.$set( this.address, this.currAddressIndex, dataVal );
				console.log(this.address);
			},
			// 修改当前编辑的地区索引
			onClickArea(index){
				this.currAddressIndex = index;
			},
			// 添加地区
			addArea(){
				this.address.push([{}]);
			},
			// 移除地区
			removeArea( index ){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete( this.address, index);
					},
				});	
			}
		}	
	}
</script>