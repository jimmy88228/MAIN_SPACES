
<script src="listMixin.js"></script>
<template>
  <Card class="visit-page">
      <div class="flex f-just-between f-align-center m-bottom-10">
		<div class="flex f-align-center">
			<div class="select_list_box">
				<div class="select_title">创建时间</div>
				<DatePicker v-model="formSearch.start_end_time" type="datetimerange" placeholder="请输入创建时间" transfer></DatePicker>
			</div>

			<div class="select_list_box">
				<div class="select_title">到期时间</div>
				<DatePicker v-model="formSearch.start_end_time1" type="datetimerange" placeholder="请输入到期时间" transfer></DatePicker>
			</div>

			<div class="select_list_box">
				<div class="select_title">跟进人</div>
				<Input v-model="formSearch.keywordsPeo" clearable placeholder="请输入跟进人..." style="width: 150px" />
			</div>

			<div class="select_list_box">
				<div class="select_title">系统模块</div>
				<Select v-model="formSearch.send_type" style="width:110px" clearable>
					<Option value="0">全部</Option>
					<Option value="9">小程序</Option>
					<Option value="6">微会员</Option>
					<Option value="8">CRM</Option>
					<Option value="10">数字屏</Option>
				</Select>
			</div>

			<div class="select_list_box">
				<div class="select_title">&nbsp;&nbsp;</div>
				<Input
						class=""
						style="width:250px"
						v-model="formSearch.searchq"
						placeholder="请输入品牌中文或品牌英文"
						clearable
						search
						enter-button
						@on-search="loadData()"
						@on-clear="loadData()"
						@keydown.native.enter.prevent="loadData()">
				</Input>
			</div>

			<div class="select_list_box">
				<div class="select_title">&nbsp;&nbsp;</div>
				<div class="search_box">
					<Button type="primary" @click="handleExport">导出</Button>
				</div>
			</div>
			<!--<Button type="primary" @click="getDetail(0)" style="margin-top:25px;">+添加</Button>-->
		</div>
	</div>
	<Table :loading="tableLoading" :height="tableHeight" :columns="columns"  :data="tableData" ref="myTable">
		<template slot-scope="{ row }" slot="expireTimes">
			<div v-if="row.expire_times.length > 0">
				<p style="margin: 10px auto;" v-for="ite in row.expire_times">{{ite.license_name}} : {{ite.expiry_date}}</p>
			</div>
			<div v-else>-</div>
		</template>
		<template slot-scope="{ row }" slot="createTime">
			<p>{{row.create_time | initDate}}</p>
			<p>{{row.create_time | initTime}}</p>
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
// import screenBrand from '@/views/data/screenBrand/screenBrand.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'conversion-stats',
	mixins: [ PageHelper, listMixin],
	components: {
		DateSelect,
		notice
	},
	data () {
		return {
			formSearch: {
				searchq: "",
                send_type: '0',
                start_end_time: [],
                start_end_time1: [],
                keywordsPeo: ''
			},
			jobIdCol:[]
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
			return util.ajax.post(util.apiUrl.brandInfoList, params).then(e =>{
				let res = e.data || {}; console.log('返回结果：', res);
				if(res.code) {
					let data = res.data || {};
					/*let limitBrand = screenBrand.limitBrand || [];
					for(let i = 0; i < limitBrand.length; i++){
						for(let j = 0; j < data.list.length; j++){
							if(limitBrand[i].brandId == data.list[j].brand_id && limitBrand[i].brandName == data.list[j].brand_name){
								data.list.splice(j, 1);
								break;
							}
						}
					}*/
                    this.data = {
						items: data.items,
						total: data.total
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
		//start_time_end end_time_end
		handleStartTimeEnd (date) {
			this.formSearch.start_time_end = date;
		},
		handleEndTimeEnd (date) {
			this.formSearch.end_time_end = date;
		},
		getDetail(item){
			this.$router.push({
				name: 'brand-list-edit',
				query: {
					id: item.brand_id || 0,
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
					return this.$ajax.post(this.$api.brandInfoExport,{
						...formSearch,
						page: 1,
						pageSize: 20
					}).then((response) => {
							var res = response.data; console.log('导出：', res);
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
	.select_list_box {
		padding: 0 10px 10px 0;
		display: inline-block;
		vertical-align: top;
	}
	.select_title {
		padding: 8px 0;
		color: #777;
		text-align: left;
	}

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

