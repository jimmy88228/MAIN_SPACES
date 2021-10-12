<template>
	<div class="brand-list">
		<div>
			<Row>
				<Col span="12">
				<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col span="12" class="btn-group">
				<Button type="primary" @click="handleExport">导出</Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="fen">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.get_staff_dstb_info.portrait_path" v-if="row.get_staff_dstb_info.portrait_path" :alt="row.get_staff_dstb_info.dstb_staff_name"
							 v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.get_staff_dstb_info.dstb_staff_name" v-viewer v-else></img>
						</div>
						<div>
							<p class="name">{{row.get_staff_dstb_info.dstb_staff_name}}</p>
							<p class="name">{{row.get_staff_dstb_info.dstb_staff_phone}}</p>
						</div>
					</div>
				</template>
				<template slot-scope="{ row }" slot="si">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.get_members.portrait_path" v-if="row.get_members.portrait_path" :alt="row.get_members.real_name"
							 v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.get_members.real_name" v-viewer v-else></img>
						</div>
						<div>
							<p class="name">{{row.get_members.real_name}}</p>
							<p class="name">{{row.get_members.mobile_phone}}</p>
						</div>
					</div>
				</template>
				<template slot-scope="{ row }" slot="last_click_time">
					<p>{{row.last_click_time | initDate}}</p>
					<p>{{row.last_click_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="protect_expire_time">
					<p>{{row.protect_expire_time | initDate}}</p>
					<p>{{row.protect_expire_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="relation_expire_time">
					<p>{{row.relation_expire_time | initDate}}</p>
					<p>{{row.relation_expire_time | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="join_time">
					<p>{{row.join_time | initDate}}</p>
					<p>{{row.join_time | initTime}}</p>
				</template>
				<template slot-scope="{ row, index }" slot="handle">
					<span v-show="row.handle.edit" @click="editBrand(index, row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.remove" />
					<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除商品品牌吗？')"><a>删除</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</div>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import notice from '@/views/my-components/mq-notice/mq-notice';

	export default {
		props: ['id'],
		components: {
			SearchForm,
			PageTopBase,
			notice
		},
		data() {
			return {
				canCreate: {},
				condition: {
					staffType: '-1', //粉丝身份 -1全部 0 粉丝 1 分销员
					start_time: '', //开始时间
					end_time: '', //结束时间
					searchq: '', //搜索值
					searchq_type: '', //搜索类型
				},
				jobIdCol: []
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.CloudDistributionStaffDetailsList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			openModal(row) {
				this.$refs.brandForm.setData(row).show();
			},
			editBrand(index, row) {
				this.openModal(row);
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.goodsBrandRemove, {
					goods_brand_id: row.goods_brand_id
				});
			},
			handleImport() {
				this.$refs.batchImport.openModal(this.canCreate, this.$api.goodsBrandUpload, this.$api.goodsBrandDownload);
			},
			onImportSuccess() {
				this.loadData();
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.CloudDistributionStaffDetailsListExport, {
							...this.condition
						}).then((response) => {
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
		}
	}
</script>

<style lang="less" scoped>
	.brand-list {
		.brand-list_import {
			margin-right: 10px;
		}

		.btn-group {
			text-align: right;
		}
	}
</style>
