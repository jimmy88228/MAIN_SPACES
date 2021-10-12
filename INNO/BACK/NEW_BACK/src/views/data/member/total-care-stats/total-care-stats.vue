<style lang="less" scoped>
	.chart-boxs{
		.chart-box{
			width:100%;
			border-radius: 10px;
			border:1px solid #efefef;
			padding:10px;
		}
		.chart-cont{
			width:100%;
			height:300px;
		}
	}
</style> 
<template>
  <Card class="member-total-detail statistics-page">
			<page-form
			:formSearch="formSearch"
			@on-search="searchData" 
			@on-handleExport="handleExport"
			></page-form>
			<!-- <Divider orientation="left">会员总数</Divider> -->


			<Table :columns="columns" :height="tableHeight" :data="tableData"></Table>
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
			<Spin :fix="true" v-if="showSpan"></Spin>
			<!--异步处理导出excel组件-->
			<div class="col">
				<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
			</div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import sourceMixin from './careMixin.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import PageHelper from '@/libs/page-helper.js';
import pageForm from './searchForm';
export default {
	name: 'totalDynamicStats',
	mixins: [ PageHelper, sourceMixin],
	components: { pageForm, notice },
	data () {
		return {
			formSearch: {
				start_time: "",
				end_time: ""
			},
			totalData: [
				{
					name: "新增会员数",
					data: "0",
					key:"total_reg_user"
				},
				{
					name: "会员总数",
					data: "0",
					key:"end_total_user"
				}
			],
			dynamicChart: null,
			jobIdCol:[],
			showSpan: false
		}
	},
	computed: {
		agentId(){
			let formSearch = this.formSearch || {};
			return formSearch.agentId.slice(-1)[0] || 0;
		}
	},
	mounted(){
		 this.loadData();
	},
	methods: {
		
	  onLoadData(page, data){
      this.showSpan = true;
			return util.ajax.post(util.apiUrl.userUserCareStatsView, {
				...this.formSearch,
				...data
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
          			this.data = {
						items: data.items,
						total: data.items.length
					}
				}
			}).finally(()=>{
				this.showSpan = false
			})
		},
		searchData(){
			this.loadData();
		},
		handleFinish () {
			this.loadData();
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.formSearch;
					return this.$ajax.post(this.$api.userCareStatsExport,{
						...formSearch,
                        start_time: this.formSearch.start_time,
                        end_time: this.formSearch.end_time,
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
					});
				}
			});
		}
	}
}
</script>

