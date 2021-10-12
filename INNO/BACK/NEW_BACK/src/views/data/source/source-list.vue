
<template>
  <Card class="visit-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<div class="flex f-just-between f-align-center m-bottom-10">
		<div class="flex">
			选择日期&nbsp;&nbsp;
			<date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd"/>&nbsp;&nbsp;
			<Button type="primary" icon="ios-search" @click="onLoadData">搜索</Button>
		</div>
		<div>
			<Button type="primary" @click="handleExport">
				<Icon type="md-cloud-download" />导出
			</Button>
		</div>
	</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="sourceCol"  :data="tableData" ref="myTable">
		<template slot-scope="{ row }" slot="channel_type">
			{{ row.channel_name }}
		</template>
		<template slot-scope="{ row }" slot="order_convert_rate">
			{{ row.order_convert_rate }}%
		</template>
		<template slot-scope="{ row }" slot="pay_convert_rate">
			{{ row.pay_convert_rate }}%
		</template>
		<template slot-scope="{ row }" slot="action">
			<a @click="getDetail(row.channel_type)">查看</a>
		</template>
	</Table>
	<!--异步处理导出excel组件-->
	<div class="col">
		<notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
	</div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixsource from './mixins/source.js';
import vueUtils from '@/libs/vue-utils.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import statsBack from '@/views/data/components/stats-back';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'source-list',
	mixins: [ PageHelper, mixsource],
	components: {
		DateSelect,
		statsBack,
		notice
	},
	data () {
		return {
			dateRange: ["",""],
			start_time: new Date(),
			end_time: new Date(),
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
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId || 0;
			this.brandName = query.brandName || "";
		},
		onLoadData(page, extraData){
			return util.ajax.post(util.apiUrl.channelView, {
				start_time: this.start_time,
				end_time: this.end_time,
				sortField: "total_uv",
				sortBy: "ASC",
				brand_id: this.brandId || 0,
				...extraData
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
		getDetail(channel_type){
			this.$router.push({
				name: 'channel-stats',
				query: {
					channelType: channel_type,
					brandId: this.brandId,
					brandName: this.brandName
				}
			});
		},
		handleExport() {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.basicChannelViewExport,{
						start_time: this.start_time,
						end_time: this.end_time,
						sortField: "total_uv",
						sortBy: "ASC",
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
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
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

