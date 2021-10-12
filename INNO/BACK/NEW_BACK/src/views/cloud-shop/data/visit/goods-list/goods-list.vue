
<template>
  <Card class="visit-page">
	<div class="flex f-just-between f-align-center m-bottom-10">
		<div class="flex f-align-center">
			日期&nbsp;&nbsp;
			<date-select ref="dateSelect" defaultTime="yesterday" dateType="report" class="inline-b space-nowrap" @sT="handleStart" @eT="handleEnd" />
			&nbsp;&nbsp;
			<Input
			class=""
			style="width:250px"
			v-model="formSearch.searchq"
			placeholder="请输入品牌名"
			clearable
			search
			enter-button
			@on-search="loadData()"
			@on-clear="loadData()"
			@keydown.native.enter.prevent="loadData()">
				<div slot="prepend">品牌名</div>
			</Input>
		</div>
		<div>
			<Button type="primary" @click="handleExport">导出</Button>
		</div>
	</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="columns"  :data="tableData" ref="myTable">
		<template slot-scope="{ row }" slot="action">
			<a @click="getDetail(row)">查看</a>
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
	  <!--异步处理导出excel组件-->
		<div class="col">
		<notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
		</div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import listMixin from './listMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import screenBrand from '@/views/data/screenBrand/screenBrand.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'goods-stats',
	mixins: [ PageHelper, listMixin],
	components: {
		DateSelect,
		notice
	},
	data () {
		return {
			formSearch: {
				searchq: "",
				start_time:"",
				end_time: ""
			},
			jobIdCol: []
		}
	},
	computed: {},
	mounted(){
		 this.loadData();
	},
	methods: {
		onLoadData(page, data){
            this.showSpan = true;
            let params = {
                ...this.formSearch,
                ...data
            }
			return util.ajax.post(util.apiUrl.goodsVisitList, params).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let limitBrand = screenBrand.limitBrand || [];
					for(let i = 0; i < limitBrand.length; i++){
						for(let j = 0; j < data.list.length; j++){
							if(limitBrand[i].brandId == data.list[j].brand_id && limitBrand[i].brandName == data.list[j].brand_name){
								data.list.splice(j, 1);
								break;
							}
						}
					}
                    this.data = {
						items: data.list,
						total: data.totalCount
					}
				}
			}).finally(()=>{
				this.showSpan = false
			})
		},
		handleStart (date) {
			this.formSearch.start_time = date;
		},
		handleEnd (date) {
			this.formSearch.end_time = date;
		},
		getDetail(item){
			this.$router.push({
				name: 'goods-visit',
				query: {
					brandId: item.brand_id || 0,
					brandName: item.brand_name || ""
				}
			});
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
					return this.$ajax.post(this.$api.GoodsVisitListExport,{
						...formSearch,
						page: 1,
						pageSize: 20
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

