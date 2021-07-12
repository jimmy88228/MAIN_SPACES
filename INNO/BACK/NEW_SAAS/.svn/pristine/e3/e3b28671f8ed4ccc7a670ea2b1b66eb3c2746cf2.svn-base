<style lang="less">
.integral-goods-select{
  .basic_cascader_fixed{
    width: 140px;
  }
  .ivu-form-item-label{
    text-align: left;
  }
  .search_wrapper{
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
  }
	.ivu-tree{
		padding: 0 10px;
	}
	.select-body{
    	overflow: hidden auto;
    	height: 440px;
    	padding-top:10px;
    	font-size:12px;

		.select-box{
			position: relative;
			border:1px solid #eee;
			border-radius: 5px;
			padding:10px;
			background: #efefef;
			margin-bottom: 10px;
			text-align: center;

			.close{
				position: absolute;
				right:-10px;
				top:-10px;
				width:30px;
				height:30px;
				cursor: pointer;

				.close-icon{
					color:#ccc;
					font-size:22px;

					&:hover{
						color:orangered
					}
				}
			}
		}
	}

	.table-topbar{
		.cascader{
			width: 100%;
			display:inline-block;
			margin: 0 10px 10px 0;
		}
        .ivu-form-item{
            margin-bottom: 10px;
        }
		.ivu-input-icon-clear{
			right:50px;
		}
		.goods-search_input{
			width:320px;
			.goods-search_select{
				width: 90px;
			}
		}
    }

    .goods-img-box{
		background: center center no-repeat #fff;
    	background-size: contain;
    	height: 68px;
    	width: 68px;
    	border: 1px solid #eee;
    	border-radius: 5px;
		cursor: pointer;
		margin: 0 auto;
	}
}
</style>

