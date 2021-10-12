<template>
	<Card class="goods-list">
		<searchForm @on-search="searchPage" :cat-list="catList" >
			<div slot="btns">
				<div class="flex">
					<Button type="primary" v-if="canCreate && canCreate.export" @click="handleExport">导出</Button>&nbsp;
					<Button type="info" v-if="canCreate && canCreate.import" @click="handleImport">导入</Button>&nbsp;
					<Button type="warning" v-if="canCreate && canCreate.sync" @click="handleSync">同步</Button>&nbsp;
					<Button type="success" v-if="canCreate && canCreate.add" @click="handleAdd"><Icon type="ios-add" />添加</Button>&nbsp;
					<Button type="error" v-if="canCreate && canCreate.init" @click="handleInit">接口初始化</Button>
				</div>
			</div>
		</searchForm>
		<Table
			:columns="columns"
			:data="tableData"
			:loading="tableLoading"
			:height="tableHeight"
			@on-select="onSelectData"
			@on-select-all="onSelectAll"
			@on-select-cancel="onSelectCancelData"
			@on-select-all-cancel="onSelectAllCancel"
			ref="myTable">
			<template slot-scope="{ row }" slot="goods_thumb2">
				<div class="img_list_wrap">
					<div class="img_fixed">
					<img :src="row.goods_thumb2" v-if="row.goods_thumb2" :alt="row.goods_thumb2" v-viewer/>
					<img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else />
					</div>
				</div>
			</template>
			<template slot-scope="{ row }" slot="name">
				<p style="color:rgb(10,11,251);font-size:14px;">{{row.goods_name}}</p>
				<p style="font-size:14px;">货号:{{row.goods_sn}}</p>
				<p style="font-size:14px;">分类:{{row.cat_name}}</p>
				<p style="font-size:14px;">视频号状态:
					<span v-if="row.sale_status_str=='上架'" style="color:#498de6;">{{row.sale_status_str}}</span>
					<span v-if="row.sale_status_str=='下架' || row.sale_status_str=='未同步'" style="color:red;">{{row.sale_status_str}}</span>
					</p>
			</template>
			<template slot-scope="{ row }" slot="price">
				<p style="font-size:14px;">吊牌价:<span style="text-decoration:line-through">{{row.market_price}}</span></p>
				<p style="font-size:14px;">售卖价:{{row.price}}</p>
			</template>
			<template slot-scope="{ row }" slot="handle">
				<span v-show="row.handle.price" @click="editGoods(row)"><a>价格</a></span>
				<Divider type="vertical" v-show="row.handle.price && row.handle.on"/>
				<span v-show="row.handle.on" @click="editSale(row,1)"><a>上架</a></span>
				<Divider type="vertical" v-show="row.handle.on && row.handle.off"/>
				<span v-show="row.handle.off" @click="editSale(row,0)"><a>下架</a></span>
				<Divider type="vertical" v-show="row.handle.off && row.handle.remove"/>
				<span v-show="row.handle.remove" @click="removeGoods(row)"><a>移除</a></span>
			</template>
		</Table>
		<div v-show="pageTotal" class="list_page list_page_fixed">
			<div class="btn_group">
				<ButtonGroup>
					<Button @click="handleBatch(1)">批量同步上架</Button>
					<Button @click="handleBatch(0)">批量同步下架</Button>
					<Button @click="handleBatch(2)">批量删除</Button>
				</ButtonGroup>
			</div>
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				@on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
		</div>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
		</div>

		<!--编辑-->
		<Modal
			v-model="isShowEdit"
			title="编辑商品"
			@on-ok="doEditGoods"
			:loading="loading"
			@on-cancel="cancelEditGoods">
				<Form ref="editData" :model="editData" :label-width="88" >
					<FormItem label="货号">
						<Input   v-model="editData.goods_sn" disabled></Input>
					</FormItem>
					<FormItem label="商品名称" prop='goods_name' :rules="[{ required: true, message: '商品名称不能为空', type: 'string', trigger: 'blur' }]">
						<Input   v-model="editData.goods_name" placeholder="请输入商品名称"></Input>
					</FormItem>
					<FormItem label="吊牌价">
						<Input   v-model="editData.market_price" disabled></Input>
						<p style="color:red;font-size:14px">*注：当商品有价格区间时，视频号仅显示商品最低价</p>
					</FormItem>
					<FormItem label="售卖价">
						<Input   v-model="editData.price" placeholder="请输入售卖价"></Input>
					</FormItem>
				</Form>
		</Modal>

		<!--接口初始化-->
		<Modal
			v-model="isShowInit"
			title="接口初始化"
			@on-ok="doInit"
			:loading="loading"
			@on-cancel="cancelInit">
				<Form ref="InitData" :model="InitData" :label-width="68" >
					<FormItem label="订单号" prop='order_sn' :rules="[{ required: true, message: '订单号不能为空', type: 'string', trigger: 'blur' }]">
						<Input   v-model="InitData.order_sn" placeholder="请输入订单号"></Input>
					</FormItem>
				</Form>
		</Modal>
		<!--导入-->
		<BatchImport ref="batchImport" @on-success="handleFinish"></BatchImport>
	</Card>

</template>

