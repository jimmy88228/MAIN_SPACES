<style lang="less" scoped>
	.store-group {
		background-color: #fff;
		padding: 1rem;
	}
</style>

<template>
	<div class="store-group">
		<div v-show="!infoShow">
			<Tabs>
				<TabPane label="店铺首頁分组">
					<div class="table-topbar flex f-just-between m-bottom-10">
						<span class="notice"></span>
						<Button type="primary" icon="plus-round" @click="showInfo()">新增店铺分组</Button>
					</div>
					
					<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData">
						<template slot-scope="{row,index}" slot="is_enabled">
							<Tag type="dot" color="success" v-if="row.is_enabled==1">启用</Tag>
							<Tag type="dot" color="error" v-else>关闭</Tag>
						</template>
						<template slot-scope="{row,index}" slot="store_count">
							<a @click="getJump(row)">{{row.store_count}}</a>
						</template>
						<template slot-scope="{ row, index }" slot="action">
							<div class="v-lines">
								<template v-if="row.handle.store_list"><a @click="getJump(row)">店铺列表</a><span class="v-line"> | </span></template>
								<template v-if="row.handle.edit"><a @click="showInfo(index, row)">编辑</a><span class="v-line"> | </span></template>
								<template v-if="row.handle.remove">
									<Poptip
										transfer
										confirm
										title="确定删除该分组？"
										@on-ok="removeGroup(index, row)">
										<a>删除</a>
									</Poptip>
									<span class="v-line"> | </span>
								</template>
								<template v-if="row.handle.import"><a @click="importStore(index, row)">导入店铺</a><span class="v-line"> | </span></template>
							</div>
						</template>
					</Table>
					
					<!-- <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data">
						<template slot-scope="{row,index}" slot="is_enabled">
							<Tag type="dot" color="success" v-if="row.is_enabled==1">启用</Tag>
							<Tag type="dot" color="error" v-else>关闭</Tag>
						</template>
						<template slot-scope="{row,index}" slot="storeList">
							<router-link :to="{path:'/store/group-homepage-store?group_id',query:{group_id:row.id}}">
								{{row.store}}</router-link>
						</template>
						<template slot-scope="{ row, index }" slot="action">
							<router-link :to="{path:'/store/group-homepage-store?group_id',query:{group_id:row.id}}">
								<Button type="text" size="small">店铺列表</Button></router-link>
							<Button type="text" size="small" @click="showInfo(index,row)">编辑</Button>
							<Button type="text" size="small" style="margin:0 5px" @click="removeGroup(index,row)"
								v-if="row.store==0">删除</Button>
							<Button type="text" size="small"
								@click="uploadData.groupId=row.id;uploadModal=true;editIndex=index">导入店铺</Button>
						</template>
					</Table> -->
					<!-- <div style="margin-top: 10px;overflow: hidden">
						<div style="float: right;">
							<Page :total="pageTotal" :page-size="pageSize" :current="page" @on-change="changePage"
								show-total></Page>
						</div>
					</div> -->
					<div v-show="pageTotal" class="list_page">
					  <Page
					    :total="pageTotal"
					    :page-size="pageSize"
					    :current="currentPage"
					    :page-size-opts="pageSizeOpts"
					    @on-change="e => changePage(e)"
					    @on-page-size-change="ps => handlePageSize(ps)"
					    show-elevator
					    show-total
					    show-sizer></Page>
					</div>
				</TabPane>
			</Tabs>
		</div>

		<!-- <div v-show="infoShow">
			<Button @click="infoShow=false">返回</Button>
			<Button type="primary" @click="saveGroup">保存</Button>
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :labelWidth="120"
				style="margin-top:60px;min-height:250px">
				<FormItem label="分组名称" prop="name">
					<Input style="width:300px;" placeholder="分组名称" v-model="formItem.name"></Input>
				</FormItem>
				<FormItem label="是否启用" prop="is_enabled">
					<i-switch v-model="formItem.is_enabled" false-value="0" true-value="1" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>

				<FormItem label="绑定自定义页">
					<AutoComplete v-model="formSearch.store" :clearable="true" :filter-method="filterMethod"
						:data="pageList" placeholder="选择自定义页" @on-select="selectPages" @on-change="clearPages"
						style="width:250px;" v-if="0">
					</AutoComplete>
					<Select v-model="formItem.page_id" style="width:250px;" clearable filterable>
						<Option :value="item.page_id" :key="item.page_id" v-for="item in page_list">{{item.page_name}}
						</Option>
					</Select>
				</FormItem>

			</Form>
			<Button @click="infoShow=false">返回</Button>
			<Button type="primary" @click="saveGroup">保存</Button>
		</div> -->

		<!-- <Modal title="上传店铺" width="350" v-model="uploadModal" class="importModal" footer-hide>
			<div><Button type="text" @click="downloadTemplate" style="float:right">下载上传模板</Button></div>
			<div>
				<Upload ref="upload" :before-upload="handleUpload" :action="uploadServer" :data="uploadData"
					:format="['xls','xlsx']" :on-success="uploadResult">
					<Button icon="ios-cloud-upload-outline">选择文件</Button>
				</Upload>
				<div v-if="file !== ''" style="margin-bottom:0.5rem;">Upload file: {{ file.name }} </div>
				<Button type="info" @click="upload"
					:loading="loadingStatus">{{ loadingStatus ? '上传中' : '确定上传' }}</Button>
				<div v-if="uploadError.length>0">
					<div style="font-weight:bold;margin-top:1rem;color:red;font-size:16px;">上传结果反馈：</div>
					<div v-for="item in uploadError">{{item}}</div>
				</div>
			</div>
		</Modal> -->
		
		<!--编辑-->
		<storeHomepageDetail ref="storeHomepageDetail" @saveCallback="loadData"></storeHomepageDetail>
		<!--导入-->
		<BatchImport ref="batchImport"></BatchImport>
	</div>
