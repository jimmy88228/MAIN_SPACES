<template>
	<Modal class="expand-select" v-model="modalShow" :title="modalTitle" :loading="modalLoading" width="900"
	 :mask-closable="maskClose" @on-ok="confirm">
		<div class="container">
			<div class="search">
				<api-search :data="apiData" @on-search="searchPage" v-show="checkType === 'show'"></api-search>
				<front-search @on-search="searchPage" v-show="checkType === 'hidden'"></front-search>
			</div>
			<expand-content :data="contentData"></expand-content>
			<div class="btn_group">
				<Checkbox v-model="isCheck" @on-change="handlePageCheck" v-show="checkType === 'show'"></Checkbox>
				<Select v-model="selectType" class="basic_select" @on-change="handleSelectChange" v-show="checkType === 'show'">
					<Option :value="1">当前页</Option>
					<Option :value="2">所有页</Option>
				</Select>
				<Button :type="btnAll" @click="handleAll">查看所有商品</Button>
				<Button :type="btnSelect" @click="handleSelect">查看已选商品</Button>
				<Button type="primary" @click="handleExport">导出商品</Button>
				<span>已选{{selectedDataLen}}个商品</span>
			</div>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" @on-change="handlePageChange" show-total></Page>
			</div>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Modal>
</template>

