<template>
	<div class="user-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" :store-list="storeList" :register-from="registerFrom" :rank-list="rankList" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:130px;text-align: right;">
					
					<template v-if="canExport">
						<Poptip v-model="showPop" placement="bottom-end" width="300">
							<Button type="info">导出数据</Button>
							
							<div slot="content" class="user-exp-box">
								<Row :gutter="10">
									<Col :span="12" style="text-align: center;">
										<Button type="success" class="user-list_import" @click="handleExport('all')">导出全部数据</Button>
									</Col>
									<Col :span="12" style="text-align: center;">
										<Button type="warning" class="user-list_import" @click="handleExport('filter')">导出筛选数据</Button>
									</Col>
								</Row>
							</div>
						</Poptip>
					</template>
					
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="name">
					<div>
						<div class="img_list_wrap img_list_wrap_fixed">
							<div class="img_fixed">
								<img :src="row.wx_avatar" v-if="row.wx_avatar" :alt="row.wx_nick_name" />
								<img src="@rs/images/default-img.jpg" :alt="row.wx_nick_name" v-viewer v-else></img>
							</div>
							<div class="user_info">
								<p class="clamp2">昵称：{{row.wx_nick_name}}</p>
								<p class="clamp2">卡号：{{row.user_name}}</p>
								<p>手机：{{row.mobile_phone}}</p>
								<p>等级：{{row.user_rank}}</p>
								<p v-if="Number(row.assets_transfered)" class="extra_info">{{row.assets_transfered_name}}</p>
							</div>
						</div>
					</div>
				</template>
				<template slot-scope="{ row }" slot="store">
					<div v-if="row.from_store_name != null && row.from_store_name != '' " class="store_wrapper">
						<Tooltip :content="row.from_store_name" placement="top">
							<p class="clamp2">{{row.from_store_name}}</p>
						</Tooltip>
						<p>({{row.store_code}})</p>
					</div>
					<div v-else>
						-
					</div>
				</template>
				<template slot-scope="{ row }" slot="subscribe">
					<Tag type="dot" :color="Number(row.wx_subscribe) ? 'success' : 'error'">{{Number(row.wx_subscribe) ? '是' : '否'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="applet">
					<Tag type="dot" :color="Number(row.applet_openid_have) ? 'success' : 'error'">{{Number(row.applet_openid_have) ? '是' : '否'}}</Tag>
				</template>
				<template slot-scope="{ row }" slot="createTime">
					<p>{{row.created_at_format | initDate}}</p>
					<p>{{row.created_at_format | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<router-link tag="a" :to="{name: 'user-view', params:{id: row.user_id}}" target="_blank">查看</router-link>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
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
	import notice from '@/views/my-components/mq-notice/mq-notice';

	export default {
		components: {
			SearchForm,
			notice
		},
		data() {
			return {
				canExport: true,
				condition: {
					startTime: '',
					endTime: '',
					store_id: 0,
					staff_code: '',
					platform_src: [],
					user_rank: [],
					is_bind_mobile: 0,
					is_related_user: 0,
					is_profile_modify: 0,
					is_bind_staff: 0,
					is_wx_subscribe: 0,
					is_bind_applet: 0,
					search: '',
					type: 1
				},
				showPop: false,
				storeList: {},
				registerFrom: {},
				rankList: {},
				jobIdCol: []
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				this.$store.commit('setLoading', true);
				let params = Object.assign({
					isInit: 1
				}, data, this.condition);
				return this.$ajax.post(this.$api.userList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canExport = res.data && res.data.canExport;
							this.storeList = res.data && res.data.storeList;
							this.registerFrom = res.data && res.data.registerFrom;
							this.rankList = res.data && res.data.rankList;
							this.$store.commit('setLoading', false);
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			openModal(row) {
				this.$refs.brandForm.openModal(row);
			},
			handleExport(type) {
				this.$Modal.confirm({
					title: '操作提示',
					content: type == 'all' ? '确定导出全部数据吗？' : '确定导出筛选的数据吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.userExport, type == 'all' ? {
								export_all: true
							} : {
								export_all: false,
								...this.condition
							})
							.then((response) => {
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
			onImportSuccess() {
				this.loadData();
			},
			handleFinish() {
				// 异步下载结束后刷新
				this.loadData();
				this.currentPage = 1;
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less">
	.user-list {
		.img_list_wrap_fixed {
			height: 90px;
		}
		.user-list_import {
			margin-right: 10px;
		}
		
		.user-exp-box{
			padding:10px 0 5px 0;
			text-align: center;
			overflow:hidden;
		}

		@media screen and (max-width: 1680px) {
			.user-list_import {
				margin-bottom: 10px;
			}
		}

		@media screen and (max-width: 1500px) {
			.ivu-tag-dot-inner {
				margin-right: 0;
			}
		}

		.btn-group {
			text-align: right;
		}

		.user_info {
			display: flex;
			height: 96px;
			overflow: hidden;
			align-items: flex-start;
			flex-direction: column;
			justify-content: center;

			.extra_info {
				color: #ff9900;
			}
		}

		.store_wrapper {
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			justify-content: center;
			height: 96px;
			overflow: hidden;
		}
	}
</style>
