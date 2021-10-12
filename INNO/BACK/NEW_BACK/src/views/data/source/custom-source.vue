
<template>
  <Card class="visit-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<div class="flex f-align-center m-bottom-10 f-just-between">
		<div class="flex f-align-center">
			选择日期&nbsp;&nbsp;
			<date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd"/>&nbsp;&nbsp;
			<Input
			class=""
			style="width:250px"
			v-model="searchq"
			placeholder="推广名称"
			clearable
			search
			enter-button
			@on-search="loadData"
			@on-clear="loadData"
			@keydown.native.enter.prevent="loadData">
			</Input>
			&nbsp;&nbsp;
			<Button type="primary" icon="md-cloud-download" @click="handleExport" v-if="canCreate.export">导出</Button>
		</div>
		<div>
			<Button type="primary" icon="md-add-circle" @click="addCustomEvent" v-if="canCreate.add">新增自定义渠道</Button>
		</div>
	</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="sourceCol"  :data="tableData" ref="myTable">
		<template slot-scope="{ row }" slot="action">
			<div class="v-lines">
				<a @click="getDetail(row.channel_code)">详情</a><span class="v-line"> | </span>
				<a @click="getExtend(row)">推广</a><span class="v-line"> | </span>
				<a @click="getEdit(row)">编辑</a><span class="v-line"> | </span>
				<a @click="detailHandleExport(row)">导出</a><span class="v-line"> | </span>
				<Poptip
					transfer
					confirm
					title="确定移除该渠道？"
					@on-ok="getRemove(row)">
					<a>移除</a>
				</Poptip>
				<span class="v-line"> | </span>
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
	<addCustom ref="addCustom" @editCustomEvent="loadData"></addCustom>
	<!--异步处理导出excel组件-->
	  <div class="col">
	    <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
	  </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixins from './mixins/custom.js';
import vueUtils from '@/libs/vue-utils.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import statsBack from '@/views/data/components/stats-back';
import addCustom from './add-custom.vue';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'source-list',
	mixins: [PageHelper, mixins],
	components: {
		DateSelect,
		statsBack,
		addCustom,
		notice,
	},
	data () {
		return {
			searchq: "",
			start_time: new Date(),
			end_time: new Date(),
			brandId: 0,
			brandName:"",
			jobIdCol: [],
			canCreate: {},
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
		onLoadData(page, exteData){
			return util.ajax.post(util.apiUrl.customChannelView, {
				start_time: this.start_time,
				end_time: this.end_time,
				searchq: this.searchq,
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
		addCustomEvent(){
			this.$refs["addCustom"].showModal();
		},
		handleStart (date) {
        this.start_time = date;
		},
		handleEnd (date) {
				this.end_time = date;
		},
		getDetail(channel_code){
			this.$router.push({
				name: 'custom-channel-details',
				query: {
					channel_code: channel_code,
					brandId: this.brandId,
					brandName: this.brandName
				}
			});
		},
		getEdit(row){
			this.$refs["addCustom"].showModal(row);
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
		},
		getExtend(row){
			let info = this.editRow(row) || {};
			this.$UIModule({
				mode: "code-view",
				props: {
					title: "选择小程序",
					codeTitle: "小程序二维码",
				},
				options: {
					...info
				}
			})
			// this.extendRow = row || {}
			// this.$refs["extendCode"].showModal();
		},
		getRemove(row){
			this.tableLoading = true;
			return util.ajax.post(util.apiUrl.customChannelRemove, {
				id: row.id
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					this.loadData();
					this.$Message.warning(res.message);
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			})
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
					return this.$ajax.post(this.$api.customChannelExport,{
						start_time: this.start_time,
						end_time: this.end_time,
						searchq: this.searchq,
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
		detailHandleExport(row){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.customChannelDATAExport,{
						start_time: this.start_time,
						end_time: this.end_time,
						searchq: this.searchq,
						brand_id: this.brandId || 0,
						code: row.channel_code,
						sortField: "",
						sortBy: "ASC"
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
		editRow(row){
			let page_path = row.page_path || "";
			let pathsArr = [], paramsArr = [], paramsJson = {};
			try{
				pathsArr = page_path.split("?");
				paramsArr = pathsArr[1].split("&");
				for(let i = 0; i < paramsArr.length; i++){
					let params = paramsArr[i].split("=");
					paramsJson[params[0]] = params[1]
				}
			}catch(e){
				//TODO handle the exception
			}
			return {
				path: pathsArr[0],
				params: paramsJson
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

