<template>
	<Card class="goods-package-manager">
		<div class="btn_group">
			<Button type="info" @click="handleGoods" v-if="showGoodsImport || goodsDown">导入套餐商品</Button>
			<Button type="warning" @click="handlePackage" v-if="packageImport || down">导入套餐</Button>
			<Button type="success" icon="md-add" @click="createPackage" v-if="add">创建套餐</Button>
		</div>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="package-manager" label="套餐管理">
				<package-manager ref="package-manager" @get-can-create="handleCanCreate" />
			</TabPane>
			<TabPane name="goods-package" label="套餐商品管理">
				<goods-package ref="goods-package" @get-can-create="handleCanCreate" />
			</TabPane>
		</Tabs>
		<BatchImport ref="batchGoodsImport" @on-success="onImportSuccess"></BatchImport>
		<BatchImport ref="batchPackageImport" @on-success="onImportSuccess"></BatchImport>
	</Card>
</template>

<script>
	import TabsHelper from '@/libs/tabs-helper';
	import PackageManager from './package-manager/index';
	import GoodsPackage from './goods-package/index';
	import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		mixins: [TabsHelper],
		components: {
			PackageManager,
			GoodsPackage,
			BatchImport
		},
		data() {
			return {
				tabName: 'package-manager',
				showGoodsImport: false,
				add: false,
				down: false,
				goodsDown: false,
				packageImport: false
			}
		},
		methods: {
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
				package_import
			}) {
				this.add = add;
				// this.down = down;
				this.down = true; //暂时写死
				this.goodsDown = goods_down;
				this.showGoodsImport = goods_import;
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
