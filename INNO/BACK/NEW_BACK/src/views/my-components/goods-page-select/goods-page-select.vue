<style lang="less">
	.goods-page-select{
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
        .ivu-form-item{
            margin-bottom: 10px;
        }
		.ivu-input-icon-clear{
			right:50px;
	    }
    }

    .goods-img-box{
		background: center center no-repeat #fff;
    	background-size: 100% auto;
    	height: 68px;
    	width: 68px;
    	border: 1px solid #eee;
    	border-radius: 5px;
    	cursor: pointer;
	}
	.selected-title{
		font-size:12px;
    }
}
</style>

<template>
	<div>
		<Modal v-model="showModal" :loading="modalLoading" :title="modalTitle" :width="880" :styles="{top:'20px'}" class="goods-page-select"
		 @on-ok="onOk">

			<Row :gutter="10">
				<Col :span="4">
				<!--选中的区域-->
				<Card>
					<p slot="title" class="selected-title">已选项 <span v-if="selectModel=='radio'" style="color:red;">[单选模式]</span><span
						 v-else>[多选模式]</span></p>
					<a slot="extra" style="cursor: pointer;display:none;" @click="cleanSelect">清空已选</a>

					<Row :gutter="10" class="select-body" :style="getContentHeight">
						<Col :span="22" v-for="(item,index) in selectItems" :name="index" :key="index">
						<div class="select-box">
							<div class="close" @click="onCloseSelect(index)">
								<Icon type="md-close-circle" class="close-icon"></Icon>
							</div>
							<div class="clamp2">{{item.name}}</div>
						</div>
						</Col>
						<div v-if="selectItems.length == 0" style="text-align: center;">暂无选中项</div>
					</Row>

				</Card>
				</Col>
				<Col :span="20">
				<!--列表区域-->
				<div class="table-topbar">
					<Form ref="formSearch" :model="formSearch" inline>
						<FormItem>
							所属分类：
							<Select v-model="formSearch.catId" placeholder="分类" style="width:110px">
								<Option value="-1">全部分类</Option>
								<Option v-for="(item, key) in catList" :value="item.id" :key="item.id">{{item.name}}</Option>
							</Select>
						</FormItem>	
						<FormItem>
							状态：
							<Select v-model="formSearch.status" placeholder="页面状态" style="width:110px">
								<Option value="-1">全部状态</Option>
								<Option v-for="(item, key) in statusList" :value="key" :key="key">{{item.name}}</Option>
							</Select>
						</FormItem>
						<FormItem>
							<Input v-model="formSearch.searchq" style="width:280px;" placeholder="" 
							clearable search enter-button 
							@on-search="searchPage"
							@on-clear="searchPage" 
							@keydown.native.enter.prevent="searchPage">
							<Select v-model="formSearch.searchqType" slot="prepend" style="width:100px">
								<Option value="name">名称</Option>
							</Select>
							</Input>
						</FormItem>
					</Form>
				</div>

				<Table ref="select-table" :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data" @on-select="onTableSelect"
				 @on-select-cancel="onTableSelectCancel" @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel"></Table>
				<div v-show="pageTotal>0" class="table-pager-footer">
					<div style="float: right;">
						<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
					</div>
				</div>
				</Col>
			</Row>
			<Spin size="large" fix v-if="spinShow"></Spin>

		</Modal>
	</div>
</template>

