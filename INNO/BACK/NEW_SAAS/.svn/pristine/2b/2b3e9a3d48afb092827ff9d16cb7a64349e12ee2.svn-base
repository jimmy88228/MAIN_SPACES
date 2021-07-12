<template>
	<div class="store-list">
		<Row type="flex">
			<Col style="flex:1 1 0%;">
				<SearchForm :type="type" :area-list="areaList" :agent-list="agentList" @on-search="searchPage"></SearchForm>
			</Col>
			<Col style="width:450px;text-align: right;">
				<template v-if="type != 1">
					<Button type="success" icon="md-add" @click="createStore">新增店铺</Button>
					<Button type="info" @click="handleImport">导入店铺</Button>
					<Button type="primary" @click="handleEdit">批量修改店铺</Button>
					<Button type="warning" :loading="exportLoading" @click="handleExport">导出</Button>
				</template>
				<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>

		<Table ref="myTable" :loading="tableLoading" :columns="columnsData" :height="tableFixedHeight" :data="proxyData"
		 @on-sort-change="sortData" @on-selection-change="getSelectGoods" @on-select-all="handleSelectAll"></Table>
		<div v-show="pageTotal" class="list_page list_page_fixed">
			<div v-if="type != 1" class="btn_group">
				<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
				<ButtonGroup>
					<Button @click="handleQrcode('click')">批量下载二维码</Button>
					<Button @click="delStoreMore">批量关闭店铺</Button>
					<Button v-show="type != 1" @click="handleQrcode('search')">搜索下载二维码</Button>
				</ButtonGroup>
			</div>
			<div v-else></div>
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" 
			@on-change="changePage"
			@on-page-size-change="handlePageSize" 
			show-elevator show-total show-sizer></Page>
		</div>

		<BatchImport ref="batchImport" :download-pay-load="storeTypeImport" @on-success="onImportSuccess"></BatchImport>
		<BatchImport ref="batchImport2" :download-pay-load="storeTypeEdit" @on-success="onImportSuccess"></BatchImport>
		
		<!--选择微页面-->
		<goodsPageSelect ref="page-select" @on-ok="onPagesSelect"></goodsPageSelect>
		
		<Spin size="large" fix v-show="spinShow"></Spin>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import config from '@/config/index';
	import PageHelper from '@/libs/page-helper.js';
	import Conf from '@/config/index';
	import goodsPageSelect from '@/views/my-components/goods-page-select/goods-page-select';
	
	export default {
		props: {
			type: {
				type: [String, Number],
				required: true
			}
		},
		components: {
			SearchForm,
			BatchImport,
			goodsPageSelect,
		},
		data() {
			return {
				currPage: 1,
				canCreate: {},
				canHomePage: false,
				exportLoading: false,
				condition: {
					area: 0,
					agent_id: 0,
					is_default: 0,
					self_get: 0,
					search: '',
					type: 1
				},
				areaList: [],
				agentList: [],
				columns: [],
				columnsData: [],
				spinShow: false,
				isCheckAll: false,
				selectStore: [],
				currEditIndex: 0,
				proxyData: [],
				tableFixedHeight: 550,
				applet: [], //appId列表
				appId: 0, //选中的appId
				storeTypeImport: {
					type: 'storeImport'
				},
				storeTypeEdit: {
					type: 'chang'
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			createStore() {
				this.$router.push({
					name: 'store-add'
				});
			},
			loadData(page, data={}) {
				this.tableLoading = true;
				let params = Object.assign({}, data, this.condition, {
					isInit: this.type == 1 ? 3 : 1,
					is_trash: this.type,
					page: page,
				});
				return this.$ajax.post(this.$api.storeList, params)
					.then(response => {
						this.tableLoading = false;
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.columns = res.data && res.data.columns;
							this.canCreate = res.data && res.data.canCreate || {};
							this.areaList = res.data && res.data.address;
							this.agentList = res.data && res.data.agent;
							this.proxyData = JSON.parse(JSON.stringify(this.tableData));
							this.applet = res.data && res.data.applet;
							this.canHomePage = res.data.canHomePage;
						
							if (this.type == 0 && !Boolean(res.data && res.data.bind_store)) {
								this.$Modal.error({
									title: '默认店铺提示',
									content: '该系统暂未设置默认绑定店铺，请及时添加！'
								});
							}
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			sortData(value) {
				const {
					key,
					order
				} = value;
				this.tableLoading = true;
				return this.$ajax.post(this.$api.storeList, {
						page: 1,
						isInit: this.type == 1 ? 3 : 1,
						is_trash: this.type,
						sortColumn: key,
						sortVal: order,
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							this.data = res.data;
							this.currentPage = 1;
							this.tableLoading = false;
						}
					});
			},
			// 批量删除店铺
			delStoreMore() {
				if (this.selectStore.length === 0) {
					this.$Message.error('请勾选店铺');
					return false;
				}
				this.removeStore(this.selectStore.map(item => item.id), 'remove');
			},
			removeStore(value, type) {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定${type === 'remove' ? '关闭' : '启用'}店铺吗`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.spinShow = true;
						return this.$ajax.post(this.$api.storeRemove, {
								// 数组代表批量
								store_ids: typeof value === 'object' ? value : [value],
								cancel: type === 'remove' ? 'Y' : 'N'
							})
							.then((response) => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.spinShow = false;
									this.selectStore = [];
									this.loadData();
								}
							});
					}
				});
			},
			handleQrcode(type) {
				if (this.selectStore.length === 0 && type === 'click') {
					this.$Message.error('请勾选店铺');
					return false;
				}
				this.spinShow = true;
				const params = type === 'click' ? {
					store_ids: this.selectStore.map(item => item.id)
				} : this.condition;
				return this.$ajax.post(this.$api.storeCodeDown, {
						// click代表下载勾选的, search代表下载搜索的
						downloadType: type,
						...params
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.selectStore = [];
							const a = document.createElement('a'); // 创建a标签
							a.href = Conf.DOWNLOAD_URL + response.data.downloadUrl;
							a.download = '二维码'; // 下载的文件名
							a.id = 'downloadAction';
							document.body.append(a);

							// 给创建的a标签绑定点击事件下载
							const downloadAction = document.getElementById('downloadAction');
							downloadAction.click();
							downloadAction.remove();
						}
						this.spinShow = false;
					});
			},
			setDefaultStore(storeId) {
				this.$Modal.confirm({
					title: '店铺设置',
					content: `确认修改默认店铺吗？修改后会对用户注册默认绑定店铺有影响。点击‘确定’继续该操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.tableLoading = true;
						return this.$ajax.post(this.$api.storeChange, {
								store_id: storeId
							})
							.then((response) => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.tableLoading = false;
									this.loadData();
								}
							});
					}
				});
			},
			setHomePage( index, row ){
				this.currEditIndex = index;
				this.$refs['page-select'].openModal([], 'radio');
			},
			// 选中主页后的回调
			onPagesSelect( obj ){
				this.tableLoading = true;
				
				// ajax 保存设置
				this.$ajax.post( this.$api.storeHomePageEdit,{
					'store_id': this.proxyData[ this.currEditIndex ].id,
					'page_id' : obj[0].id,
					'page_name': obj[0].name,
				})
				.then((response) => {
					this.tableLoading = false;
					const res = response.data;
					if (res.code) {
						this.$set( this.proxyData[ this.currEditIndex ], 'home_page_id', obj[0].id );
						this.$set( this.proxyData[ this.currEditIndex ], 'home_page_name', obj[0].name );
					}
				});
				
			},
			handleImport() {
				this.$refs.batchImport.openModal(this.canCreate.storeImport, this.$api.storeImport, this.$api.storeDownload);
			},
			handleEdit() {
				this.$refs.batchImport2.openModal(this.canCreate.BatchModification, this.$api.storeBatchModification, this.$api.storeDownload);
			},
			onImportSuccess() {
				this.loadData();
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行导出操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.exportLoading = true;
						// tips: 如果搜索所有的数据，不能带参数
						return this.$ajax.post(this.$api.storeExplode, this.condition)
							.then((response) => {
								const res = response.data;
								this.$refs.myTable.exportCsv({
									filename: '店铺数据',
									columns: res.data.columns,
									data: res.data.items
								});
								this.exportLoading = false;
							});
					}
				});
			},
			handleWeixin( row ) {
				this.spinShow = true;
				return this.$ajax.post(this.$api.storeWeixinQrcode, {
						store_id: row.id
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.$Modal.info({
								title: '微信二维码',
								render: (h) => {
									return h('div',{
										style:{
											textAlign: 'center'
										}
									},[
										h('img',{
											attrs:{
												src: res.data.qrcode_path
											},
											style:{
												width: '220px',
												'object-fit': 'contain',
											}
										}),
										h('div',{
											style:{
												textAlign: 'center'
											}
										}, row.name ),
										h('div',{
											style:{
												textAlign: 'center'
											}
										}, row.code ),
									]);
								}
							});
						}
						this.spinShow = false;
					});
			},
			// 选中小程序后的回调
			onQrcodeOk( row, appletName ) {
				this.spinShow = true;
				this.$ajax.post(this.$api.appletQrcode, {
						store_id: row.id ,
						appid: this.appId
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.$Modal.info({
								title: '小程序二维码',
								render: (h) => {
									return h('div',{
										style:{
											textAlign: 'center'
										}
									},[
										h('img',{
											attrs:{
												src:res.data.data
											},
											style:{
												width: '220px',
												'object-fit': 'contain',
											}
										}),
										h('div',{
											style:{
												textAlign: 'center'
											}
										}, row.name ),
										h('div',{
											style:{
												textAlign: 'center'
											}
										}, row.code ),
										h('div', {
											style:{
												textAlign: 'center'
											}
										}, '小程序：'+appletName )
									]);
								}
							});
						}
						this.spinShow = false;
					});
			},
			// 小程序二维码的弹确认框
			handleAppletQrcode( row ) {
				const Select = 'Select';
				const Option = 'Option';
				const optionItems = [];
				const _this = this;
				this.appId = 0;
				let isRender = false;
				
				this.$Modal.confirm({
					title: '请选择小程序',
					render: (h) => {
						if( isRender == false ){
							isRender = true;
							this.applet.forEach( ( item )=>{
								optionItems.push(
									h('Option', {
										props: {
											value: item.appid,
										},
									}, item.cfg_remark )
								);
							});
						}
						
						return h('div',{
							style:{
								
							}
						},[
							h('Select',{
								on:{
									'on-change': ( val )=>{
										_this.appId = val;
									},
								}
							}, optionItems )
						]);
						
					},
					onOk: ()=>{
						let appletName = '';
						this.applet.forEach( ( item )=>{
							if( item.appid == this.appId ){
								appletName = item.cfg_remark;
							}
						});
						
						_this.onQrcodeOk(row, appletName );
					}
				});
			},
			handleCheck() {
				this.proxyData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.proxyData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectStore = [...this.proxyData].filter(item => item._checked);
			},
			getSelectGoods(selection) {
				this.selectStore = selection;
				let allLen = this.proxyData.length;
				this.isCheckAll = allLen > 0 && allLen === selection.length;
				const hasSelected = this.selectStore.map(item => item.id);
				this.proxyData.forEach((item, index) => {
					this.$set(this.proxyData[index], '_checked', hasSelected.includes(item.id));
				});
			},
			handleSelectAll() {
				this.isCheckAll = true;
			}
		},
		mounted() {
			this.tableFixedHeight = document.body.clientHeight - 260;
		}
	}
</script>

<style lang="less" scoped>
	.store-list {
		.btn_group {
			flex-shrink: 0;
			margin-left: 8px;
		}

		.store-list_import,
		.store-list_export {
			margin-right: 10px;
		}

		.store-list_page {
			margin: 10px 10px 0 10px;
			overflow: hidden;
			text-align: right;
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
