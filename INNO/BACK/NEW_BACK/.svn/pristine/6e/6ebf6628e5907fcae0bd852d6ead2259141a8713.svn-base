<template>
	<div class="package-manager">
		<div>
			<SearchForm ref="search" @on-search="searchPage"></SearchForm>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.package_bg_image" v-if="row.package_bg_image" :alt="row.package_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.package_name" v-viewer v-else></img>
						</div>
						<span class="name">{{row.package_name}}</span>
					</div>
				</template>
				<template slot-scope="{ row }" slot="from_date">
					<p>{{row.from_date | initDate}}</p>
					<p>{{row.from_date | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="to_date">
					<p>{{row.to_date | initDate}}</p>
					<p>{{row.to_date | initTime}}</p>
				</template>
				<template slot-scope="{ row }" slot="is_enabled">
					<Tag type="dot" :color="row.is_enabled === '1' ? 'success' : (row.is_enabled === '2') ? 'warning' : 'error'">
						{{row.is_enabled === '1' ? '启用' : (row.is_enabled === '2') ? '过期' : '关闭'}}
					</Tag>
				</template>

				<template slot-scope="{ row }" slot="openStatus">
					<i-switch v-model="row.open_status" size="large" true-value="1" false-value="0" :before-change="handleChange.bind(this, row)" >
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</template>

				<template slot-scope="{ row, index }" slot="handle">
					<span @click="editItem(row)" v-show="row.handle.edit"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit" />
					<span v-show="row.handle.code"><a>小程序二维码</a></span>
					<Divider type="vertical" v-show="row.handle.code" />
					<span v-show="row.handle.copy" @click="copyUrl(row)"><a>复制链接</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</div>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import util from '@/libs/util.js';

	export default {
		components: {
			SearchForm
		},
		data() {
			return {
				canCreate: {},
				condition: {
					searchq: '',
					status: -1
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				let params = Object.assign({}, data, this.condition);
				return this.$ajax.post(this.$api.goodsPackageList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
							this.$emit('get-can-create', this.canCreate);
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
                this.$emit('packageManagers', this.condition);
                this.loadData();
			},
			copyUrl(row) {
				util.copyTextToClipBoard(row.copy_url);
			},
			editItem(row) {
				this.$router.push({
					name: 'goods-package-edit',
					params: {
						id: row.id
					}
				})
			},
            handleChange (row) {
                return new Promise((resolve, reject) => {
                    this.$Modal.confirm({
                        title: '是否开启',
                        content: '您确认要切换开关状态吗？',
                        onOk: () => {
                            this.handleToggle(row);
                            //reject();
                        }
                    });
                })
            },
            handleToggle (row) {
                this.spinShow = true;
                return this.$ajax.post(this.$api.packageGoodsEnable, {
                    id: row.id,
                    is_enabled: +row.open_status ? 0 : 1
                })
                    .then(response => {
                        const res = response.data;
                        if (res.code) {
                            this.$Message.success(res.message);
                            this.loadData();
                        }
                        this.spinShow = false;
                    });
            },
		}
	}
</script>

<style lang="less" scoped>
	.package-manager {}
</style>