<script>
	/**
	 * 商品活动页 - 微页面
	 */
	export default {
		name: 'goodsPageSelect',
		components: {

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
		data() {
			return {
				// 模态框
				showModal: false,
				modalTitle: '选择微页面',
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
					status: -1,
					searchq: '',
					searchqType: 'name',
				},

				// 用户状态列
				statusList: [],
				catList: [],
			}
		},
		methods: {
			init() {

			},
			// 父组件调用的方法
			openModal(selectItems, type) {
				this.showModal = true;

				// type 是模式，radio 表示单选
				this.selectModel = type;

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

				// ajax 请求获取初始化数据
				this.$ajax.post( ( this.$route.fullPath.indexOf('cloud-shop') != -1 || this.$route.fullPath.indexOf('stores/store-list') != -1 
				? this.$api.cloudGoodsPageList : this.$api.goodsPageList ), {
						isInit: 2,
						pageSize: this.pageSize,
						page: this.page,
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
							this.catList = res.data.catList;
						}

					});
			},
			// 初始化表
			initTable(res) {

				this.columns = res.data.columns;

				// 图片 + 名称
				this.columns[1].render = (h, params) => {
					return h('Row', {
						props: {
							type: "flex",
							justify: "start",
						}
					}, [
						h('Col', {
								style: {
									padding: '5px 5px 5px 0',
								}
							},
							[h('div', {
								style: {
									background: 'url(' + params.row.cover_image_format + ') center center / 100% no-repeat #fff',
									backgroundSize: '100% auto',
									height: '50px',
									width: '50px',
									border: '1px solid #eee',
									borderRadius: '5px',
									cursor: 'pointer',
									display: params.row.cover_image_format == null || params.row.cover_image_format == '' ? 'none' : '',
								},
								attrs: {
									title: '点击查看大图',
								},
								on: {
									click: () => {
										this.$util.viewImage(params.row.cover_image_format, this);
									}
								},
							})]),
						h('Col', {
								style: {
									padding: '8px 5px 5px 5px',
									flex: '1 1 0%',
								}
							},
							[h('div', {
								style: {
									fontWeight: 'blod',
									overflow: 'hidden',
									display: '-webkit-box',
									'-webkit-line-clamp': 2,
									'-webkit-box-orient': 'vertical',
									wordBreak: 'break-all',
									'lineHeight': 3,
								}
							}, params.row.name), ]),
					]);
				};

				// 状态标识
				this.columns[(this.columns.length - 1)]['render'] = (h, params) => {
					const row = params.row;
					const color = row.is_enable == 1 ? 'success' : 'error';
					const text = row.is_enable == 1 ? '已上线' : '已下线';

					return h('Tag', {
						props: {
							type: 'dot',
							color: color
						}
					}, text);
				};

			},
			// 切换分页
			changePage(page) {

				this.tableLoading = true;
				// ajax 请求获取数据，
				this.$ajax.post( ( this.$route.fullPath.indexOf('cloud-shop') != -1 || this.$route.fullPath.indexOf('stores/store-list') != -1 
				? this.$api.cloudGoodsPageList : this.$api.goodsPageList ), {
						isInit: 2,
						page: page,
						pageSize: this.pageSize,
						searchq: this.formSearch.searchq,
						searchqType: this.formSearch.searchqType,
						status: this.formSearch.status,
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
				this.$ajax.post( ( this.$route.fullPath.indexOf('cloud-shop') != -1 || this.$route.fullPath.indexOf('stores/store-list') != -1
				? this.$api.cloudGoodsPageList : this.$api.goodsPageList ), {
						isInit: 2,
						searchq: this.formSearch.searchq,
						searchqType: this.formSearch.searchqType,
						pageSize: this.pageSize,
						catId: this.formSearch.catId,
						status: this.formSearch.status,
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
			// 检查数据，把已选的加入勾选
			checkData(dataList) {
				for (var i in dataList) {
					var is_checked = false;

					if (this.selectItems.length > 0) {
						for (var j in this.selectItems) {
							if (dataList[i].id == this.selectItems[j].id) {
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
					if (this.selectItems[i].id == row.id) {
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
							if (this.selectItems[i].id == selection[j].id) {
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
						if (this.selectItems[j].id == this.data[i].id) {
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
			// 查看大图
			showImage(item) {
				var imgSrc = (typeof(item.get_goods_picture) == 'undefined' ? item.img_src_format : item.get_goods_picture[0].get_image_info
					.img_src_format);

				this.$util.viewImage(imgSrc, this);
			},
		},
		mounted() {
			this.init();
		},
	}
</script>
