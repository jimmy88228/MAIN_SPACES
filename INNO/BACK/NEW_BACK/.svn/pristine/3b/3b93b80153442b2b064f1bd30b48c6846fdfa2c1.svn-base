<style lang="less" scoped>
	.store-group{
		background-color: #fff;
		padding: 1rem;
	}
</style>
<template>
	<div class="store-group">
		<div>
			<div class="table-topbar flex f-just-between m-bottom-10">
				<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				<div>
					<Button type="primary" v-if="canCreate.add" icon="plus-round" @click="showInfo(-1)">添加分组</Button>
					<Button title="注：此功能控制的是商品自提店铺列表页（该分组内的商品在店铺自提选择页中只显示分组内的店铺）" icon="ios-help-circle-outline" style="border: none;"></Button>
				</div>
			</div>
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData">
				<template slot-scope="{row,index}" slot="is_enabled">
					<Tag type="dot" color="success" v-if="row.is_enabled==1">启用</Tag>
					<Tag type="dot" color="error" v-else>关闭</Tag>
				</template>
				<template slot-scope="{row,index}" slot="store_count">
					<router-link :to="{path:'store-group-list?group_id',query:{group_id:row.id}}">{{row.store_count}}</router-link>
				</template>
				<template slot-scope="{row,index}" slot="goods_count">
					<router-link :to="{path:'goods-group-list?group_id',query:{group_id:row.id}}">{{row.goods_count}}</router-link>
				</template>
				<template slot-scope="{ row, index }" slot="action">
					<div class="v-lines">
						<template><a @click="showInfo(index, row)">编辑</a><span class="v-line"> | </span></template>
						<template v-if="row.handle.remove">
							<Poptip
									transfer
									confirm
									title="确定删除该分组？"
									@on-ok="removeGroup(index, row)">
								<a>删除</a>
							</Poptip>
							<span class="v-line"> | </span>
						</template>
						<template v-if="row.handle.import"><a @click="showGroupImport(row, 'store')">导入店铺</a><span class="v-line"> | </span></template>
						<template v-if="row.handle.import"><a @click="showGroupImport(row, 'goods')">导入商品</a><span class="v-line"> | </span></template>
					</div>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
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
		</div>

		<!--编辑-->
		<groupDetail ref="groupDetail" @saveCallback="loadData"></groupDetail>
		<!--导入-->
		<BatchImport ref="batchImport" @on-success="loadData" :upLoadPayLoad="upLoadPayLoad">
			<template v-slot:title>
				<div class="batch-select flex m-bottom-10">
					<label>导入类型：</label>
					<Select v-model="importType" class="basic_select select_fixed"> <!--@on-change="handleAttrChange"-->
						<Option :value="1">覆盖导入</Option>
						<Option :value="2">追加导入</Option>
					</Select>
				</div>
			</template>
		</BatchImport>
	</div>
</template>

<script type="text/javascript">
    import SearchForm from './search-form';
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import PageHelper from '@/libs/page-helper.js';
	import Mixin from './mixin.js';
	import groupDetail from './group-detail.vue';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	export default {
		components:{
            SearchForm,
            groupDetail,
			BatchImport
		},
		mixins: [PageHelper, Mixin],
		data(){
			return {
			    importType: 1,
                condition: {
                    searchq: '',
                    type: 0
                },
				spinShow:false,
				tabIndex: 0,
				editIndex:-1,
				distanceInfo: {
					showshop_dist: 0,
					isforgotdstbysearch: 0
				},
				upLoadPayLoad: {},
				canCreate: {}
			}
		},
        watch: {
            'importType': function (newVal,oldVal) {
                this.upLoadPayLoad.dowload_type = newVal;
            },
        },
		methods:{
            showGroupImport(row, types){
                let type = (types == 'store') ? 'store' : 'goods';
                let importUrl = '';
                let downloadUrl = this.$api.pickupGoodsDownload; //下载商品模板
                if (types == 'store'){
					downloadUrl = this.$api.pickupStoreDownload;
				}
                this.upLoadPayLoad = {
                    id: row.id,
					type: types,
					dowload_type: this.importType
                }
                this.$refs.batchImport.openModal({
                    download: true,
					upload: true,
				}, this.$api.pickupStoreGoodsUpload, downloadUrl);
            },
            searchPage (searchData) {
                this.condition = searchData;
                this.loadData();
            },
			onLoadData(page, extraData){
				return this.$ajax.post(this.$api.pickupGoodsGroupList, {
					...extraData,
					...this.condition
				}).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						this.data = data;
						this.canCreate = data.canCreate || {};
					}
				})
			},
			saveNavDist(){
				this.spinShow = true;
				this.$ajax.post(this.$api.storeNavigationDistanceSave,{
					...this.distanceInfo
				}).then((response)=>{
					let res = response.data || {};
					if(res.code){
						this.$Message.success(res.message);
					}
				}).finally(()=>{
					this.spinShow = false;
				})
			},
			showInfo(index, row){
				this.$refs['groupDetail'].showModal(row);
			},
			importStore(index, row, title){
				this.upLoadPayLoad = {
					id: row.id
				}
				this.$refs['batchImport'].openModal({
						upload: true,
						download: true
					}, this.$api.storeNavigationGroupImport, this.$api.storeNavigationGroupTpl);
			},
			//删除
			removeGroup(index,item){
				this.tableLoading = true;
				this.$ajax.post(this.$api.pickupGroupStoreRemove,{
					id: parseInt(item.id)
				}).then( (response)=>{
					let res = response.data || {};
					if (res.code) {
						this.$delete(this.tableData,index);
						this.$Message.success(res.message);
					}else{
						this.$Message.error(res.message);
					}
				}).finally(()=>{
					this.tableLoading = false;
				})
			}
		},
		mounted(){
			this.loadData();
		}
	}

</script>