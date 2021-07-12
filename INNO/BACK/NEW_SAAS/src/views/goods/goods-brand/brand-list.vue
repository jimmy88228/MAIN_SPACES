<template>
	<div class="brand-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:500px;text-align: right;">
					<Button type="info"   :loading="exportLoading"  @click="confirmExport">导出</Button>
					<Button type="info" icon="md-add" @click="handleImport">批量导入</Button>
					<Button type="success" icon="md-add" @click="openModal({})" v-if="canCreate.add">添加商品品牌</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="name">
					<div class="img_list_wrap">
						<div class="img_fixed">
							<img :src="row.goods_brand_image" v-if="row.goods_brand_image" :alt="row.goods_brand_name" v-viewer />
							<img src="@rs/images/default-img.jpg" :alt="row.goods_brand_name" v-viewer v-else></img>
						</div>
						<span class="name">{{row.goods_brand_name}}</span>
					</div>
				</template>
				<template slot-scope="{ row }" slot="createTime">
					<p>{{row.created_at_format | initDate}}</p>
					<p>{{row.created_at_format | initTime}}</p>
				</template>
				<template slot-scope="{ row, index }" slot="handle">
					<span v-show="row.handle.edit" @click="editBrand(index, row)"><a>编辑</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.remove" />
					<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除商品品牌吗？')"><a>删除</a></span>
					<Divider type="vertical" v-show="row.handle.edit && row.handle.remove && row.handle.editAddress " />
					<span v-show="row.handle.editAddress" @click="editBrandAddress(index, row)"><a>编辑退货地址</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
		<BrandForm ref="brandForm" @on-success="onFormSuccess"></BrandForm>
		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
		<!--异步处理导出excel组件-->
        <div class="col">
          <notice :ref="'notice' + item" @finish="" v-for="item in jobIdCol" :key="item"></notice>
        </div>
		<Modal
		class="brand-form"
		v-model="modalAddressEdit"
		:loading="modalLoadingEdit"
		:title="'编辑品牌退货地址'"

		@on-ok="confirmAddress">
			<Form ref="formValidate" :model="formAddressItem"  :rules="ruleValidate" :label-width="80">
			<FormItem label="退货地址" prop="return_goods_addr">
				<Input v-model="formAddressItem.return_goods_addr" placeholder="请输入退货地址"></Input>
			</FormItem>
		</Form>
		</Modal>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import BrandForm from './brand-form';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	import PageHelper from '@/libs/page-helper.js';
	import notice from '@/views/my-components/mq-notice/mq-notice';

	export default {
		components: {
			SearchForm,
			BrandForm,
			BatchImport,
			notice
		},
		data() {
			return {
				canCreate: {},
				condition: {
					searchq: '',
					type: 1
				},
				exportLoading: false,
				jobIdCol: [],
				modalAddressEdit:false,
				formAddressItem: {
					return_goods_addr: '',
					goods_brand_id: 0
				},
				modalAddressEditIndex:0,
				modalLoadingEdit:true,
				ruleValidate:{},
			}
		},
        mounted() {
            this.onLoadData(0, [])
        },
		mixins: [Mixin, PageHelper],
		methods: {
		    init(){
				
			},
			clearOptions() {
				this.condition = {
					searchq: '',
					type: 1
				};
				this.$refs.search.clearOptions();
			},
			onLoadData(page, data) {
				let params = Object.assign({
					isInit: 1
				}, data, this.condition);
				return this.$ajax.post(this.$api.goodsBrandList, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			openModal(row) {
				this.$refs.brandForm.setData(row).show();
			},
			editBrand(index, row) {
				this.openModal(row);
			},
			editBrandAddress(index, row) {
				this.modalAddressEditIndex = index;
				this.modalAddressEdit =true;
				this.formAddressItem.return_goods_addr = row.return_goods_addr;
				this.formAddressItem.goods_brand_id = row.goods_brand_id;
			},
			onDelItem(row) {
				return this.$ajax.post(this.$api.goodsBrandRemove, {
					goods_brand_id: row.goods_brand_id
				});
			},
			handleImport() {
				this.$refs.batchImport.openModal(this.canCreate, this.$api.goodsBrandUpload, this.$api.goodsBrandDownload);
			},
			onImportSuccess() {
				this.loadData();
			},
			confirmExport(){
				return this.$ajax.post(this.$api.goodsBrandList,{
					is_export: 1
				}).then((response) => {
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
				}).finally(()=>{
					this.isExportTime = false;
				})
			},
			confirmAddress () {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						// ajax 保存编辑数据
						this.$ajax.post( ( this.$api.goodsBrandEditAddress), 
							this.formAddressItem 
						)
						.then( (response) => {
							var res = response.data;
							console.log(res.code, "----", this.modalAddressEditIndex)
							if( res.code ){
								// 保存成功
								this.$Message.success('编辑成功！');
								this.modalAddressEdit = false;
								this.$set(this.tableData[this.modalAddressEditIndex], "return_goods_addr", res.data.return_goods_addr)
								// 回调给列表
								// this.$emit('on-change', res.data ); 
								this.modalLoadingEdit = false;
								// this.changePage(1);
							}
							else{
								this.modalAddressEdit = true;
								this.$Message.error( res.message );
								this.modalLoadingEdit = false;
						
								// setTimeout(() => {
								// 	this.modalLoadingEdit = true;
								// }, 2000);
							}
						});
					}
					else {
						// 验证失败，不关闭模态框
						this.modalAddressEdit = true;
						this.$Message.error('必填项不能为空！');
						this.modalLoadingEdit = false;
						
						setTimeout(() => {
							this.modalLoadingEdit = true;
						}, 2000);
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.brand-list {

	}
</style>
