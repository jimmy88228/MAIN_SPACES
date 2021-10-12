
<template>
  <Card class="visit-page statistics-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<sales-form
	:formSearch="formSearch"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></sales-form>
	<div class="span-parent">
		<div class="model-area">
		<Row type="flex" justify="center" >
			<div class="total-item" v-for="(item, index) in totalData" :key="index">
				<p class="total-name">{{ item.name }}</p>
				<p class="total-val">{{ item.data }}</p>
			</div>
		</Row>
		</div>
		<div class="flex divider-area">
			<Divider class="i-flex" orientation="left">详细数据</Divider>
			<div class="operate-btn">
				<Button type="primary" @click="handleExport">导出</Button>
			</div>
		</div>
		<Table :max-height="600" :columns="columns" :data="tableData" ref="myTable"></Table>
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
		<Spin :fix="true" v-if="showSpin"></Spin>
	</div>
	<!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixin from './returnMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import salesForm from './search-form/return-stats-form';
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
			formSearch:{
					start_time: "",
					end_time: ""
			},
			showSpin: true,
			brandId:0,
			brandName: "",
			jobIdCol:[]
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
			this.showSpin = true;
			return util.ajax.post(util.apiUrl.salesRetunView, {
				...this.formSearch,
				...exteData,
				brand_id: this.brandId || 0, 
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					for(let i = 0; i < this.totalData.length; i++){
						let key = this.totalData[i].key || "";
						this.totalData[i].data = data[key] || 0;
					}
					this.data = {
						items: data.items || [],
						total: data.total || 0
					}
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
			}).finally(()=>{
				this.showSpin = false
			})
		},
		searchData(formData){
			this.formSearch = formData || this.formSearch;
			this.loadData();
		},
		handleFinish () {
			// 异步下载结束后刷新
			this.searchData();
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.formSearch;
					return this.$ajax.post(this.$api.salesRetunExport,{
						...formSearch,
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
	.divider-area{
		width:100%;
		align-items: center;
		.i-flex{
			min-width: unset;
		}
		.operate-btn{
			margin-left:40px;
			margin-right:20px;
		}
	}
}
  
</style> 

