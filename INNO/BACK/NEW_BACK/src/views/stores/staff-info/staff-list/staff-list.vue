<template>
	<div class="staff-list">
		<div>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm :area-list="areaList" :storeId="storeId" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:460px;text-align: right;">
					<Button type="success" icon="md-add" @click="createStaff">新增店员</Button>
					<Button type="info" @click="handleImport">批量导入店员</Button>
					<Button type="primary" @click="handleStaffStatus">导入店员状态</Button>
					<Button type="warning" :loading="exportLoading" @click="handleExport">导出</Button>
					<Button icon="md-refresh" @click="onLoadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"
			 @on-selection-change="getSelectGoods" @on-select-all="handleSelectAll">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.real_portrait_path" v-if="row.real_portrait_path" :alt="row.staff_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.staff_name" v-viewer v-else/>
						</div>
						<span class="name">{{row.staff_name}}</span>
					</div>
				</template>
				<template slot-scope="{ row }" slot="status_str">
					<Tag :color="row.status == 0 ? 'success' : 'error'">{{row.status == 0 ? '在职' : '离职'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="isEnabled">
					<Tag type="dot" :color="row.is_enabled == 1 ? 'success' : 'error'">{{row.is_enabled == 1 ? '开启' : '关闭'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="editStaff(row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.weixin" />
					<span v-show="row.handle.weixin" @click="handleWeixin(row)"><a>微信二维码</a></span>
					<Divider type="vertical" v-show="row.handle.applet && row.handle.weixin" />
					<span v-show="row.handle.applet" @click="handleAppletQrcode(row)"><a>小程序二维码</a></span>
					<Divider type="vertical" v-show="row.handle.applet && row.handle.weixin && row.handle.trash" />
					<span v-show="row.handle.trash" @click="handleTrash(row)"><a>回收站</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page list_page_fixed">
				<div class="btn_group">
					<Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
					<ButtonGroup>
						<Button @click="handleCreateQrcode('click')">生成批量二维码</Button>
						<Button @click="handleQrcode('click')">批量下载二维码</Button>
						<Button @click="handleBinding">批量绑定</Button>
						<Button @click="handleQrcode('search')">搜索下载二维码</Button>
						<Button @click="handleBatchTrash">批量回收站</Button>
					</ButtonGroup>
				</div>
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</div>
		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
		<Spin size="large" fix v-show="spinShow"></Spin>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import PageHelper from '@/libs/page-helper.js';

	export default {
		components: {
			SearchForm,
			BatchImport
		},
		data() {
			return {
				canCreate: {},
				exportLoading: false,
				condition: {
					area: 0,
					store_id: 0,
					related_user: 0,
					status: 0,
					dstb_staff: 0,
					search: '',
					search_type: 1
				},
				areaList: [],
				selectStaff: [],
				isCheckAll: false,
				applet: [], //appId列表
				appId: 0, //选中的appId
				storeId:this.$route.query.store_id || 0,
				spinShow:false
			}
		},
		mixins: [Mixin, PageHelper],
		mounted() {
			// 动态计算表高度
			setTimeout(()=>{
				this.tableHeight = document.body.clientHeight - 250;
			},3000);
		},
		methods: {
			onLoadData(page, data) {
				this.tableLoading = true;

				let params = Object.assign({}, data, this.condition, {
					isInit: 1
				});
				return this.$ajax.post(this.$api.staffList, params)
					.then(response => {
						this.tableLoading = false;
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.areaList = res.data && res.data.address;
							this.agentList = res.data && res.data.agent;
							this.canCreate = res.data && res.data.canCreate;
							this.applet = res.data && res.data.applet;
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			handleImport() {
				this.$refs.batchImport.openModal(this.canCreate.staffImport, this.$api.staffImport, this.$api.staffDownload);
			},
			handleStaffStatus() {
				this.$refs.batchImport.openModal(this.canCreate.staffImport, this.$api.changeStaffType, this.$api.changeStaffTypeDownload);
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
						return this.$ajax.post(this.$api.explodeStaff, this.condition)
							.then((response) => {
								const res = response.data;
								this.$refs.myTable.exportCsv({
									filename: '店员数据',
									columns: res.data.columns,
									data: res.data.items
								});
								this.exportLoading = false;
							});
					}
				});
			},
			onImportSuccess() {
				this.loadData();
			},
			createStaff() {
				this.$router.push({
					name: 'staff-create'
				});
			},
			editStaff(row) {
				this.$router.push({
					name: 'staff-edit',
					params: {
						id: row.staff_id
					}
				});
			},
			handleCheck() {
				this.tableData.forEach((item, index) => {
					if ('_checked' in item) {
						item._checked = this.isCheckAll;
					} else {
						this.$set(this.tableData[index], '_checked', this.isCheckAll);
					}
				});
				this.selectStaff = [...this.tableData].filter(item => item._checked);
			},
			getSelectGoods(selection) {
				this.selectStaff = selection;
				let allLen = this.tableData.length;
				this.isCheckAll = allLen > 0 && allLen === selection.length;
				const hasSelected = this.selectStaff.map(item => item.staff_id);
				this.tableData.forEach((item, index) => {
					this.$set(this.tableData[index], '_checked', hasSelected.includes(item.staff_id));
				});
			},
			handleSelectAll() {
				this.isCheckAll = true;
			},
			handleQrcode(type) {
				if (this.selectStaff.length === 0 && type === 'click') {
					this.$Message.error('请勾选店员');
					return false;
				}
				this.$store.commit('setLoading', true);
				const params = type === 'click' ? {
					staff_ids: this.selectStaff.map(item => item.staff_id)
				} : this.condition;
				return this.$ajax.post(this.$api.staffCodeDown, {
						// click代表下载勾选的, search代表下载搜索的
						downloadType: type,
						...params
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.selectStaff = [];
							const a = document.createElement('a'); // 创建a标签
							a.href = res.data.downloadUrl;
							a.download = '二维码'; // 下载的文件名
							a.id = 'downloadAction';
							document.body.append(a);

							// 给创建的a标签绑定点击事件下载
							const downloadAction = document.getElementById('downloadAction');
							downloadAction.click();
							downloadAction.remove();
						}
					}).finally(()=>{
						this.$store.commit('setLoading', false);
					})
			},
			handleCreateQrcode(){
				if (this.selectStaff.length === 0) {
					this.$Message.error('请勾选店员');
					return false;
				}
				console.log(this.selectStaff);
				let store_staff = [];
				for(let i = 0; i < this.selectStaff.length; i++){
					store_staff.push({
						store_id: this.selectStaff[i].store_id,
						req_id: this.selectStaff[i].staff_id,
						dstb_satff_code: this.selectStaff[i].staff_code
					})
				}
				return this.$ajax.post(this.$api.createStaffCode, {store_staff}).then((response)=>{
					console.log("response", response);
					let res = response.data || [];
					 if(res.code){
						 let success_num = res.success_num || 0;
						 this.$Message.success('批量生成二维码！');
						 this.loadData();
					 }
				})
				
			},
			handleBatchTrash() {
				if (this.selectStaff.length === 0) {
					this.$Message.error('请勾选店员');
					return false;
				}
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.staffTrashAction, {
						staff_ids: this.selectStaff.map(item => item.staff_id),
						is_delete_staff: 1
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							
							this.selectStaff = [];
							
						}
						return this.loadData();
					}).finally(()=>{
						this.$store.commit('setLoading', false);
					})
			},
			handleTrash(row) {
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.staffTrashAction, {
						staff_ids: [row.staff_id],
						is_delete_staff: 1
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
						}
						return this.loadData();
					}).finally(()=>{
						this.$store.commit('setLoading', false);
					})
			},
			handleBinding() {
				if (this.selectStaff.length === 0) {
					this.$Message.error('请勾选店员');
					return false;
				}
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.staffBatchBuild, {
						staff_ids: this.selectStaff.map(item => item.staff_id)
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.selectStaff = [];
						}
					}).finally(()=>{
						this.$store.commit('setLoading', false);
					})
			},
			handleWeixin(row) {
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.staffWeixinQrcode, {
						store_id: row.store_id,
						staff_id: row.staff_id
					})
					.then((response) => {
						const res = response.data;
						if (res.code) {
							this.$Message.success(res.message);
							this.$Modal.confirm({
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
					}).finally(()=>{
						this.$store.commit('setLoading', false);
					})
			},
			// // 选中小程序后的回调
			// onQrcodeOk( row, appletName ) {
			// 	this.$store.commit('setLoading', true);
			// 	this.$ajax.post(this.$api.appletQrcode, {
			// 			store_id: row.store_id,
			// 			staff_id: row.staff_id,
			// 			staff_code: row.staff_code,
			// 			appid: this.appId
			// 		})
			// 		.then((response) => {
			// 			const res = response.data;
			// 			if (res.code) {
			// 				this.$Message.success(res.message);
			// 				this.$Modal.info({
			// 					title: '小程序二维码',
			// 					render: (h) => {
			// 						return h('div',{
			// 							style:{
			// 								textAlign: 'center'
			// 							}
			// 						},[
			// 							h('img',{
			// 								attrs:{
			// 									src:res.data.data
			// 								},
			// 								style:{
			// 									width: '220px',
			// 									'object-fit': 'contain',
			// 								}
			// 							}),
			// 							h('div',{
			// 								style:{
			// 									textAlign: 'center'
			// 								}
			// 							}, row.name ),
			// 							h('div',{
			// 								style:{
			// 									textAlign: 'center'
			// 								}
			// 							}, row.code ),
			// 							h('div', {
			// 								style:{
			// 									textAlign: 'center'
			// 								}
			// 							}, '小程序：'+appletName )
			// 						]);
			// 					}
			// 				});
			// 			}
			// 			this.spinShow = false;
			// 		});
			// },
			// 小程序二维码的弹确认框
			handleAppletQrcode( row ) {
				this.$UIModule({
					mode: "code-view",
					props: {
						title: "选择小程序",
						codeTitle: "店员小程序二维码",
						codeTip: '<p>店员名称：' + row.name +'</p><p>店员code：' + row.code +'</p>'
					},
					options: {
						path: "pages/micro_mall/index/index",
						params: {
							store_id: row.store_id,
							staff_id: row.staff_id,
							staff_code: row.staff_code,
						}
					}
				})
				// return;
				// const Select = 'Select';
				// const Option = 'Option';
				// const optionItems = [];
				// const _this = this;
				// this.appId = 0;
				// let isRender = false;
				
				// this.$Modal.confirm({
				// 	title: '请选择小程序',
				// 	render: (h) => {
				// 		if( isRender == false ){
				// 			isRender = true;
				// 			this.applet.forEach( ( item )=>{
				// 				optionItems.push(
				// 					h('Option', {
				// 						props: {
				// 							value: item.appid,
				// 						},
				// 					}, item.cfg_remark )
				// 				);
				// 			});
				// 		}
				// 		return h('div',{},[
				// 			h('Select',{
				// 				on:{
				// 					'on-change': ( val )=>{
				// 						_this.appId = val;
				// 					},
				// 				}
				// 			}, optionItems )
				// 		]);
						
				// 	},
				// 	onOk: ()=>{
				// 		let appletName = '';
				// 		this.applet.forEach( ( item )=>{
				// 			if( item.appid == this.appId ){
				// 				appletName = item.cfg_remark;
				// 			}
				// 		});
						
				// 		_this.onQrcodeOk(row, appletName );
				// 	}
				// });
			},
		},
	}
</script>
<style lang="less" scoped>
	.staff-list {
		.btn_group {
			flex-shrink: 0;
			margin-left: 12px;
		}

		.staff-list_import,
		.staff-list_export {
			margin-right: 10px;
		}

		.staff-list_page {
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
