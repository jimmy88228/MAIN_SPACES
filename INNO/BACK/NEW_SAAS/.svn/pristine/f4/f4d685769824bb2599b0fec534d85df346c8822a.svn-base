<template>
	<PageTopBase topTitle="商品下发方案" :isSave="!disabled" @save="confirm" class="goods_push_form">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
			<FormItem label="方案名称" prop="taskName">
				<Input placeholder="请输入方案名称" v-model="formItem.taskName" class="basic_input" :disabled="disabled" />
			</FormItem>	
			
			<FormItem label="商品">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						&nbsp;
					</Col>
					<Col style="width:250px;text-align: right;">
						<div class="header" style="margin-bottom: 24px; text-align: right;">
							<Button type="info" icon="md-add" class="brand-list_import" @click="handleImport" v-if="!disabled">导入商品</Button>
							<Button type="success" icon="md-add" class="brand-list_import" @click="handleSelect" v-if="!disabled">添加商品</Button>
						</div>
					</Col>
				</Row>
				
				<Table :columns="tableColumns" :data="tableData" ref="myTable">
					<template slot-scope="{ row }" slot="name">
						<div class="img_list_wrap">
							<div class="img_fixed">
								<img :src="row.goods_img" v-if="row.goods_img" :alt="row.goods_name" v-viewer />
								<img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
							</div>
							<span class="name">{{row.goods_name}}</span>
						</div>
					</template>
					<template slot-scope="{ row, index }" slot="time">
						<DatePicker v-if="row.type == 4" type="datetimerange" v-model="row.time" style="width: 100%;" placeholder="请输入促销时间"
						 confirm transfer :disabled="disabled" @on-change="v => handleData(v, 'time', index)"></DatePicker>
						<span v-else>-</span>
					</template>
					<template slot-scope="{ row, index }" slot="sale">
						<i-switch v-model="row.sale" true-value="1" false-value="0" size="large" @on-change="v => handleData(v, 'sale', index)"
						 :disabled="disabled">
							<span slot="open">开启</span>
							<span slot="close">关闭</span>
						</i-switch>
					</template>
					<template slot-scope="{ row, index }" slot="type">
						<Select v-model="row.type" transfer @on-change="v => handleData(v, 'type', index)" :disabled="disabled">
							<Option value="1">普通商品</Option>
							<Option value="4">促销商品</Option>
						</Select>
					</template>
					<template slot-scope="{ row }" slot="prosn">
						<ul>
							<li v-for="item in row.product_sn" :key="item" class="edit_item">{{item}}</li>
						</ul>
					</template>
					<template slot-scope="{ row }" slot="price">
						<ul>
							<li v-for="item in row.market_price" :key="item" class="edit_item">{{item}}</li>
						</ul>
					</template>
					<template slot-scope="{ row, index }" slot="sale_price">
						<ul v-if="row.type == 4">
							<li v-for="(item, i) in row.sale_price" :key="i" class="edit_item">
								<InputNumber placeholder="请输入销售价" v-model="item.value" @on-change="val => handleData(val, 'sale_price', index, i)"
								 :disabled="disabled" />
							</li>
						</ul>
						<span v-else>-</span>
					</template>
					<template slot-scope="{ row, index }" slot="on_sale">
						<ul>
							<li v-for="(item, i) in row.on_sale" :key="i" class="edit_item">
								<i-switch v-model="item.value" true-value="1" false-value="0" size="large" 
								@on-change="v => handleData(v, 'on_sale', index, i)"
								 :disabled="disabled">
									<span slot="open">开启</span>
									<span slot="close">关闭</span>
								</i-switch>
							</li>
						</ul>
					</template>
					<template slot-scope="{ row, index }" slot="handle">
						<a v-if="!disabled" @click="delGoods(index)">移除</a>
						<span v-else> - </span>
					</template>	
				</Table>
			</FormItem>
			<FormItem label="所属店铺">
				<store-select :data="storeData" type="checkbox" @del-tag="handleStoreClose" style="display: inline;">
					<Button type="dashed" @click="handleStoreSelected" class="basic_select" v-if="!disabled">选择所属店铺</Button>
				</store-select>
			</FormItem>	
			<FormItem label="执行方式">
				<RadioGroup v-model="execTimeType">
					<Radio :label="0" :disabled="disabled">发布后立即执行</Radio>
					<Radio :label="1" :disabled="disabled">发布后指定时间执行</Radio>
					<DatePicker v-show=" execTimeType == 1" type="datetime" 
					v-model="execTime" placeholder="请输入执行时间" confirm transfer 
					:disabled="execTimeType != 1 || disabled"
					 @on-change="handleExec"></DatePicker>
				</RadioGroup>
			</FormItem>	
			<FormItem v-if="disabled" label="执行状态">
				<Tag color="blue">{{status_str}}</Tag> {{lastExecTime}}
			</FormItem>	
		</Form>
		
		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</PageTopBase>
