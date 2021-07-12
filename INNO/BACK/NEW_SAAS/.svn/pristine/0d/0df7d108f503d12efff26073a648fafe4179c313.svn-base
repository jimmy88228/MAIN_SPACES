<style lang="less">
.goods-search-form{
	.ivu-form-item{
        margin-bottom: 10px;
    }
	.ivu-input-icon-clear{
		right:50px;
	}
	.basic_cascader{
		display: inline-block;
		width: 260px;
	}
	.goods-search_input{
		width:320px;
		.goods-search_select{
			width: 100px;
		}
	}
	.common_inline{
		display: inline-block;
	}
}
</style>

<template>
	<div class="goods-search-form">
		<Form ref="formSearch" :model="formSearch" :label-width="90" label-colon>
			<div class="flex f-just-between">
				<div>
					<div class="flex">
						<FormItem label="评论日期" class="common_inline">
							<date-select ref="dateSelect" :customDate="[formSearch.start_time, formSearch.end_time]" transfer @sT="(date)=>handleStart(null, date)" @eT="(date)=>handleEnd(null, date)"/>
						</FormItem>
						&nbsp;&nbsp;
						<a class="space-nowrap" style="display:inline-block;margin-top:6px;" @click="isShowExtra = !isShowExtra">{{ isShowExtra ? "普通搜索" :"高级搜索" }}</a>
					</div>
					<transition name="fade">
						<div v-show="isShowExtra">
							<FormItem label="正反面过滤" class="common_inline">
								<Select transfer v-model="formSearch.lost">
									<Option :value="0">全部评价</Option>
									<Option :value="1">正面评价</Option>
									<Option :value="2">负面评价</Option>
									<Option :value="3">自主评价</Option>
								</Select>
							</FormItem>
							<FormItem label="是否回评" class="common_inline">
								<Select transfer v-model="formSearch.reply_message">
									<Option :value="0">全部</Option>
									<Option :value="1">已回评</Option>
									<Option :value="2">未回评</Option>
								</Select>
							</FormItem>
							<FormItem label="回评状态" class="common_inline">
								<Select transfer v-model="formSearch.is_show_reply">
									<Option :value="0">全部</Option>
									<Option :value="1">仅会员</Option>
									<Option :value="2">所有会员</Option>
								</Select>
							</FormItem>
							<FormItem label="审核状态" class="common_inline">
								<Select transfer v-model="formSearch.is_approved">
									<Option :value="0">全部</Option>
									<Option :value="1">已审核</Option>
									<Option :value="2">未审核</Option>
								</Select>
							</FormItem>
						</div>
					</transition>
				</div>
				<div>
					<div class="flex">
					<FormItem class="common_inline">
						<div class="flex">
							<Button type="primary" v-if="auth.export" @click="handleExport('isReply')">导出已评论</Button>&nbsp;
							<Button type="primary" v-if="auth.export" @click="handleExport('isNoReply')">导出未评论</Button>&nbsp;
							<Button type="primary" v-if="auth.add_self" @click="addComment">添加自主评论</Button>&nbsp;
							<Button type="primary" v-if="auth.examine" @click="examineComments">批量审核</Button>
						</div>
					</FormItem>
					</div>
					<div class="text-r">
						<FormItem :label-width="0" class="common_inline">
							<Input
								class="goods-search_input"
								v-model="formSearch.keyword"
								placeholder="请输入关键字"
								clearable
								search
								enter-button
								transfer
								@on-search="searchPage"
								@on-clear="searchPage"
								@keydown.native.enter.prevent="searchPage">
								<Select v-model="formSearch.type" slot="prepend" class="goods-search_select" transfer>
									<Option :value="1">商品名字</Option>
									<Option :value="2">商品款号</Option>
									<Option :value="3">订单编号</Option>
									<Option :value="4">会员卡号</Option>
									<Option :value="5">评论内容</Option>
								</Select>
							</Input>
						</FormItem>
					</div>
				</div>
			</div>
    </Form>
		<addSelfComment ref="addSelfComment" :typeIndex="typeIndex"></addSelfComment>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="" v-for="item in jobIdCol" :key="item"></notice>
		</div>
		<!--export time-->
		<Modal v-model="isExportTime">
			<div>
				订单日期： <date-select ref="dateSelect" :customDate="exportTime" transfer @sT="(date)=>handleStart('export', date)" @eT="(date)=>handleEnd('export', date)"/>
			</div>
			<div slot="footer">
					<Button type="default" @click="showM = false">取消</Button>
					<Button type="primary" @click="confirmExport">{{exportCommentType == "isNoReply" ? '导出未评论' : '导出已评论'}}</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import addSelfComment from './add-self-comment';
import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
  name: 'searchForm',
	provide() {
		return {
			searchPage: this.searchPage
		}
	},
  props: {
		formSearch: {
			type: Object,
			default:{
				isInit: 1,
				start_time: "",
				end_time : "",
				lost: "",
				reply_message: "",
				is_show_reply: "",
				is_approved: "",
				keyword: "",
				type: 1
			}
		},
		typeIndex: {
			type: Number,
			default: 1
		},
		auth: {},
	},
	components:{
		DateSelect,
		addSelfComment,
		notice
	},
  data () {
    	return {
				isShowExtra: false,
				jobIdCol: [],
				exportTime: [],
				exportCommentType: "",
				isExportTime: false,
    	}
   	},
   	methods: {
		addComment(){
			this.$refs['addSelfComment'].showModule();
		},
		examineComments(){
			this.$emit("examineComments", {type: 'batch'});
		},
    searchPage () {
    		this.$emit('on-search', this.formSearch);
    },
		handleStart(type, date){
			if(type == "export"){
				this.exportTime[0] = date;
			} else {
				this.formSearch.start_time = date;
			}
		},
		handleEnd(type, date){
			if(type == "export"){
				this.exportTime[1] = date;
			} else {
				this.formSearch.end_time = date;
			}
		},
		handleExport (type) {
			this.isExportTime = true;
			this.exportCommentType = type;
		},
		confirmExport(){
			if(this.exportCommentType == "isNoReply"){
				if(this.exportTime.length < 2){
					this.$Message.info("请设置选择时间！");
					return;
				}
			}
			return this.$ajax.post(this.$api.CloudGoodsExportComment,{
				...this.formSearch,
				start_time: this.exportTime[0],
				end_time: this.exportTime[1],
				comment_type: this.exportCommentType == "isReply" ? 0 : 1,
				type: this.typeIndex
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
			}).finally(()=>{
				this.isExportTime = false;
			})
		}
  },
  watch: {}
}
</script>
