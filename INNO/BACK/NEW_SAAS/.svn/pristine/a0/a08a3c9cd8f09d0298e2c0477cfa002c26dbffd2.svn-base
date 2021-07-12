<template>
	<div class="red-envelopes-list">
		<div class="btn_wrapper">
			<Button type="primary" @click="openRedRuleModel()">设置红包规则</Button>
			<Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.add && isList">添加红包</Button>
		</div>
		<Card>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="fromDate">
					<template v-if="row.from_date === '-'">
						<p>未使用</p>
					</template>
					<template v-else>
						<p>{{row.from_date | initDate}}</p>
						<p>{{row.from_date | initTime}}</p>
					</template>
				</template>
				<template slot-scope="{ row }" slot="toDate">
					<p>{{row.to_date | initDate}}</p>
					<p>{{row.to_date | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="modifyTime">
					<p>{{row.modify_time | initDate}}</p>
					<p>{{row.modify_time | initTime}}</p>
				</template>
				<template slot-scope="{ row, index }" slot="handle">
					<template v-if="isList">
						<span v-show="row.handle.send" @click="goSend(row)"><a>发放</a></span>
						<Divider type="vertical" v-show="row.handle.send" />
						<span v-show="row.handle.assembly" @click="goAssemble(row)"><a>发放流水</a></span>
						<Divider type="vertical" v-show="row.handle.assembly" />
						<span v-show="row.handle.edit" @click="editItem(index, row)"><a>编辑</a></span>
						<Divider type="vertical" v-show="row.handle.edit" />
						<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该红包吗？')"><a>删除</a></span>
					</template>
					<template v-else>
						<span v-show="row.handle.remove" @click="delItem(row, '还原提示', '确定还原该红包吗？')"><a>还原</a></span>
					</template>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
		<red-envelopes-form ref="paymentForm" @on-success="onLoadData" />
		<red-rule-form ref="redRuleForms" @on-success="onLoadData"/>
	</div>
</template>
<script>
	import redEnvelopesForm from './red-envelopes-form';
	import redRuleForm from './red-rule-form';
	import PageHelper from '@/libs/page-helper.js';
	import Mixin from './mixin';

	export default {
		props: {
			searchData: Object
		},
		data() {
			return {
				canCreate: {},
                selectedArticleId: ''
			}
		},
		computed: {
			isList() {
				// 是否为红包列表
				return this.$route.query.act === 'redEnvelopes';
			}
		},
		mixins: [Mixin, PageHelper],
		components: {
			redEnvelopesForm,
            redRuleForm //红包规则
		},
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.searchData, {
					enable: this.isList ? 1 : 0
				});
				return this.$ajax.post(this.$api.redPacketList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
							this.selectedArticleId = res.data.selectedArticleId;
						}
					});
			},
			searchPage() {
				this.loadData();
			},
            //设置红包规格
            openRedRuleModel() {
                this.$refs.redRuleForms.setData(this.selectedArticleId).show();
            },
			openModal(row) {
				this.$refs.paymentForm.setData(row).show();
			},
			editItem(index, row) {
				this.openModal(row);
			},
			goSend(row) {
				this.$router.push({
					name: 'red-packet-send',
					params: {
						id: row.id
					}
				});
			},
			goAssemble(row) {
				this.$router.push({
					name: 'red-packet-assembly-list',
					params: {
						id: row.id
					}
				});
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.redPacketRemove, {
					id: row.id,
					enable: this.isList ? 0 : 1
				});
			}
		}
	}
</script>

<style lang="less">
	.red-envelopes-list {
		.coupon-list_import {
			margin-right: 10px;
		}

		.btn_wrapper {
			margin-bottom: 24px;
			text-align: right;
		}
	}
</style>
