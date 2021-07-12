
<template>
  <Card class="visit-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<div class="flex f-align-center m-bottom-10">
		选择日期&nbsp;&nbsp;
		<date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd"/>&nbsp;&nbsp;
		<Button type="primary" icon="ios-search" @click="onLoadData">搜索</Button>
	</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="sourceCol"  :data="tableData" ref="myTable">
		<template slot-scope="{ row }" slot="channel_type">
			{{ typeKey[row.channel_type] }}
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
	<Spin size="large" fix v-if="showSpan"></Spin>
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
export default {
	name: 'source-list',
	mixins: [mixsource, PageHelper],
	components: {
		DateSelect,
		statsBack
	},
	data () {
		return {
			dateRange: ["",""],
			start_time: new Date(),
			end_time: new Date(),
			brandId: 0,
			brandName:"",
			showSpan:false,
			typeKey:{//写死对应关系
				NONE: "无",
				OFFIACCOUNT_MSG:"公众号消息",
				MINI_QRCODE:"小程序扫码",
				GROUP_SHARE:"群分享",
				MINIPRO:"其他小程序",
				OFFIACCOUNT_MENU:"公众号菜单",
				OFFIACCOUNT_ARTICLE:"公众号文章",
			}
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.onLoadData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId || 0;
			this.brandName = query.brandName || "";
		},
		onLoadData(page, data){
			this.showSpan = true;
			util.ajax.post(util.apiUrl.channelView, {
				start_time: this.start_time,
				end_time: this.end_time,
				sortField: "total_uv",
				sortBy: "ASC",
				brand_id: this.brandId || 0
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
                    let data = res.data || {};
                    this.data = data;
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			}).finally(()=>{
				this.showSpan = false
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