<template>
	<div>
		<Modal v-model="showModal" :loading="modalLoading" :title="modalTitle" :width="880" :styles="{top:'20px'}" class="integral-goods-select"
		 @on-ok="onOk">

			<Row :gutter="10">
				<Col :span="5">
				<!--选中的区域-->
				<Card>
					<p slot="title">已选项 <span v-if="selectModel=='radio'" style="color:red;">[单选模式]</span><span v-else>[多选模式]</span></p>
					<a slot="extra" style="cursor: pointer;display:none;" @click="cleanSelect">清空已选</a>

					<Row :gutter="10" class="select-body" v-viewer :style="getContentHeight">
						<Col :span="22" v-for="(item,index) in selectItems" :name="index" :key="index">
						<div class="select-box">
							<div class="close" @click="onCloseSelect(index)">
								<Icon type="md-close-circle" class="close-icon"></Icon>
							</div>
							<div>
								<div class="goods-img-box" title="点击查看大图">
									<img :src="(typeof(item.picture) == 'undefined' ? item.picture : item.picture)" :alt="item.goods_name"
									 style="width: 68px; height:68px; object-fit: cover;" />
								</div>
		
							</div>
							<div>{{item.goods_name}}</div>
						</div>
						</Col>
						<div v-if="selectItems.length == 0" style="text-align: center;">暂无选中项</div>
					</Row>

				</Card>
				</Col>
				<Col :span="19">
				<!--列表区域-->
				<div class="table-topbar">
					<Form ref="formSearch" :model="formSearch" :label-width="90" inline>
						<FormItem :label-width="0" class="search_wrapper">
							<Input class="goods-search_input" v-model="formSearch.search" placeholder="请输入关键字" clearable search enter-button
							 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
							<Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
								<Option :value="1">商品名字</Option>
								<Option :value="2">商品货号</Option>
							</Select>
							</Input>
						</FormItem>
					</Form>
				</div>

				<Table ref="select-table" :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data" @on-select="onTableSelect"
				 @on-select-cancel="onTableSelectCancel" @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel"></Table>
				<div v-show="pageTotal>0" style="margin:10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="pageTotal" :page-size="pageSize" :current="currentpage" :page-size-opts="pageSizeOpts" @on-change="changePage"
						 @on-page-size-change="handlePageSize" show-elevator show-total show-sizer></Page>
					</div>
				</div>
				</Col>
			</Row>
			<Spin size="large" fix v-if="spinShow"></Spin>

		</Modal>
	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import Conf from '@/config/index';

	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};

	export default {
		name: 'goodsSelect',
		components: {

		},
		data() {
			return {
				// 模态框
				showModal: false,
				modalTitle: '选择积分兑换活动商品',
				modalLoading: true,
				spinShow: false,

				// 选中的项
				selectItems: [],
				// 选择模式, radio 是单选，否则就是多选
				selectModel: 'radio',

				// 列表
				columns: [],
				data: [],
				tableHeight: 425,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 15,
				page: 0,
				// 搜索表单
				formSearch: {
					search: '',
				},

				// 用户状态列
				statusList: [],
				// 接口返回的搜索选项
				goodsPlatform: [],
				isOnImage: [],
				saleKind: [],
				saleType: {},
				sortCatList: [],
				currentSort: [],
				sortVcatList: [],
				currentVcatSort: [],
				currentPage: Conf.PAGE_START,
				pageSize: Conf.PAGE_SIZE_DEF,
				pageSizeOpts: Conf.PAGE_SIZE_OPTS,
				currentpage: 1,
				isShowExtra: false
			}
		},
		computed: {
			// 获取内容框高度
			getContentHeight() {
				var tHeight = this.tableHeight = document.body.clientHeight - 320;

				// 动态计算弹出框的高度
				return {
					height: tHeight + 'px',
					display: 'block',
				};
			},
		},
		methods: {
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			init() {

			},
			// 父组件调用的方法
			openModal(selectItems, type) {
				this.showModal = true;

				// type 是模式，radio 表示单选
				this.selectModel = type;
				// 清空数据
				this.selectItems = [];
				// 这样赋值是取消双向绑定
				for (var i in selectItems) {
					this.selectItems[i] = selectItems[i];
				}
				// 初始化数据
				this.initData();
			},
			// 初始化数据
			initData() {
				this.tableLoading = true;
				this.spinShow = true;

				// ajax 请求获取初始化数据
				util.ajax.post(util.apiUrl.integralGoodsList, {
						isInit: 2,
						pageSize: this.pageSize,
						page: this.currentpage
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							// 初始化表
							this.initTable(res);

							// 初始化表数据
							this.data = this.checkData(res.data.items);
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);

							this.statusList = res.data.statusList;
							this.goodsPlatform = res.data.goods_platform;
							this.isOnImage = res.data.is_on_image;
							this.saleKind = res.data.sale_kind;
							this.saleType = res.data.sale_type;

							this.spinShow = false;
						}
					});
			},
			handleSortList(context) {
				const format = context.map(item => {
					return {
						value: item.cat_id || item.vcat_id,
						label: item.cat_name || item.vcat_name,
						parent_id: item.parent_id,
						children: item.children.length ? this.handleSortList(item.children) : []
					}
				});
				return format;
			},
			dealTreeData(context) {
				const format = context.map(item => {
					return {
						title: item.cat_name || item.vcat_name,
						expand: !!item.children.length,
						children: item.children.length ? this.dealTreeData(item.children) : [],
						id: item.cat_id || item.vcat_id || 0
					}
				});
				return format;
			},
			// 初始化表
			initTable(res) {
				this.columns = res.data.columns;
				
				this.columns[(this.columns.length - 1)].render = (h, params) => {
					const row = params.row;
					const color = row.enable == 1 ? 'green' : 'red';
					const text = row.enable == 1 ? '上架' : '下架';

					return h('span', {
						style: {
							color: color
						}
					}, text);
				};
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				this.currentpage = page;
				// ajax 请求获取数据，
				util.ajax.post(util.apiUrl.integralGoodsList, {
						isInit: 2,
						search: this.formSearch.search,
						page: this.currentpage,
						pageSize: this.pageSize
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = this.checkData(res.data.items);
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			handlePageSize(pageSize) {
				this.tableLoading = true;
				this.pageSize = pageSize;
				// ajax 请求获取数据，
				util.ajax.post(util.apiUrl.integralGoodsList, {
						isInit: 2,
						search: this.formSearch.search,
						page: this.currentpage,
						pageSize: this.pageSize
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = this.checkData(res.data.items);
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 搜索
			searchPage() {
				this.tableLoading = true;
				// ajax 请求获取数据，
				util.ajax.post(util.apiUrl.integralGoodsList, {
						isInit: 2,
						search: this.formSearch.search,
						page: 1,
						pageSize: this.pageSize
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = this.checkData(res.data.items);
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
							this.currentpage = 1;
						}

						this.tableLoading = false;
					});
			},
			// 检查数据，把已选的加入勾选
			checkData(dataList) {
				for (var i in dataList) {
					var is_checked = false;

					if (this.selectItems.length > 0) {
						for (var j in this.selectItems) {
							if (dataList[i].goods_id == this.selectItems[j].goods_id) {
								is_checked = true;
								break;
							}
						}
					}
					this.$set(dataList[i], '_checked', is_checked);
				}
				return dataList;
			},
			// 清空选择的项(清空的功能屏蔽，目前还不能做到绑定)
			cleanSelect() {
				// 清空数组
				this.$set(this, 'selectItems', []);

				// 更新列表的信息
				this.data = this.checkData(this.data);
			},
			// table 选中事件
			onTableSelect(selection, row) {
				if (this.selectModel == 'radio') {
					this.$set(this.selectItems, 0, row);
					// 更新列表的信息
					this.data = this.checkData(this.data);
				} else {
					this.selectItems.push(row);
				}
			},
			// 删除某项
			onCloseSelect(index) {
				this.$delete(this.selectItems, index);

				// 更新列表的信息
				this.data = this.checkData(this.data);
			},
			// 取消选中
			onTableSelectCancel(selection, row) {
				for (var i in this.selectItems) {
					if (this.selectItems[i].goods_id == row.goods_id) {
						this.$delete(this.selectItems, i);
						break;
					}
				}
			},
			// 全选
			onSelectAll(selection) {
				if (this.selectModel == 'radio') {
					this.$refs['select-table'].selectAll(false);
					this.$Message.error('单选模式下，此项无效');
					return;
				}
				for (var j in selection) {
					var inArray = false;

					if (this.selectItems.length > 0) {
						for (var i in this.selectItems) {
							if (this.selectItems[i].goods_id == selection[j].goods_id) {
								inArray = true;
								break;
							}
						}
					}

					if (inArray == false) {
						this.selectItems.push(selection[j]);
					}
				}
			},
			// 全选取消
			onSelectAllCancel() {
				if (this.selectModel == 'radio') {
					return;
				}
				for (var i in this.data) {
					for (var j in this.selectItems) {
						if (this.selectItems[j].goods_id == this.data[i].goods_id) {
							this.$delete(this.selectItems, j);
							break;
						}
					}
				}
			},
			// 模态框确认按钮
			onOk() {
				// 给父组件传递数据
				this.$emit('on-ok', this.selectItems);

				this.showModal = false;
			},
			selectSortCat(value, selectedData) {
				this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
			},
			selectSortVcat(value, selectedData) {
				this.formSearch.vcat_id = selectedData[selectedData.length - 1].value;
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
