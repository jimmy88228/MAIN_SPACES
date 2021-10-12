<template>
	<div class="user-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" :store-list="storeList" :register-from="registerFrom" :rank-list="rankList" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:260px;text-align: right;">

					<template>
						<Button type="info" @click="handleExport()">导出</Button>
						<Button type="info" @click="goBack()">返回</Button>
					</template>

					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="is_enabled">
					<Tag type="dot" :color="Number(row.is_enabled) ? 'success' : 'error'">{{Number(row.is_enabled) ? '启用' : '关闭'}}</Tag>
				</template>

				<template slot-scope="{ row }" slot="handle">
					<a @click="getDetail(row)">编辑</a>
					<a @click="getRewardRecord(row)">活动记录</a>
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
            notice,
        },
        data() {
            return {
                canExport: true,
                listType: '',
                activity_id: 0,
                condition: {
                    search: ''
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
                    isInit: 1,
                    activity_id: this.activity_id
                }, data, this.condition);
                return this.$ajax.post(this.$api.qwRewardRecordList, params)
                    .then(response => {
                        const res = response.data;
                        if (res.code) {
                            this.data = res.data;
                            this.canExport = res.data && res.data.canExport;
                            this.registerFrom = res.data && res.data.registerFrom || {};
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
                    content: '确定导出加新奖励活动记录吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        return this.$ajax.post(this.$api.qwRewardRecordExport,  {
                            ...this.condition,
							activity_id: this.activity_id
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
            },
            goBack(){
                this.$router.go(-1);
            },
            getRewardRecord(item) {
                this.$router.push({
					name: 'reward-record-list',
					query: {
					    activity_id: item.id || 0,
					}
				})
			},
            initParams(){
                var query = this.$route.query || {};
                this.activity_id = query.activity_id;
            },
        },
        mounted() {
            this.initParams();
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
