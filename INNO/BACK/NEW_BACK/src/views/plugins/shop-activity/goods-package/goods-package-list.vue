<template>
	<Card class="goods-package-manager">
		<div class="btn_group">
			 <Button type="info" @click="handleGoodsSn" v-if="snImport || snDown">按货号导入套餐商品</Button>
			<Button type="info" @click="handleGoods" v-if="showGoodsImport || goodsDown">按条码导入套餐商品</Button>
			<Button type="warning" @click="handlePackageBtn('batchModifyPrice')" v-if="packageImport || down">批量改套餐价</Button> <!--add-->
			<Button type="warning" @click="handlePackage" v-if="packageImport || down">导入套餐</Button>
			<Button type="info" @click="handleExport('activity')">导出活动</Button>
			<Button type="info" @click="handleExport('product')">导出商品</Button>
			<Button type="success" icon="md-add" @click="createPackage" v-if="add">创建套餐</Button>
		</div>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="package-manager" label="套餐管理">
				<package-manager ref="package-manager"  @packageManagers="packageManagers" @get-can-create="handleCanCreate" />
			</TabPane>
			<TabPane name="goods-package" label="套餐商品管理">
				<goods-package ref="goods-package" @get-can-create="handleCanCreate" />
			</TabPane>
		</Tabs>
		<BatchImport ref="batchGoodsSnImport" @on-success="onImportSuccess"></BatchImport>
		<BatchImport ref="batchGoodsImport" @on-success="onImportSuccess"></BatchImport>
		<BatchImport ref="batchPackageImport" @on-success="onImportSuccess"></BatchImport>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="searchPage" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</Card>
</template>

<script>
	import TabsHelper from '@/libs/tabs-helper';
    import notice from '@/views/my-components/mq-notice/mq-notice';
	import PackageManager from './package-manager/index';
	import GoodsPackage from './goods-package/index';
	import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		mixins: [TabsHelper],
		components: {
            notice,
			PackageManager,
			GoodsPackage,
			BatchImport
		},
		data() {
			return {
				tabName: 'package-manager',
				snImport: false,
				showGoodsImport: false,
				add: false,
				down: false,
				snDown: false,
				goodsDown: false,
				packageImport: false,
                condition: {
                    keyword: '',
                    status: '-1'
				},
                jobIdCol: []
			}
		},
		methods: {
            searchPage(){
                this.$emit("search", this.formSearch)
            },
            packageManagers(e){
                this.condition.keyword = e.searchq;
                this.condition.status = e.status;
			},
            handleExport(type) {
                let content = '确定进行导出操作';
                if (type == 'activity') {
                    content = '确定导出活动操作';
				}else if(type == 'product') {
                    content = '确定导出商品操作';
				}

				let condition = {
					...this.condition,
					type
				};

                this.$Modal.confirm({
                    title: '操作提示',
                    content: content,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.$store.commit('setLoading', true);
                        return this.$ajax.post(this.$api.packageActivityExport, condition)
                            .then(response => {
                                const res = response.data;
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
                                this.$store.commit('setLoading', false);
                            });
                    }
                });
            },
			handleGoodsSn() {
				this.$refs.batchGoodsSnImport.openModal({
					upload: this.snImport,
					download: this.snDown
				}, this.$api.packageGoodsSnImport, this.$api.packageGoodsSnDown);
			},
			handleGoods() {
				this.$refs.batchGoodsImport.openModal({
					upload: this.showGoodsImport,
					download: this.goodsDown
				}, this.$api.packageGoodsImport, this.$api.packageGoodsDown);
			},
			handlePackage() {
				this.$refs.batchPackageImport.openModal({
					upload: this.packageImport,
					download: this.down
				}, this.$api.packageImport, this.$api.packageDown);
			},
			handlePackageBtn(val) {
			    let importUrl = '';
			    let downUrl = '';
			    if (val == 'batchModifyPrice') {
					//批量改套餐价
                    downUrl = this.$api.packageBatchUpdatePriceDown;
                    importUrl = this.$api.packageBatchUpdatePriceImport;
				} else if(val == 'goodsSnImport') {
					//按货号导入商品
                    downUrl = this.$api.packageGoodsInfoDown;
                    importUrl = this.$api.packageGoodsInfoImport;
				}
				this.$refs.batchPackageImport.openModal({
					upload: this.packageImport,
					download: this.down
				}, importUrl, downUrl);
			},
			createPackage() {
				this.$router.push({
					name: 'goods-package-add'
				});
			},
			onImportSuccess() {
				this.$refs[this.tabName].loadData();
			},
			handleCanCreate({
				add,
				down,
				goods_down,
				goods_import,
				package_import,
				sn_down,
				sn_import
			}) {
				this.add = add;
				// this.down = down;
				this.down = true; //暂时写死
				this.goodsDown = goods_down;
				this.showGoodsImport = goods_import;
				this.snDown = sn_down;
				this.snImport = sn_import;
				this.packageImport = package_import
			}
		}
	}
</script>
<style lang="less" scoped>
	.goods-package-manager {
		.btn_group {
			text-align: right;
		}
	}
</style>
