
<template>
  <Card class="visit-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<div class="flex f-align-center m-bottom-10 f-just-between">
		<div class="flex f-align-center">
			选择日期&nbsp;&nbsp;
			<date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd"/>&nbsp;&nbsp;
			<Button type="primary" @click="loadData">
				<Icon type="md-search" /> 搜索</Button>
		</div>
		<div>
			<Button type="primary" @click="handleExport">
				<Icon type="md-cloud-download" />导出
			</Button>
		</div>
	</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="sourceCol"  :data="tableData" ref="myTable">
		<template slot-scope="{ row }" slot="action">
			<div class="v-lines">
				<a @click="getDetail(row.qrcode_type)">详情</a>
			</div>
		</template>
	</Table>
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
	<!--异步处理导出excel组件-->
	  <div class="col">
	    <notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
	  </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixins from './mixins/code.js';
import vueUtils from '@/libs/vue-utils.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import statsBack from '@/views/data/components/stats-back';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'source-list',
	mixins: [PageHelper, mixins],
	components: {
		DateSelect,
		statsBack,
		notice,
	},
	data () {
		return {
			formSearch:{
				start_time: new Date(),
				end_time: new Date(),
				sortField: "",
				sortBy: "DESC"
			},
			brandId: 0,
			brandName:"",
			jobIdCol: [],
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.loadData();
	},
	computed:{
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = parseInt(query.brandId) || 0;
			this.brandName = query.brandName || "";
		},
		onLoadData(page, exteData){
			return util.ajax.post(util.apiUrl.codeChannelView, {
				...this.formSearch,
				brand_id: this.brandId || 0,
				...exteData
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					this.data = data;
					this.canCreate = data.canCreate || {};
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			})
		},
		handleStart (date) {
        this.formSearch.start_time = date;
		},
		handleEnd (date) {
				this.formSearch.end_time = date;
		},
		getDetail(qrcode_type){
			this.$router.push({
				name: 'code-channel-details',
				query: {
					qrcode_type: qrcode_type,
					brandId: this.brandId,
					brandName: this.brandName
				}
			});
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.codeChannelViewExport,{
						...this.formSearch,
						brand_id: this.brandId || 0,
					}).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
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
		},
	}
}
</script>
<style lang="less">
.visit-page{
	.model-area{
		border:1px solid #efefef;
		text-align:center;
		padding:20px;
		border-radius: 10px;
		margin-bottom:20px;
		.total-name{
		font-size: 16px;
		margin-bottom:10px;
		}
		.total-val{
		font-weight:bold;
		}
		.data-chart{
		width:100%;
		height:400px;
		}
	}
	.operate-area{
		background-color:#efefef;
	}
}
  
</style> 

