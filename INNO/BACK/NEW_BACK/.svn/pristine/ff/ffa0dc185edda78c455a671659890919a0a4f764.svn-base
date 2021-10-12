
<template>
  <Card class="invite-list-page">
	<div class="span-parent">
		<div class="m-bottom-10 text-r"><Button type="primary" v-if="canCreate.add" @click="addInviteAct"><Icon type="md-add" />&nbsp;新增活动</Button></div>
		<Table :columns="columns" :height="tableHeight" :loading="tableLoading" :data="tableData" ref="myTable">
			<template slot-scope="{ row }" slot="time">
				<p><span style="display:inline-block;width:90px;">{{row.from_time}}</span> - <span style="display:inline-block;width:90px;">{{row.to_time}}</span></p>
			</template>
			<template slot-scope="{ row }" slot="is_enabled">
				<p>
					<span class="enabled-point" @click="switchEnabled(row)">
						<Icon type="ios-checkmark-circle-outline" size="26" color="#50BD7F" v-if="row.is_enabled == 1"/>
						<Icon type="ios-close-circle-outline" size="26" color="#CE3636" v-else />
					</span>
				</p>
			</template>
			<template slot-scope="{ row }" slot="action">
				<p><a @click="addInviteAct(row.id)">编辑</a></p>
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
	<!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </Card>
</template>

<script>
import mixin from './invite-list-mixin.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import salesForm from './invite-list-form';
import statsBack from '@/views/data/components/stats-back';
import PageHelper from '@/libs/page-helper.js';
export default {
	name: 'salesStats',
	mixins: [PageHelper, mixin],
	components: {
		notice,
		salesForm,
		statsBack
	},
	data () {
		return {
			showSpin: true,
			brandId:0,
			brandName: "",
			jobIdCol:[],
			canCreate: {}
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.loadData();
	},
	methods: {
		initParams(){
		},
		onLoadData(page, exteData){
			return this.$ajax.post(this.$api.invitePrizeList, {
				...exteData,
				brand_id: this.brandId || 0, 
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					this.canCreate = data.canCreate;
					this.data = {
						items: data.items || [],
						total: data.total || 0
					}
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			})
		},
		switchEnabled(row){
			this.tableLoading = true;
			return this.$ajax.post(this.$api.invitePrizeState, {
				id: row.id,
				is_enabled: row.is_enabled == 1 ? 0 : 1
			}).then((response)=>{
				let res = response.data || {};
				if(res.code){
					this.$Message.success(res.message);
					return this.loadData();
				} else {
					this.$Message.warning(res.message);
				}
			}).finally(()=>{
				this.tableLoading = false;
			})
		},
		addInviteAct(id){
			this.$router.push({
				name:'invite-prize-detail',
				query: {
					id: id || 0
				}
			})
		}
	}
}
</script>
<style lang="less">
.invite-list-page{
	.enabled-point{
		cursor: pointer;
	}
}
  
</style> 

