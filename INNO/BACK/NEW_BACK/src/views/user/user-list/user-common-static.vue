<template>
	<Modal class="user-common-form" v-model="modalShow" :title="modalTitle" :width="modalWidth" :footer-hide="footerShow"
	 :mask-closable="false">
		<Table :height="tableHeight" :columns="columns" :data="tableData" ref="myTable"></Table>
	</Modal>
</template>

<script>
	const typeMap = {
		storeHistory: '查看修改店铺时间',
		staffHistory: '查看修改店员时间',
		accountState: '查看账户变更',
		userRank: '查看会员等级'
	}

	export default {
		props: {
			// 区分表格的列数据
			type: {
				type: String,
				required: true
			},
			userData: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				modalShow: false,
				modalWidth: 720,
				tableHeight: 300,
				footerShow: true
			}
		},
		computed: {
			modalTitle() {
				return typeMap[this.type];
			},
			currentData() {
				if (this.type == 'storeHistory') {
					return this.userData.bind_store_history;
				} else if (this.type == 'staffHistory') {
					return this.userData.bind_satff_history;
				} else if (this.type == 'accountState') {
					return this.userData.userChangeCount;
				} else if (this.type == 'userRank') {
					return this.userData.userRankList;
				}
			},
			tableData() {
				return this.currentData.data;
			},
			columns() {
				return this.currentData.columns;
			}
		},
		methods: {
			openModal() {
				this.modalShow = true;
			}
		}
	}
</script>

<style lang="less" scoped>
	.user-common-form {
		.user-list_page {
			margin: 10px 10px 0 10px;
			overflow: hidden;
			text-align: right;
		}
	}
</style>
