<template>
	<div class="user-level-list">
		<Card>
			<div class="btn_group_level">
				<Button type="info" icon="md-add" @click="addUserLevel" v-if="canCreate.add">添加会员等级</Button>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="bg">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.rank_image" v-if="row.rank_image" :alt="row.rank_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.rank_name" v-viewer v-else></img>
						</div>
					</div>
				</template>
				<template slot-scope="{ row }" slot="name">
					<p>{{row.rank_name}}</p>
					<p v-if="row.default_level == 'Y'" class="sign">(默认等级)</p>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.edit" @click="editItem(row.rank_id)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.remove" />
					<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除管理员吗？只有未使用的等级才能删除！')"><a>删除</a></span>
					<Divider type="vertical" v-show="(row.handle.edit || row.handle.remove) && row.handle.setting" />
					<span v-show="row.handle.setting" @click="setDefalut(row)"><a>设为默认</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
	</div>
</template>
<script>
	import Mixin from './mixin.js';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import PageHelper from '@/libs/page-helper.js';

	export default {
		data() {
			return {
				canCreate: {}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.userRankSettingList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
						}
					});
			},
			setDefalut(row) {
				return this.$ajax.post(this.$api.userRankSettingSet, {
					id: row.rank_id
				}).then(() => {
					this.loadData();
				});
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.userRankSettingRemove, {
					id: row.rank_id
				});
			},
			addUserLevel() {
				this.$router.push({
					name: 'user-level-create'
				});
			},
			editItem(rankId) {
				this.$router.push({
					name: 'user-level-edit',
					params: {
						id: rankId
					}
				});
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.user-level-list {
		.user-level_import {
			margin-right: 10px;
		}

		.btn_group_level {
			text-align: right;
			margin-bottom: 10px;
		}

		.sign {
			color: red;
		}
	}
</style>
