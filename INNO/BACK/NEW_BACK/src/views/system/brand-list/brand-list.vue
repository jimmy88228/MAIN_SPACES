<style lang="less">
.brand-list{
	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
			right:50px;
	    }
	}
}
</style>

<template>
	<div class="brand-list">
		<Card v-show="showList">
			<div class="table-topbar">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
					<Form ref="formSearch" :model="formSearch" inline>
						<FormItem>
							<Select v-model="formSearch.status" placeholder="品牌状态" style="width:130px" clearable>
								<Option :value="-1">所有状态</Option>
								<Option v-for="(item, key) in brandStatusList" :value="key" :key="key">{{ item }}</Option>
							</Select>
						</FormItem>
						<FormItem>
							<Input v-model="formSearch.searchq" style="width:250px;" placeholder="用户名/昵称/手机号 模糊查询" clearable search
							 enter-button @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage"></Input>
						</FormItem>
					</Form>
					</Col>
					<Col style="width:180px;text-align: right;">
						<Button v-if="canCreate" icon="md-add" type="info" @click="createBrand">创建品牌商户</Button>
						<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				</div>
			</div>
		</Card>

		<!--品牌详情组件-->
		<brandForm ref="brand-form" @on-close="closeUserForm" @on-save="saveUserForm"></brandForm>

		<!--品牌参数设置-->
		<brandSetting ref="brand-setting" @on-close="closeUserForm"></brandSetting>

		<!--品牌组件授权-->
		<brandPlugins ref="brand-plugins"></brandPlugins>
		
		<!--创建品牌商-->
		<brandAddForm ref="brand-add-form" @on-close="closeUserForm" @on-success="onCreateSuccess"></brandAddForm>

		<!--品牌权限微调-->
		<brandExtraAction ref="brand-extra-action" @on-close="closeUserForm"></brandExtraAction>
	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import brandForm from './brand-form';
	import brandPlugins from './brand-plugins';
	import brandSetting from './brand-setting';
	import brandAddForm from './brand-add-form';
	import brandExtraAction from './brand-extra-action';
	
	export default {
		components: {
			brandForm,
			brandPlugins,
			brandSetting,
			brandAddForm,
			brandExtraAction,
		},
		data() {
			return {
				// 列表
				columns: [],
				data: [],
				brandStatusList: [],

				tableHeight: 500,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 20,

				// 搜索表单
				formSearch: {
					searchq: ''
				},

				showList: true,
				canCreate: false,
				
				// 插件组
				pluginsGroup: [],
			};
		},
		methods: {
			// 初始化方法
			init( cbBrandId = 0  ) {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 210;

				this.tableLoading = true;
				// ajax 请求获取初始化数据
				util.ajax.post(util.apiUrl.brandList, {
						isInit: 1
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							
							this.initColumn( res );
							
							// 初始化表数据
							this.data = res.data.items;
							this.pluginsGroup = res.data.pluginsGroup;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
							this.canCreate = res.data.canCreate;
							this.brandStatusList = res.data.brandStatusList;
							
							if( cbBrandId > 0 ){
								for(let i in this.data){
									if( this.data[i].id == cbBrandId ){
										// 创建品牌成功后，回调编辑这个品牌
										this.editItem(i, this.data[i] );
										break;
									}
								}
							}
						}
					});
			},
			initColumn( res ){
				this.columns = res.data.columns;
				
				// 头像
				this.columns[1].render = (h, params) => {
					return h('Row', {
						props: {
							type: "flex",
							justify: "start",
						}
					}, [
						h('Col', {
								style: {
									padding: '5px 5px 5px 0',
								}
							},
							[h('Avatar', {
								props: {
									src: params.row.logo_format,
									icon: 'md-image',
									size: 55,
									shape: 'square'
								},
								style: {
									marginTop: '10px',
									marginBottom: '10px'
								}
							})
							]),
						h('Col', {
								style: {
									padding: '10px 0 10px 4px',
									flex: '1 1 0%',
								}
							},
							[
								h('div', {
									style: {
										lineHeight:2
									}
								}, params.row.brand_name ),
								
								h('div', {
									style: {
										lineHeight:1.5
									}
								}, params.row.brand_name_en ),
							]),
					]);
				};
				
				// 联系方式
				this.columns[(this.columns.length - 5)].render = (h, params) => {
					return h('div', [
						h('div', {
							style: {
				
							}
						}, params.row.linkman),
						h('div', {
							style: {
				
							}
						}, params.row.tel),
						h('div', {
							style: {
				
							}
						}, params.row.mobile)
					]);
				};
				
				// 权限组
				this.columns[(this.columns.length - 4)]['render'] = (h, params) => {
					var tags = [];
					const groups = params.row.groups;
				
					for (var i in groups) {
						tags.push(
							h('Tag', {
								props: {
									color: 'blue'
								}
							}, groups[i])
						);
					}
					return h('span', tags);
				};
				
				// 状态标识
				this.columns[(this.columns.length - 2)].render = (h, params) => {
					const row = params.row;
					var color = '';
				
					switch (Number(row.status)) {
						case 0:
							color = 'default';
							break;
						case 1:
							color = 'success';
							break;
						case 2:
							color = 'error';
							break;
						case 3:
							color = 'error';
							break;
					}
				
					return h('Tag', {
						props: {
							type: 'dot',
							color: color
						}
					}, row.status_text);
				};
				
				// 操作按钮
				this.columns[(this.columns.length - 1)].render = (h, params) => {
					var buttons = [];
					if (params.row.handle.edit) {
						// 编辑按钮
						buttons.push(h('span', {
							class: 'table-handle-button',
							on: {
								click: () => {
									this.editItem(params.index, params.row)
								}
							}
						}, '编辑'));
						
						// 权限微调按钮
						buttons.push( 
							h('span', {	
								attrs:{
									title:'权限微调'
								}
							},
							[ h('span', {
								class: 'table-handle-button',
								 on: {
									 click: () => {
										 this.editAction(params.row)
									 }
								 }
								}, '权限微调')
							]) 
						);
											
						// 设置按钮
						buttons.push(
							h('span', {
									attrs: {
										title: '品牌商的参数设置'
									}
								},
								[h('span', {
									class: 'table-handle-button',
									on: {
										click: () => {
											this.settingItem(params.index, params.row);
										}
									}
								}, '参数设置')])
						);
						
					}
				
					 if (params.row.handle.plugins) {
					 	// 组件权限按钮
					 	buttons.push(h('span', {
					 		class: 'table-handle-button',
					 		on: {
					 			click: () => {
					 				this.editPlugins(params.index, params.row)
					 			}
					 		}
					 	}, '组件授权'));
					 }
					return h('div', buttons);
				}
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.brandList, {
						page: page
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 搜索
			searchPage() {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.brandList, {
						status: this.formSearch.status,
						searchq: this.formSearch.searchq
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 编辑按钮
			editItem(index, row) {
				this.showList = false;

				this.$refs['brand-form'].initSet(index, row, this.pluginsGroup);
			},
			settingItem(index, row) {
				this.showList = false;

				this.$refs['brand-setting'].showSetting(row.id);
			},
			// 组件授权
			editPlugins(index, row) {
				this.$refs['brand-plugins'].openModal(row.brand_id);
			},
			// 回调关闭表单
			closeUserForm(obj) {
				this.showList = true;
			},
			// 编辑内容，保存完毕的回调
			saveUserForm(obj) {
				this.showList = true;
				this.init();
			},
			// 创建品牌
			createBrand(){
				this.showPop = false;
				this.showList = false;
				this.$refs['brand-add-form'].openModal();
			},
			// 创建品牌成功的回调
			onCreateSuccess( brandId ){
				this.showList = true;
				
				this.init( brandId );
			},
			// 权限微调
			editAction( row ){
				this.showList = false;
				
				this.$refs['brand-extra-action'].openModal( row );
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