<script>
	import Dialog from '@/libs/dialog';
	import ExpandContent from './expand-content';
	import cardList from '@/views/my-components/cs-material-select/card-list';
	import ApiSearch from './api-search';
	import FrontSearch from './front-search';
	import ExportCsv from '@/libs/export-csv';

	const HEADER = ['商品名称', '商品货号', '状态', '库存'];
	export default {
		mixins: [Dialog],
		components: {
			ExpandContent,
			FrontSearch,
			ApiSearch
		},
		provide() {
			return {
				root: this
			};
		},
		props: {
			selected: Array,
			title: String
		},
		data() {
			return {
				modalTitle: this.title,
				condition: {
					isInit: 2,
					search: '',
					type: 1,
					cat_id: 0,
					vcat_id: 0,
					is_delete: 0, // 0：正常商品 1：回收站里面的商品
					is_on_sale: 0, // 0：全部 1：上架 2：下架
					sale_type: '0',
					sale_kind: 0,
					is_on_image: 0,
					platform_src: []
				},
				// 分页
				allSize: 10000,
				pageTotal: 0,
				page: 1,
				pageSize: 20,
				currentPage: 1,
				apiData: {},
				originData: [], //接口返回的数据
				data: [], //分页的数据
				allData: [], //接口请求后格式的数据
				selectedData: [], //已选数据
				selectedAllData: [], //已选格式的数据
				isCheck: false,
				selectType: 1,
				checkType: 'show', //show/hidden
				spinShow: false
			}
		},
		computed: {
			contentData() {
				let result;
				if (this.checkType === 'show') {
					this.data = this.allData[this.currentPage - 1] || [];
					result = this.data;
				} else if (this.checkType === 'hidden') {
					let type = this.condition.type;
					let search = this.condition.search;
					let searchReg = new RegExp(search, 'g');

					let filterData = this.selectedData.filter(item => {
						return (type === 1 && searchReg.test(item.goods_name)) || (type === 2 && searchReg.test(item.goods_sn));
					});
					this.pageTotal = filterData.length;
					this.selectedAllData = this.getPageData(this.pageTotal, filterData);
					result = this.selectedAllData[this.currentPage - 1]; //分页数据
				}
				return result;
			},
			btnAll() {
				return this.checkType === 'show' ? 'primary' : 'default';
			},
			btnSelect() {
				return this.checkType === 'hidden' ? 'primary' : 'default';
			},
			selectedDataLen() {
				return this.selectedData.length;
			}
		},
		methods: {
			load() {
				this.loadData();
			},
			getPageData(total, data) {
				let temp = [];
				let allData = [];
				for (let i = 0; i < total; i++) {
					if (data[i]) temp.push(data[i]);
					if ((i + 1) % this.pageSize === 0) {
						allData.push(temp);
						temp = [];
					}
				}
				let others = total % this.pageSize;
				if (others) {
					let temp = [];
					if (others !== 0) {
						for (let i = total - 1; i >= total - others; i--) {
							temp.push(data[i]);
						}
					}
					allData.push(temp.reverse());
				}
				return allData;
			},
			loadData() {
				this.spinShow = true;
				let params = Object.assign({}, this.condition, {
					page: this.page,
					pageSize: this.allSize,
					all_select: 1
				});
				return this.$ajax.post((this.$route.fullPath.indexOf('cloud-shop') != -1 ? this.$api.ShopGoodsList : this.$api.goodsList),
						params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.allData = []; //清空
							const total = res.data.total; //接口返回
							this.apiData = res.data;
							let data = res.data.items.map((item, index) => {
								item._index = `data${index}`;
								return item;
							});
							this.originData = data;
							this.pageTotal = total;
							this.allData = this.getPageData(this.pageTotal, data);
							this.data = this.allData[0] || [];
						}
						this.spinShow = false;
					});
			},
			searchPage(searchData) {
				this.currentPage = 1;
				this.condition = searchData;
				if (this.checkType === 'show') {
					this.loadData();
				}
			},
			handlePageChange(page) {
				this.currentPage = page;
			},
			handleAll() {
				this.currentPage = 1;
				if (this.checkType !== 'show') {
					this.loadData();
					this.checkType = 'show';
				}
			},
			handleSelect() {
				this.currentPage = 1;
				this.checkType = 'hidden';
			},
			handlePageCheck() {
				this.toggleSelect();
			},
			handleSelectChange() {
				this.toggleSelect();
			},
			toggleSelect() {
				let idCols = this.selectedData.map(item => item.goods_id);
				if (this.isCheck && this.selectType === 1) {
					// 当前页全选
					this.data.forEach(item => {
						if (!idCols.includes(item.goods_id)) {
							this.selectedData.push(item);
						}
					});
				} else if (!this.isCheck && this.selectType === 1) {
					const dataList = this.data.map(item => item.goods_id);
					// 当前页取消
					for (let i = this.selectedData.length - 1; i >= 0; i--) {
						if (dataList.includes(this.selectedData[i].goods_id)) {
							this.selectedData.splice(i, 1);
						}
					}
				} else if (this.isCheck && this.selectType === 2) {
					// 所有页全选
					this.selectedData = JSON.parse(JSON.stringify(this.originData));
				} else {
					this.selectedData = [];
				}
			},
			handleCheck(status, key, data) {
				let idCols = this.selectedData.map(item => parseInt(item.goods_id));
				if (status) {
					if (!idCols.includes(parseInt(data.goods_id))) {
						this.selectedData.push(data);
					}
				} else {
					let index = this.selectedData.findIndex(item => item._index === key);
					this.selectedData.splice(index, 1);
				}
				this.selectedData.forEach((item, index) => {
					if (item._index === key) {
						this.$set(this.selectedData[index], '_checked', status)
					}
				});
			},
			handleExport() {
				const newLine = '\r\n';
				const headerStr = HEADER.join();
				const dataStr = this.selectedData.map(item => {
					return `${item.goods_name},${item.goods_sn},${item.is_on_sale_type},${item.goods_number}`
				}).join(newLine);
				let result = `${headerStr}${newLine}${dataStr}`;
				ExportCsv.download('商品导出.csv', result);
			},
			confirm() {
				if (!this.selectedData.length) this.$Message.error('请选择参加满减活动商品!');
				console.log("触发保存");
				this.$emit('get-goods-id', this.selectedData.map(item => item.goods_id));
				this.$emit('get-goods', this.selectedData );
				this.showLoading();
				this.modalShow = false;
			}
		},
		watch: {
			selected(nV) {
				console.log("selected", nV);
				let nArray = JSON.parse(JSON.stringify(nV)) || [];
				if(nArray.length > 0){
					nArray.forEach((item, index) => {
						if(item instanceof Object){
							this.selectedData[index] = {
								...item,
								'_checked': true,
								'_visible': true
							}
						} else {
							this.selectedData[index] = {
								'goods_id': item,
								'_checked': true,
								'_visible': true
							}
						}
					})
				}
				// console.log("selectedData", this.selectedData)
				// this.selectedData = JSON.parse(JSON.stringify(nV));
				// this.selectedData.forEach((item, index) => {
				// 	this.$set(this.selectedData[index], '_checked', true);
				// 	this.$set(this.selectedData[index], '_visible', true);
				// });
			},
			/* selectedData(nV) {
				let idCols = nV.map(item => parseInt(item.goods_id));
				this.data.forEach((item, index) => {
					this.$set(this.data[index], '_checked', idCols.includes(parseInt(item.goods_id)));
				});
				this.isCheck = this.data.every(item => item._checked);
			}, */
			data(nV) {
				console.log("data", nV);
				console.log("data this.selectedData", JSON.parse(JSON.stringify(this.selectedData)));
				let idCols = this.selectedData.map(item => parseInt(item.goods_id));
				let selectJson = {};
				this.data.forEach((item, index) => {
					this.$set(this.data[index], '_checked', idCols.includes(parseInt(item.goods_id)));
					this.$set(this.data[index], '_visible', true);
					if(idCols.includes(parseInt(item.goods_id))){
						selectJson[item.goods_id] = item;
					}
				});
				this.selectedData.forEach((item, index) => {
					if(selectJson[item.goods_id]){
						this.$set(this.selectedData, index, selectJson[item.goods_id]);
					}
				})
				if (this.selectType === 1) {
					this.isCheck = false;
				}
				this.isCheck = this.data.every(item => item._checked);
			},
			checkType(nV) {
				this.selectedData.forEach((item, index) => {
					this.$set(this.selectedData[index], '_visible', (nV === 'show' || nV === 'hidden'));
				});
				console.log("this.selectedData", this.selectedData)
			}
		}
	}
</script>

<style lang="less">
.btn_group{
	border-top:1px solid #eee;
	padding-top:10px;
}	
</style>