</template>
<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import Mixin from './form-mixin';
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	import SearchForm from './search-form-push';
	import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		props: ['id'],
		mixins: [Mixin],
		data() {
			return {
				tableData: [],
				cacheData: [],
				storeData: [],
				execTimeType: -1,
				execTime: '',
				status_str: '',
				lastExecTime: '',
				disabled: false,
				
				formItem:{
					taskName:'',
				},
				// 表单数据规则
				ruleValidate:{
					taskName:[{ required: true, message: '名称不能为空', trigger: 'blur' },],
				},
				
				spinShow: false,
			}
		},
		components: {
			PageTopBase,
			StoreSelect,
			SearchForm,
			BatchImport
		},
		methods: {
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.ShopPushView, {
						id: this.id
					})
					.then(response => {
						this.spinShow = false;
						const res = response.data;
						if (res.code) {
							let data = res.data.items;
							this.formItem.taskName = data.task_name;
							this.execTimeType = data.exec_time_type;
							this.execTime = data.plan_exec_time;
							this.lastExecTime = data.exec_time;
							this.status_str = data.status_str;
							this.storeData = data.goods_sync_task_store.map(item => item.store_data);
							this.tableData = data.goods_sync_task_goods.map(item => {
								return {
									id: item.goods.goods_id,
									name: item.goods.goods_name,
									goods_img: item.goods.goods_img,
									goods_name: item.goods.goods_name,
									goods_sn: item.goods.goods_sn,
									sale: item.is_on_sale,
									type: item.sale_type,
									time: [item.stime, item.etime],
									product_sn: item.goods_sync_task_product.map(c => c.product_sn),
									market_price: item.goods_sync_task_product.map(c => c.market_price),
									product_ids: item.goods_sync_task_product.map(c => c.product_id),
									sale_price: item.goods_sync_task_product.map(c => ({
										value: +c.sale_price
									})),
									on_sale: item.goods_sync_task_product.map(c => ({
										value: c.is_on_sale
									}))
								}
							});
							
						}
					});
			},
			searchPage(searchData) {

			},
			handleStoreSelected(selected) {
				this.$selectContent({
					mode: 'store',
					type: 'checkbox',
					data: this.storeData,
					getList: (data) => {
						this.storeData = data;
					}
				});
			},
			handleStoreClose(data) {
				this.storeData = data;
			},
			handleSelect() {
				this.$selectContent({
					mode: 'cloud-goods',
					type: 'checkbox',
					data: this.tableData,
					getList: (data) => {
						data = data.filter(item => !this.cacheData.includes(item.goods_id))
						this.tableData = this.tableData.concat(...data.map(item => {
							this.cacheData.push(item.goods_id);
							return {
								id: item.goods_id,
								name: item.goods_name,
								goods_img: item.goods_img,
								goods_name: item.goods_name,
								goods_sn: item.goods_sn,
								sale: '0',
								type: '1',
								time: [],
								product_sn: item.get_products.map(c => c.product_sn),
								market_price: item.get_products.map(c => c.market_price),
								product_ids: item.get_products.map(c => c.product_id),
								sale_price: item.get_products.map(_ => ({
									value: 0
								})),
								on_sale: item.get_products.map(_ => ({
									value: '0'
								}))
							}
						}));
					}
				})
			},
			handleData(value, type, index, i) {
				switch( type ){
					case 'sale':
						this.tableData[index][type] = value;
						for(let si in this.tableData[index]['on_sale'] ){
							this.$set(this.tableData[index]['on_sale'], si, {value:value} );
						}
						break;

					case 'on_sale':
						this.tableData[index][type][i].value = value;
						if( this.tableData[index]['sale'].value != value && value == '1'){
							this.$set( this.tableData[index], 'sale', '1' );
						}
						else if( value == '0'){
							let newItem = [];
							newItem = this.tableData[index]['on_sale'].filter( (item) => {
								return item.value == '1' ? true : false;
							});
							newItem.length == 0 ? this.$set( this.tableData[index], 'sale', '0' ) : '';
						}
						break;
					
					case 'sale_price':
						this.tableData[index][type][i].value = value;
						break;
							
					default:
						this.tableData[index][type] = value;
				}
			},
			toggleChange(row) {
				return this.$ajax.post(this.$api.distributionStatus, {
						id: row.id,
						show_type: '1',
						enable: row.enable == 1 ? 0 : 1
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.loadData();
						}
					});
			},
			handleEnableChange(row) {
				return new Promise((resolve, reject) => {
					this.toggleChange(row);
					reject();
				})
			},
			handleExec(v) {
				console.log(v);
				console.log(this.execTime)
			},
			handleImport() {
				this.$refs.batchImport.openModal({
					upload: true,
					download: true
				}, this.$api.ShopPushImport, this.$api.ShopPushDown);
			},
			onImportSuccess(res) {
				console.log(res)
				let {
					items
				} = res;
				let data = items.map(item => {
					let res = {
						id: item.goods_id,
						name: item.goods_name,
						goods_img: item.goods_thumb,
						goods_name: item.goods_name,
						goods_sn: item.goods_sn,
						sale: item.is_on_sale,
						type: item.sale_type,
						time: [ 
							( typeof(item.stime) == 'String' ? item.stime : '' ), 
							( typeof(item.etime) == 'String' ? item.etime : ''),
						],
						product_sn: [],
						market_price: [],
						product_ids: [],
						sale_price: [],
						on_sale: []
					};
					
					item.goods_data.forEach( (item2) => {
						res.product_sn.push( item2.product_sn );
						res.market_price.push( item2.market_price );
						res.product_ids.push( item2.product_id );
						
						// 下面两个用公共的
						res.sale_price.push( {value: item.sale_price} );
						res.on_sale.push( {value: item.product_is_on_sale} );
					});
					console.log( res );
					return res;
				});
				
				this.tableData = this.tableData.concat(data);
			},
			confirm() {
				this.$refs['formValidate'].validate((valid) => {
				    if (valid) {
						if (this.tableData.length === 0) {
							this.$Message.error('请选择商品!');
							return;
						} else if (this.storeData.length === 0) {
							this.$Message.error('请选择店铺!');
							return;
						} else if (this.execTimeType === -1) {
							this.$Message.error('请选择执行时间类型!');
							return;
						} else if (this.execTimeType == 1 && !this.execTime) {
							this.$Message.error('请选择执行时间!');
							return;
						}
						this.spinShow = true;
						return this.$ajax.post(this.$api.ShopPushAdd, {
								"task_name": this.formItem.taskName,
								"exec_time_type": this.execTimeType,
								"plan_exec_time": this.execTime,
								"store_ids": this.storeData.map(item => item.id).join(),
								"goods_data": this.tableData.map(item => {
									let temp = [];
									item.product_ids.forEach(c => {
										temp.push({
											product_id: c
										});
									});
									item.sale_price.forEach((c, index) => {
										temp[index].sale_price = c.value;
									});
									item.on_sale.forEach((c, index) => {
										temp[index].product_is_on_sale = c.value;
									});
									return {
										sale_type: item.type,
										stime: item.time[0] || '',
										etime: item.time[1] || '',
										is_on_sale: item.sale,
										goods_id: item.id,
										product_data: temp
									}
								})
							})
							.then(response => {
								this.spinShow = false;
								const res = response.data;
								if (res.code) {
									this.$router.go(-1);
								}
							});
					}
				});
			},
			delGoods( index ){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.tableData, index);
					},
				});
			}
		},
		created() {
			if (this.id) {
				this.disabled = true;
				this.loadData();
			}
		}
	}
</script>
<style lang="less" scoped>
	.goods_push_form {
		.edit_item {
			list-style: none;
			margin-bottom: 10px;
		}
	}
</style>