<script>
	import searchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		components: {
			searchForm,
			notice,
			BatchImport
		},
		data() {
			return {
				catList: [],
				searchData: {
					searchq: '',
					cat_id: 0,
					sale_state:'0',
					sync_state:'0',
					start_time: '',
					end_time: '',
					sync_start_time: '',
					sync_end_time: '',
				},
				jobIdCol: [],
				isShowEdit:false,
				editData:{
					id:0,
					goods_sn:'',
					goods_name:'',
					market_price:0,
					price:0,
				},
				canCreate:{},
				selectionIds:[],
				isShowInit:false,
				InitData:{
					order_sn:''
				},
				loading:true,
			}
		},
		mixins: [PageHelper,Mixin],
		methods: {
			onLoadData(page, data) {
				let params = {
					...this.searchData,
					...data
				}
				return this.$ajax.post(this.$api.videoNumberGoodsList, params)
					.then(response => {
						var res = response.data;
						if (res.code) {
							this.data = res.data || {};
							this.canCreate=res.data.canCreate || [];
							console.log('canCreate',this.canCreate);
						}
					});
			},
			loadExtraData() {
				this.$ajax.post(this.$api.catTree)
				.then((response) => {
					var res = response.data;
					if (res.code) {
						this.catList=res.data || [];
					}
				});
			},
			onSelectData(selection,row){
				this.selectionIds.push(row.id);
			},
			onSelectAll(selection){
				this.selectionIds=[];
				selection.forEach((item) => {
					this.selectionIds.push(item.id);
				});
			},
			onSelectCancelData(selection,row){
				this.selectionIds.splice(this.selectionIds.indexOf(row.id),1);
			},
			onSelectAllCancel(selection){
				this.selectionIds=[];
				selection.forEach((item) => {
					this.selectionIds.push(item.id);
				});
			},
			handleExport(){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.videoNumberGoodsExport, this.searchData).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
								this.jobIdCol.push(jobId);
								this.$nextTick(() => {
									this.$refs[`notice${jobId}`][0].showNotice(jobId);
								});
								this.$Message.success(res.message);
							} else {
								this.$Message.error(res.message);
							}
						});
					}
				});
			},
			handleFinish() {
				// 异步下载结束后刷新
				this.loadData();
			},
			searchPage(searchData){		
				this.searchData = searchData;
				this.loadData();
			},
			handleAdd(){
				this.$selectModule({
					mode: "video-number-goods",
					data:[],
					getList:(data)=>{
						//整理数据
						var goods_list = [];
						for (var i in data) {
							goods_list.push({
								goods_id:data[i].id,
								goods_name:data[i].goods_name,
								goods_sn:data[i].goods_sn,
								price:data[i].price,
							});
						}

						this.$store.commit('setLoading', true);
						let params={
							goods_list:goods_list
						}

						//添加数据
						return this.$ajax.post(this.$api.videoNumberGoodsAdd,params)
							.then(response => {
								var res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
								} else {
									this.$Message.error(res.message);
								}
							}).finally(()=>{
								this.loadData();
								this.$store.commit('setLoading', false);
							});
					}
				})
			},
			editGoods(row){
				this.editData={
					id:row.id,
					goods_sn:row.goods_sn,
					goods_name:row.goods_name,
					market_price:row.market_price,
					price:row.price,
				}
				this.isShowEdit=true;
			},
			doEditGoods(){
				//保存
				this.$refs['editData'].validate((valid) => {
                    if (valid) {
						return this.$ajax.post(this.$api.videoNumberGoodsPrice,this.editData)
							.then(response => {
								var res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
								} else {
									this.$Message.error(res.message);
								}
							}).finally(()=>{
								this.loadData();
								this.isShowEdit=false;
							});
					}
                });	
			},
			cancelEditGoods(){
				this.isShowEdit=false;
			},
			editSale(row,status){
				let params={
					id:row.id,
					status:status
				}
				return this.$ajax.post(this.$api.videoNumberGoodsState,params)
					.then(response => {
						var res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					}).finally(()=>{
						this.loadData();
					});
			},
			removeGoods(row){
				let params={
					id:row.id,
				}
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.videoNumberGoodsRemove,params)
					.then(response => {
						var res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					}).finally(()=>{
						this.loadData();
						this.$store.commit('setLoading', false);
					});	
			},
			handleSync(){
				if(this.selectionIds<1){
					this.$Message.error("请选择需要同步的商品！");
					return;
				}
				let params={
					ids:this.selectionIds,
				}
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.videoNumberGoodsSync,params)
					.then(response => {
						var res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					}).finally(()=>{
						this.loadData();
						this.$store.commit('setLoading', false);
					});			
				
			},
			handleInit(){
				this.isShowInit=true;
			},
			doInit(){
				this.$refs['InitData'].validate((valid) => {
                    if (valid) {
						return this.$ajax.post(this.$api.videoNumberGoodsInit,this.InitData)
							.then(response => {
								var res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
								} else {
									this.$Message.error(res.message);
								}
							}).finally(()=>{
								this.loadData();
								this.isShowInit=false;
							});	
                    }
                });	
			},
			cancelInit(){
				this.isShowInit=false;		
			},
			handleImport(){
				this.$refs['batchImport'].openModal({
						upload: true,
						download: true
					}, this.$api.videoNumberGoodsImport, this.$api.videoNumberGoodsTpl);
			},
			handleBatch(row){
				if(this.selectionIds<1){
					this.$Message.error("请勾选要设置的商品数据！");
					return;
				}
				let params={
					ids:this.selectionIds,
					status:row,
				}
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.videoNumberGoodsBatch,params)
					.then(response => {
						var res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					}).finally(()=>{
						this.loadData();
						this.$store.commit('setLoading', false);
					});	
			}
		},
		mounted() {
			this.loadExtraData();
			this.loadData();
		}
	}
</script>

<style lang="less">
	.goods-list {
		.btn_group {
			flex-shrink: 0;
			margin-left: 8px;
		}

		.btn-group {
			text-align: right;
		}

		.list_page_fixed {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
