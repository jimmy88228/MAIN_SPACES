<style lang="less">
	.goods-select{
  .basic_cascader_fixed{
    width: 140px;
  }
  .ivu-form-item-label{
    text-align: left;
  }
  .search_wrapper{
		width:100%;
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
		<Modal v-model="showModal" :loading="modalLoading" :title="modalTitle" :width="930" :styles="{top:'20px'}" class="goods-select"
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
									<img :src="(typeof(item.goods_thumb2) == 'undefined' ? item.img_src_format : item.goods_thumb2)" :alt="item.goods_name"
									 style="width: 68px; height:68px; object-fit: cover;" />
								</div>
								<Avatar v-if="0" :src="(typeof(item.goods_thumb2) == 'undefined' ? item.img_src_format : item.goods_thumb2)"
								 icon="md-images" shape="square" size="large"></Avatar>
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
							<div class="flex f-just-between" style="width:100%;">
								<div class="flex">
									<Input class="goods-search_input" v-model="formSearch.search" placeholder="请输入关键字" clearable search enter-button
									 @on-search="loadData" @on-clear="loadData" @keydown.native.enter.prevent="loadData">
									<Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
										<Option :value="1">商品名字</Option>
										<Option :value="2">商品货号</Option>
									</Select>
									</Input>
									<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
									<Checkbox  v-if="$route.fullPath.indexOf('cloud-shop') != -1"
									style="margin-left:30px;"
									v-model="formSearch.onlyStoreGoods"
									@on-change="loadData">
										<span>只显示所管店铺商品</span>
									</Checkbox>
								</div>
								<div>
									<Button type="primary" @click="importGoods">导入商品</Button>
								</div>
							</div>
						</FormItem>
						<transition name="fade">
							<Row v-show="isShowExtra">
								<Col span="10">
								<FormItem label="所有分类">
									<Cascader :data="sortCatList" v-model="currentSort" class="basic_cascader basic_cascader_fixed" placeholder="请选择所有分类"
									 filterable change-on-select transfer ref="catRef" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
								</FormItem>
								<FormItem label="自定义分类" :label-width="90">
									<Cascader :data="sortVcatList" v-model="currentVcatSort" class="basic_cascader basic_cascader_fixed"
									 placeholder="请选择自定义分类" filterable change-on-select transfer ref="vcatRef" :render-format="renderSort"
									 @on-change="selectSortVcat"></Cascader>
								</FormItem>
								<template v-if="$route.fullPath.indexOf('cloud-shop') == -1">
									<FormItem label="商品分类">
										<Select v-model="formSearch.isDelete">
											<Option :value="0">正常商品</Option>
											<Option :value="1">回收站里面的商品</Option>
										</Select>
									</FormItem>
								</template>
								</Col>
								<Col span="8">
								<FormItem label="相册筛选">
									<Select v-model="formSearch.isOnImage">
										<Option v-for="(item, index) in isOnImage" :value="index" :key="index">{{item}}</Option>
									</Select>
								</FormItem>

								<template v-if="$route.fullPath.indexOf('cloud-shop') == -1">
									<FormItem label="上架平台">
										<Select v-model="formSearch.platformSrc" multiple>
											<Option v-for="item in goodsPlatform" :value="item.value" :key="item.value">{{item.name}}</Option>
										</Select>
									</FormItem>
									<FormItem label="售卖类型">
										<Select v-model="formSearch.saleKind">
											<Option v-for="(item, index) in saleKind" :value="index" :key="index">{{item}}</Option>
										</Select>
									</FormItem>
								</template>

								</Col>
								<Col span="6">
								<FormItem label="是否上架">
									<Select v-model="formSearch.isOnSale">
										<Option :value="0">全部</Option>
										<Option :value="1">上架</Option>
										<Option :value="2">下架</Option>
									</Select>
								</FormItem>
								<template v-if="$route.fullPath.indexOf('cloud-shop') == -1">
									<FormItem label="商品类别">
										<Select v-model="formSearch.saleType">
											<Option v-for="(value, name) in saleType" :value="name" :key="name">{{value}}</Option>
										</Select>
									</FormItem>
								</template>
								</Col>
							</Row>
						</transition>
					</Form>
				</div>

				<Table ref="my-table" :loading="tableLoading" :height="tableH" :columns="columns" :data="tableData" 
				@on-select="onTableSelect"
				 @on-select-cancel="onTableSelectCancel" 
				 @on-select-all="onSelectAll" 
				 @on-select-all-cancel="onSelectAllCancel"></Table>
					<div class="page-area list_page" >
						<Page
						:total="pageTotal"
						:page-size="pageSize"
						:current="currentPage"
						:page-size-opts="pageSizeOpts"
						@on-change="e => changePage(e)"
						@on-page-size-change="ps => handlePageSize(ps)"
						show-elevator
						show-total
						show-sizer></Page>
					</div>
				</Col>
			</Row>
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>

<script>
	import Conf from '@/config/index';
	import pageHelper from '@/libs/page-helper.js';
	const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};
	export default {
		name: 'goodsSelect',
		components: {
		},
		mixins: [pageHelper],
		data() {
			return {
				// 模态框
				showModal: false,
				modalTitle: '选择商品',
				modalLoading: true,
				spinShow: false,
				// 选中的项
				selectItems: [],
				// 选择模式, radio 是单选，否则就是多选
				selectModel: 'radio',

				// 列表
				columns: [],
				tableH: 425,
				// 搜索表单
				formSearch: {
					search: '',
					type: 1,
					cat_id: 0,
					vcat_id: 0,
					isDelete: 0, // 0：正常商品 1：回收站里面的商品
					isOnSale: 0, // 0：全部 1：上架 2：下架
					saleType: '0',
					saleKind: 0,
					isOnImage: 0,
					onlyStoreGoods:false,
					platformSrc: [],
					seckillActivityId: 0,
					seckillActivityId2: 0,
					import_type: 0
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
				isShowExtra: false
			}
		},
		computed: {
			// 获取内容框高度
			getContentHeight() {
				let tHeight = this.tableH = document.body.clientHeight - 380;
				return {
					height: tHeight + 'px',
					display: 'block',
				};
			},
			isCloudShop(){
				return this.$route.fullPath.indexOf('cloud-shop') != -1 ? true : false
			}
		},
		methods: {
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			init() {},
			// 父组件调用的方法
			openModal(selectItems, type, seckillActivityId = 0, seckillActivityId2 = 0 ) {
				this.showModal = true;
				seckillActivityId > 0 ? this.modalTitle = "限时特惠商品选择" : '';
				// type 是模式，radio 表示单选
				this.selectModel = type;
				try{
					this.selectItems = JSON.parse(JSON.stringify(selectItems)) || [];
				}catch(e){}
				this.seckillActivityId = seckillActivityId || 0;
				this.seckillActivityId2 = seckillActivityId2 || 0;
				// 初始化数据
				this.loadExtraData();
				this.loadData();
				// this.initData( seckillActivityId, seckillActivityId2 );
			},
			onLoadData(page, extraData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post((this.isCloudShop ? this.$api.ShopGoodsList : this.$api.goodsList), {
					isInit: 2,
					search: formSearch.search,
					type: formSearch.type,
					cat_id: formSearch.cat_id,
					vcat_id: formSearch.vcat_id,
					is_delete: formSearch.isDelete,
					is_on_sale: formSearch.isOnSale,
					sale_type: formSearch.saleType,
					sale_kind: formSearch.saleKind,
					is_on_image: formSearch.isOnImage,
					platform_src: formSearch.platformSrc.join(','),
					only_store_goods: formSearch.onlyStoreGoods == true ? 1 : 0,
					seckillActivityId: this.seckillActivityId,
					seckillActivityId2: this.seckillActivityId2,
					import_type: formSearch.import_type,
					...extraData
				}).then((response)=>{
					let res = response.data;
					if(res.code){
						let data = res.data || {};
						// 初始化表
						this.initTable(res);
						// 初始化表数据
						this.data = {
							items: this.checkData(data.items, formSearch.import_type ? true : ''),
							total: data.total
						}
						formSearch.import_type = 0;
						this.statusList = data.statusList || [];
						this.goodsPlatform = data.goods_platform;
						this.isOnImage = data.is_on_image;
						this.saleKind = data.sale_kind;
						this.saleType = data.sale_type;
					}
					
				})
			},
			loadExtraData() {
				this.$ajax.post(this.$route.fullPath.indexOf('cloud-shop') != -1 ? this.$api.ShopCatTree : this.$api.catTree)
					.then(response => {
						const res = response.data;
						if (res.code) {
							// 初始化数据
							this.sortCatList = this.handleSortList([...res.data]);
							this.sortCatList.unshift(defaultItem);
						}
					});
				this.$ajax.post(this.$route.fullPath.indexOf('cloud-shop') != -1 ? this.$api.ShopVcatTree : this.$api.vcatTree)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.sortVcatList = this.handleSortList([...res.data]);
							this.sortVcatList.unshift(defaultItem);
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
				if(this.columns.length > 0) return;
				this.columns = res.data.columns;
				// 商品图片+ 名称
				this.columns[1].render = (h, params) => {
					const imgContent = params.row.goods_thumb2 ? [
						h('img', {
							style: {
								display: 'block',
								width: '100%',
								height: '100%',
								objectFit: 'cover'
							},
							attrs: {
								alt: params.row.goods_name,
								title: '点击查看大图',
								src: params.row.goods_thumb2 || ''
							}
						})
					] : [];
					return h('Row', {
						props: {
							type: 'flex',
							justify: 'start'
						}
					}, [
						h('Col', {
								style: {
									padding: '5px 5px 5px 0'
								}
							},
							[
								h('div', {
									style: {
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'flex-start'
									},
									directives: [{
										name: 'viewer'
									}]
								}, [
									h('div', {
										style: {
											display: 'inline-block',
											height: '70px',
											width: '70px',
											border: '1px solid #eee',
											borderRadius: '5px',
											cursor: 'pointer',
											margin: '8px 5px 8px 0',
											overFlow: 'hidden'
										}
									}, imgContent)
								])
							]
						),
						h('Col', {
								style: {
									padding: '8px 5px 5px 5px',
									width: '70%'
								}
							},
							[h('div', {
									style: {
										fontWeight: 'blod',
										overflow: 'hidden',
										display: '-webkit-box',
										'-webkit-line-clamp': 2,
										'-webkit-box-orient': 'vertical',
										wordBreak: 'break-all'
									}
								}, params.row.goods_name),
								h('div', {
										style: {
											marginTop: '5px',
											display: (this.$route.fullPath.indexOf('cloud-shop') == -1 ? 'block' : 'none')
										}
									}, (params.row.min_price == params.row.max_price) ? '￥' + params.row.min_price :
									`￥${params.row.min_price}-￥${params.row.max_price}`)
							])
					]);
				};
				this.columns[(this.columns.length - 1)].render = (h, params) => {
					const row = params.row;
					const color = row.is_on_sale != null ? (row.is_on_sale == 1 ? 'green' : 'red') : '-';
					const text = row.is_on_sale != null ? (row.is_on_sale == 1 ? '上架' : '下架') : '-';

					return h('span', {
						style: {
							color: color
						}
					}, text);
				};
			},
			// 检查数据，把已选的加入勾选
			checkData(dataList, status) {
				let data = [];
				for (var i in dataList) {
					var is_checked = false;
					if(typeof(status) == 'boolean'){
						is_checked = status;
					} else {
						if (this.selectItems.length > 0) {
							for (var j in this.selectItems) {
								if (dataList[i].goods_id == this.selectItems[j].goods_id) {
									is_checked = true;
									break;
								}
							}
						}
					}
					this.$set(dataList[i], '_checked', is_checked);
					data.push(dataList[i]);
				}
				return data;
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
			},
			// 导入商品
			importGoods(){
				this.$UIModule({
					mode: "batch-import",
					props: {
						inputKey: (this.seckillActivityId || this.seckillActivityId2) ? '活动ID' : '商品货号'
					},
					options: {
						canCreate: {
							upload: true,
							download: true,
							goodsInputImport: true
						},
						uploadUrl: this.$api.BargainBuyImport,
						downloadUrl: this.$api.BargainBuyTpl
					},
					success:(data)=>{
						let uploadInputTxt = data || "";
						this.formSearch.type = 2; // 货号搜索
						this.formSearch.search = uploadInputTxt;
						this.formSearch.import_type = 1;
						this.loadData();
					}
				})
			},
		},
		mounted() {
			this.init();
		}
	}
</script>
