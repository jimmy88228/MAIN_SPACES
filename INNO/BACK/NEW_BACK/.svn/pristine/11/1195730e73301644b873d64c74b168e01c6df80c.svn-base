<template>
	<div class="goods_comment">
		<Row type="flex">
			<Col style="flex:1 1 0%;">
				<searchForm :typeIndex="typeIndex" :formSearch="formSearch" @on-search="search" :auth="auth" @examineComments="examineEvent"></searchForm>
			</Col>
			<Col style="width:50px;text-align: right;">
				<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>
		
		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" @on-selection-change="getSelect" >
			<template slot-scope="{ row }" slot="comment_content">
				<p>{{ row.comment_content }}</p>
				<div>
					<p v-for="(item, index) in row.image_arr" class="comment-img">
						<img :src="item" v-viewer/>
					</p>
				</div>
			</template>
			<template slot-scope="{ row }" slot="is_show">
				<i-switch :value="row.is_show" size="large" true-value="1" false-value="0" :disabled="!row.auth.auth_update_show" @on-change="(data)=>changeCommentShow(data, row)">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</template>
			<template slot-scope="{ row }" slot="action">
				<p class="m-bottom-10"> 
					<span v-if="row.is_approved == 1">已审核</span>
					<a v-else @click="examineEvent(row)">待审核</a> 
				</p>
				<p class="m-bottom-10">
					<i-switch v-model="row.comment_type" true-value="1" false-value="2" @on-change="(data)=>changeCommentType(data, row)" class="comment_switch">
						<span slot="open">正面评论&nbsp;<Icon type="md-repeat" size="15"/></span>
						<span slot="close"><Icon type="md-repeat" size="15"/>&nbsp;负面评论</span>
					</i-switch>
				</p>
				<p class="v-lines m-bottom-10">
					<Poptip
					v-if="row.auth.auth_delelte"
					confirm
					title="确定删除该评论吗?"
					@on-ok="removeComment(row)">
					        <a>删除</a> 
					</Poptip><span class="v-line" v-if="row.auth.auth_delelte"> | </span> 
					<a v-if="row.auth.auth_update_reply" @click="getReply(row)">回复</a> <span class="v-line" v-if="row.auth.auth_update_reply"> | </span> 
				</p>
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
		<replyComment ref="replyComment" :typeIndex="typeIndex" @replyCallback="comfirmReply"></replyComment>
		<!-- <Spin v-if="changing" :fix="true" ></Spin> -->
	</div>
</template>