</template>

<script type="text/javascript">
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import PageHelper from '@/libs/page-helper.js';
	import homepageMixin from './homepage-mixin.js';
	import storeHomepageDetail from './store-homepage-detail.vue';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	export default {
		mixins: [PageHelper, homepageMixin],
		components: {
			BatchImport,
			storeHomepageDetail
		},
		data() {
			return {
				// tableHeight: 600,
				// tableLoading: true,
				// infoShow: false,
				// spinShow: false,
				// columns: [],
				// data: [],
				// pageSize: 15,
				// pageTotal: 0,
				// page: 1,
				// editIndex: -1,
				formItem: {
					id: 0,
					name: '',
					page_id: 0,
					is_enabled: '1'
				},
				page_list: [],
				pageList: [],
				formSearch: {
					page_data: ''
				},
				ruleValidate: {
					name: [{
						required: true,
						message: '分组名称不能为空',
						trigger: 'blur'
					}],
				},
				// 导入
				uploadModal: false,
				loadingStatus: false,
				file: '',
				uploadServer: util.apiHost + '/storeHomePage/importStore?access-token=' + Cookies('accessToken'),
				uploadError: [],
				uploadData: {
					type: 'add',
					groupId: 0
				},
				showshop_dist: 100,
			}
		},
		methods: {
			onLoadData(page, extraData){
				return this.$ajax.post(this.$api.storeIndexGroupList, {
					...extraData
				}).then((response)=>{
					console.log("response", response);
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						this.data = data;
						this.canCreate = data.canCreate || {};
					}
				})
			},
			getJump(row){
				this.$router.push({
					name: "store-index-list",
					query: {
						group_id: row.id
					}
				})
			},
			showInfo(index, row){
				this.$refs['storeHomepageDetail'].showModal(row);
			},
			importStore(index, row){
				this.upLoadPayLoad = {
					id: row.id
				}
				this.$refs['batchImport'].openModal({
						upload: true,
						download: true
					}, this.$api.storeIndexGroupImport, this.$api.storeIndexGroupTpl);
			},
			removeGroup(index,item){
				this.tableLoading = true;
				this.$ajax.post(this.$api.storeIndexGroupRemove,{
					id: parseInt(item.id)
				}).then( (response)=>{
					let res = response.data || {};
					if (res.code) {
						this.$delete(this.tableData,index);
						this.$Message.success(res.message);
					}else{
						this.$Message.error(res.message);
					}
				}).finally(()=>{
					this.tableLoading = false;
				})
			},
			
			
			
			
			// changePage(page, init = 0) {
			// 	// 动态计算表高度
			// 	this.tableHeight = document.body.clientHeight - 210;
			// 	this.tableLoading = true;
			// 	page = (page <= 0) ? this.page : page;
			// 	util.ajax.post(util.apiHost + '/storeHomePage/getGroupList', {
			// 		page: page,
			// 		pageSize: this.pageSize,
			// 		isInit: init
			// 	}).then((response) => {
			// 		this.tableLoading = false;
			// 		let data = response.data.data;
			// 		if (init) {
			// 			this.columns = data.columns;
			// 			this.showshop_dist = data.showshop_dist;
			// 		}
			// 		this.data = data.items;
			// 		this.page = data.page;
			// 		this.pageSize = data.pageSize;
			// 		this.pageTotal = data.total;
			// 	})
			// },
			// // showInfo(index, item) {
			// // 	console.log('编辑：', item);
			// // 	this.infoShow = true;
			// // 	this.editIndex = index;
			// // 	if (index > -1) {
			// // 		this.formItem = item;
			// // 	} else {
			// // 		this.formItem = {
			// // 			id: 0,
			// // 			group_name: '',
			// // 			is_enabled: '1'
			// // 		}
			// // 	}

			// // },
			// //保存表单数据
			// saveGroup() {
			// 	this.$refs['formValidate'].validate((valid) => {
			// 		if (valid) {
			// 			// this.spinShow = true;
			// 			util.ajax.post(util.apiHost + '/storeHomePage/postGroupInfo', this.formItem)
			// 				.then((response) => {
			// 					if (response.data.code) {
			// 						if (this.editIndex == -1) {
			// 							// 新增： 给列表数组加入新数据
			// 							this.data.unshift(response.data.data);
			// 							this.pageTotal++;
			// 						} else {
			// 							// 修改：更新data 数据即可,更新数据用 this.$set()
			// 							console.log('修改数据：', response.data.data, '值：', this.editIndex);
			// 							for (var k in response.data.data) {
			// 								if (k != 'store') {
			// 									this.$set(this.data[this.editIndex], k, response.data.data[k]);
			// 								}

			// 							}
			// 						}
			// 						// this.infoShow = false;
			// 						this.$Message.success('保存成功!');
			// 					} else {
			// 						this.$Message.error(response.data.message);
			// 					}
			// 				})
			// 		} else {
			// 			// 验证失败，不关闭模态框
			// 			this.$Message.error('请输入分组名称');
			// 			return false;
			// 		}
			// 	})
			// },
			// // //删除
			// // removeGroup(index, item) {
			// // 	this.tableLoading = true;
			// // 	util.ajax.post(util.apiHost + '/storeHomePage/removeGroup', {
			// // 		groupId: item.id
			// // 	}).then((response) => {
			// // 		this.tableLoading = false;
			// // 		if (response.data.code == 1) {
			// // 			this.$delete(this.data, index);
			// // 			this.$Message.success('删除成功！');
			// // 		} else {
			// // 			this.$Message.error(response.data.msg);
			// // 		}
			// // 	})
			// // },
			// handleUpload(file) {
			// 	this.file = file;
			// 	return false;
			// },
			// // 手动上传
			// upload() {
			// 	if (!this.file) {
			// 		this.$Message.error('请选择要上传的文件！');
			// 		return false;
			// 	}
			// 	this.$refs.upload.post(this.file);
			// 	this.loadingStatus = true;
			// },
			// uploadResult(response, file) {
			// 	console.log(response);
			// 	this.uploadError = response.data;
			// 	this.loadingStatus = false;
			// 	if (response.code != 1) {
			// 		// this.$Message.error(response.msg);
			// 	} else {
			// 		this.file = '';
			// 		let store = this.data[this.editIndex]['store'];
			// 		store = parseInt(store) + response.num;
			// 		this.$set(this.data[this.editIndex], 'store', store);
			// 		// this.changePage(1);
			// 		// this.uploadModal = false;
			// 		// this.$Message.success(response.msg);
			// 	}

			// 	console.log(response);
			// },
			// downloadTemplate() {
			// 	util.ajax.post(util.apiHost + '/storeHomePage/importStore', {
			// 			type: 'download'
			// 		})
			// 		.then((response) => {
			// 			var a = document.createElement("a");
			// 			a.download = response.data.filename;
			// 			a.href = response.data.file;
			// 			a.click();
			// 			return;
			// 		})

			// },
			// saveNavDist() {
			// 	this.spinShow = true;
			// 	util.ajax.post(util.apiUrl.saveSysConfig, {
			// 		cfg_type: 'system_settings',
			// 		key: 'showshop_dist',
			// 		cfg_value: this.showshop_dist,
			// 		cfg_remark: '注：此功能控制的是店铺导航（查看附近门店）页及门店自提中店铺选择列表页的显示',
			// 	}).then((response) => {
			// 		this.spinShow = false;
			// 		if (response.data.error == 0) {
			// 			this.$Message.success(response.data.msg);
			// 		} else {
			// 			this.$Message.error(response.data.msg);
			// 		}
			// 		console.log(response.data);
			// 	})
			// },
			// // 获取所有自定义分页数据
			// getPageList() {
			// 	util.ajax.post(util.apiHost + '/storeHomePage/customPageList', {}).then((response) => {
			// 		var res = response.data;
			// 		this.page_list = res.data;
			// 	})
			// },
			// selectPages(option) {
			// 	console.log('option:', option);
			// 	if (option) {
			// 		var arr = option.split('(');
			// 		var code = arr[1].split(')');
			// 		if (this.infoShow) {
			// 			this.formItem.store_name = arr[0];
			// 			this.formItem.store_code = code[0];
			// 			this.formItem.store_id = this.objStore[code[0]];
			// 		} else {
			// 			this.formSearch.store_name = arr[0];
			// 			this.formSearch.store_code = code[0];
			// 			console.log(code[0])
			// 			this.formSearch.store_id = this.objStore[code[0]];
			// 		}

			// 	}
			// },
			// clearPages(value) {
			// 	console.log('clearPages:', value);
			// 	if (value) {
			// 		return;
			// 	}
			// 	console.log(value)
			// 	if (this.infoShow) {
			// 		this.formItem.store_name = '';
			// 		this.formItem.store_code = '';
			// 		this.formItem.store_id = 0;
			// 	} else {
			// 		this.formSearch.store_name = '';
			// 		this.formSearch.store_code = '';
			// 		this.formSearch.store_id = 0;
			// 	}
			// },
		},
		mounted() {
			// this.changePage(1, 1);
			// this.getPageList();
			this.loadData();
		}
	}
</script>
