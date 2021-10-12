<style lang="less" scoped>
	.store-group{
		background-color: #fff;
		padding: 1rem;
	}
</style>
<template>
	<div class="store-group">
		<div>
			<Tabs v-model="tabIndex" @on-click="changeTab">
				<TabPane label="店铺导航分组">
					<div class="table-topbar flex f-just-between m-bottom-10">
							<span class="notice">注：此功能控制的是店铺导航（查看附近门店）页及门店自提中店铺选择列表页的显示</span>
							<Button type="primary" v-if="canCreate.add" icon="plus-round" @click="showInfo(-1)">新增店铺分组</Button>
					</div>
					<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData">
						<template slot-scope="{row,index}" slot="is_enabled">
							<Tag type="dot" color="success" v-if="row.is_enabled==1">启用</Tag>
							<Tag type="dot" color="error" v-else>关闭</Tag>
						</template>
						<template slot-scope="{row,index}" slot="store_count">
							<a @click="getJump(row)">{{row.store_count}}</a>
						</template>
						<template slot-scope="{ row, index }" slot="action">
							<div class="v-lines">
								<template v-if="row.handle.store_list"><a @click="getJump(row)">店铺列表</a><span class="v-line"> | </span></template>
								<template v-if="row.handle.edit"><a @click="showInfo(index, row)">编辑</a><span class="v-line"> | </span></template>
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
								<template v-if="row.handle.import"><a @click="importStore(index, row)">导入店铺</a><span class="v-line"> | </span></template>
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
				</TabPane>
				<TabPane label="店铺导航距离显示">
					<Form inline :labelWidth="250" class="m-top-15 m-bottom-15">
						<FormItem label="店铺导航中显示店铺的最远距离为" prop="showshop_dist">
							<InputNumber :min="0" v-model="distanceInfo.showshop_dist"></InputNumber>公里	<span style="color:red;margin-left:20px;">注：显示N公里内的店铺</span>
						</FormItem>
						<br>
						<FormItem label="允许搜索到公里数范围外的店铺" prop="allow_search_other_shop">
							<i-switch v-model="distanceInfo.isforgotdstbysearch" :true-value="1" :false-value="0" size="large">
								<span slot="open">启用</span>
								<span slot="close">关闭</span>
							</i-switch>
						</FormItem>
					</Form>
					<div class="p-left-20">
						<Button type="primary" @click.native="saveNavDist">保存</Button>
					</div>
				</TabPane>
			</Tabs>
		</div>

		<!--编辑-->
		<storeGroupDetail ref="storeGroupDetail" @saveCallback="loadData"></storeGroupDetail>
		<!--导入-->
		<BatchImport ref="batchImport" @on-success="loadData" :upLoadPayLoad="upLoadPayLoad"></BatchImport>
	</div>
</template>

<script type="text/javascript">
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import PageHelper from '@/libs/page-helper.js';
	import groupMixin from './group-mixin.js';
	import storeGroupDetail from './store-group-detail.vue';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	export default {
		components:{
			storeGroupDetail,
			BatchImport
		},
		mixins: [PageHelper, groupMixin],
		data(){
			return {
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
		methods:{
			onLoadData(page, extraData){
				return this.$ajax.post(this.$api.storeNavigationGroupList, {
					...extraData
				}).then((response)=>{
					console.log("response", response);
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						this.data = data;
						this.canCreate = data.canCreate || {};
					}
				})
			},
			loadDistance(){
				return this.$ajax.post(this.$api.storeNavigationDistanceInfo).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						this.distanceInfo = data.items || {};
					}
				})
			},
			changeTab(index){
				if(index == 1){
					this.loadDistance();
				}
			},
			getJump(row){
				this.$router.push({
					name: "store-nav-list",
					query: {
						group_id: row.id
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
				this.$refs['storeGroupDetail'].showModal(row);
			},
			importStore(index, row){
				this.upLoadPayLoad = {
					id: row.id
				}
				this.$refs['batchImport'].openModal({
						upload: true,
						download: true
					}, this.$api.storeNavigationGroupImport, this.$api.storeNavigationGroupTpl);
			},
			removeGroup(index,item){
				this.tableLoading = true;
				this.$ajax.post(this.$api.storeNavigationGroupRemove,{
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