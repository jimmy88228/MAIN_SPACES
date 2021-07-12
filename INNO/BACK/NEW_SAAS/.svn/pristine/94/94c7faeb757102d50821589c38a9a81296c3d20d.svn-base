
<template>
  <Card class="visit-page statistics-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<div class="flex f-align-center m-bottom-10 f-just-between">
		<div class="flex f-align-center">
			选择日期&nbsp;&nbsp;
			<date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd" extra/>&nbsp;&nbsp;
			<Input
			class=""
			style="width:250px"
			v-model="searchq"
			placeholder="标签名称"
			clearable
			search
			enter-button
			@on-search="onLoadData"
			@on-clear="onLoadData"
			@keydown.native.enter.prevent="onLoadData">
			</Input>
			&nbsp;&nbsp;
		</div>
		<div><Button type="primary" icon="md-cloud-download" @click="handleExport">导出</Button></div>
	</div>
	<Divider orientation="left">广告位统计</Divider>
	<div class="notice">*当广告位统计数据较多时，需等待数据加载</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="sourceCol"  :data="tableData" ref="myTable">
	</Table>
	<!--异步处理导出excel组件-->
	  <div class="col">
	    <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
	  </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import mixins from './mixins.js';
import vueUtils from '@/libs/vue-utils.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import statsBack from '@/views/data/components/stats-back';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'adSpace',
	mixins: [PageHelper, mixins],
	components: {
		DateSelect,
		statsBack,
		notice
	},
	data () {
		return {
			searchq: "",
			start_time: new Date(),
			end_time: new Date(),
			sortField: "",
			sortBy: "ASC",
			brandId: 0,
			brandName:"",
			jobIdCol: []
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.loadData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId || 0;
			this.brandName = query.brandName || "";
		},
		onLoadData(page, extedata){
			return util.ajax.post(util.apiUrl.AdSpaceView, {
				start_time: this.start_time,
				end_time: this.end_time,
				sortField: this.sortField,
				searchq: this.searchq,
				sortBy: this.sortBy,
				brand_id: this.brandId || 0,
				...extedata
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
						let data = res.data || {};
						this.data = data;
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			})
		},
		handleStart (date) {
      this.start_time = date;
		},
		handleEnd (date) {
			this.end_time = date;
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
		},
		handleFinish () {
			// 异步下载结束后刷新
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
					return this.$ajax.post(this.$api.AdSpaceExport,{
						start_time: this.start_time,
						end_time: this.end_time,
						searchq: this.searchq,
						brand_id: this.brandId || 0
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
		}
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