<script>
	import searchForm from './search-form';
	import Mixin from './goods-mixin'; // 测试界面使用的
	import PageHelper from '@/libs/page-helper.js';
	import replyComment from './reply-comment';
	export default {
		props: [ "type", "currTabs" ],
		mixins: [PageHelper, Mixin],
		components: {
			searchForm,
			replyComment
		},
		data() {
			return {
				tableLoading: false,
				tableHeight: 500,
				formSearch: {
					isInit: 1,
					start_time: "",
					end_time : "",
					lost: "",
					reply_message: "",
					is_show_reply: "",
					is_approved: "",
					keyword: "",
				},
				formItem: {
					replyType: 'currentMember',
					replyContent: ''
				},
				ruleValidate: {
					replyContent: [{
						required: true,
						message: '回复内容不能为空',
						trigger: 'blur'
					}]
				},
				showReply: false,
				showReplyId: 0,
				auth: {},
				changing: false,
			}
		},
		computed:{
			typeIndex(){
				let type = this.type;
				return type == "wechat" ? 1 : 2 //(1微商城 2店铺)
			}
		},
		mounted(){},
		methods: {
			onLoadData (page, data) {
			  return this.$ajax.post(this.$api.goodsCommentList, {
					...this.formSearch,
					type: this.typeIndex,
					...data
				})
			  .then(response => {
			    const res = response.data;
			    if (res.code) {
						let data = res.data || {};
						let items = data.items || [];
						for(let i = 0; i < items.length; i++){
							let item = items[i] || {};
							if(item.is_approved == 1){
								item._disabled = true;
							}
							item.image_arr = [];
							for(let j = 0; j < 9; j++){
								if(item['img'+ j +'_path']){
									item.image_arr.push(item['img'+ j +'_path'])
								}
							}
						}
						data.items = items || [];
			      this.data = data;
			      this.auth = res.data && res.data.auth;
			    }
			  });
			},
			search(data){
				this.formSearch = data;
				this.loadData();
			},
			getReply(row){
				if(row.id){
					this.$refs["replyComment"].showModule(row);
				}
			},
			comfirmReply() {
				this.loadData(this.currentPage);
			},
			changeCommentType(val, row){
				let _index = row._index;
				if(this.changing || !row.id) return;
				this.changing = true;
				return this.$ajax.post(this.$api.goodsUpdateCommentType, {
					id: row.id,
					val: val,
					type: this.typeIndex,
				})
				.then(response => {
					let res = response.data || {};
					if(!res.code){
						console.log("res", res)
						row.comment_type = val == 1 ? 2 : 1;
						this.$set(this.tableData, _index, row);
					}
					this.$Message.info(res.message);
				}).catch((error)=>{
					row.comment_type = val == 1 ? 2 : 1;
					this.$set(this.tableData, _index, row);
				}).finally(()=>{
					this.changing = false;
				});
			},
			changeCommentShow(val, row){
				let _index = row._index;
				if(this.changing || !row.id) return;
				this.changing = true;
				return this.$ajax.post(this.$api.goodsUpdateCommentShow, {
					id: row.id,
					val: val,
					type: this.typeIndex,
				}).then(response => {
					let res = response.data || {};
					if(res.code){
						row.comment_type = val ? 1 : 2;
						this.$set(this.tableData, _index, row);
					} else {
						row.is_show = val ? 0 : 1;
						this.$set(this.tableData, _index, row);
					}
					this.$Message.info(res.message);
				}).catch((error)=>{
					row.is_show = val ? 0 : 1;
					this.$set(this.tableData, _index, row);
				}).finally(()=>{
					this.changing = false;
				});
			},
			getSelect(selection, row){
				this.selection = selection;
			},
			examineEvent(row){
				let ids = "";
				if(row.type == "batch"){
					let selection = this.selection || [];
					if(selection.length == 0) { this.$Message.info("请勾选审核数据！"); return; }
					for(let i = 0; i < selection.length; i++){
						ids = ids ? ids + "," + selection[i].id : selection[i].id
					}
				} else if(row.id){
					ids = row.id;
				}
				if(!ids) return;
				this.$Modal.confirm({
					title: "提示",
					content: row.type == "batch" ? "是否批量审核通过" : "是否审核通过",
					onOk:()=>{
						return this.$ajax.post(this.$api.goodsExamineComment, {
							id: ids,
							type: this.typeIndex,
						})
						.then(response => {
							let res = response.data || {};
							if(res.code){
								this.loadData(this.currentPage);
							}
							this.$Message.info(res.message);
						})
					}
				})
			},
			removeComment(row){
				if(this.changing) return;
				this.changing = true;
				return this.$ajax.post(this.$api.goodsDelComment, {
					id: row.id,
					type: this.typeIndex,
				})
				.then(response => {
					let res = response.data || {};
					if(res.code){
						this.loadData(this.currentPage);
					}
					this.$Message.info(res.message);
				}).finally(()=>{
					this.changing = false;
				});
			},
			onCancel() {
				
			}
		}
	}
</script>

<style lang="less">
	.goods_comment{
		.comment_switch{
			width:100px;
			background: none;
			.ivu-switch-inner{
				color:#FE8337;
				left: 19px;
			}
		}
		.comment_switch:after{
			background-color:#FE8337;
			opacity: 0.5;
			display: none;
		}
		.comment_switch.ivu-switch-checked{
			.ivu-switch-inner{
				color:#28A5FF;
				left: 19px;
			}
		}
		.comment_switch.ivu-switch-checked:after{
			left: 78px;
			background:#28A5FF;
		}
		.comment-img{
			display: inline-block;
			margin-right: 10px;
			width: 75px;
			height: 75px;
			padding: 5px;
			overflow: hidden;
			img{
				width:100%;
			}
		}
	}
	
</style>
