<style lang="less">
  
</style> 

<template>
  <div>
		<div>
			<Tabs type="card" name="comment-tab" :value="currTab" @on-click="changeTab">
					<TabPane tab="comment-tab" :label="item.name" v-for="(item, index) in commentTabs" :key="item.key">
						<Table :height="tableHeight" :data="commentData[index].tableData" :columns="commentData[index].columns" :loading="commentData[index].tableLoading"></Table>
						<div v-show="commentData[index].pageTotal" class="list_page">
						  <Page
						    :total="commentData[index].pageTotal"
						    :page-size="pageSize"
						    :current="commentData[index].currentPage"
						    :page-size-opts="pageSizeOpts"
						    @on-change="e => _changePage(e)"
						    @on-page-size-change="ps => _handlePageSize(ps)"
						    show-elevator
						    show-total
						    show-sizer></Page>
						</div>
					</TabPane>
			</Tabs>
		</div>
  </div>
</template>

<script>
import Conf from '@/config/index.js';
import commentMixin from '../mixin/commentMixin.js';
import PageHelper from '@/libs/page-helper.js';
export default {
	name: 'commentCommentModule',
	mixins:[PageHelper, commentMixin],
	props: {
		commentType: {
			type: String,
			default(){
				return ''
			}
		},
		commentTabs: {
			type: Array,
			default(){
				return [];
			}
		},
		currTab: {
			type: Number,
			default(){
				return 0;
			}
		}
	},
	components: {},
	data () {
		return {
			commentData: [],
		}
	},
	computed:{
		pageSize(){
			return  (this.$store && this.$store.state && this.$store.state.app.pageSize) || Conf.PAGE_SIZE_DEF;
		}
	},
	methods: {
		changeTab(index){
			this.$nextTick(()=>{
				this.setTableH();
			})
			this.$emit("changeTab", index);
		},
		setLoading(status){
			let currTab = this.currTab || 0;
			this.commentData[currTab].tableLoading = status ? true : false;
		},
		setData(data){
			let currTab = this.currTab || 0;
			this.commentData[currTab].tableData = data.items;
			this.commentData[currTab].pageTotal = data.total;
			this.commentData[currTab].currentPage = data.page;
			this.$nextTick(()=>{
				this.setTableH();
			})
		},
		// 切换页码
		_changePage (page) {
			this.$emit("changePage", {
				page: page,
				pageSize: this.pageSize
			});
		},
		_handlePageSize(ps){
			this.pageSize = ps;
			this.$emit("changePage", {
				page: 1,
				pageSize: ps
			});
		}
	},
	watch:{
		'commentTabs': {
			handler(nV){
				let commentData = [];
				if(nV.length > 0){
					for(let i = 0; i < nV.length; i++){
						let key = nV[i].key;
						let columns = [];
						if(key){
							switch(key){
								case 1:
									columns = this.goodsTotalCol || []
									break;
								case 2:
									columns = this.goodsDetailCol || []
									break;
								case 3:
									columns = this.serviceTotalCol || []
									break;
								case 4:
									if(this.commentType == 'goods'){
										this.serviceDetailCol.splice(1, 0, ...this.goodsServiceDetailCol);
									} else if(this.commentType == 'store'){
										this.serviceDetailCol.splice(1, 0, ...this.storeServiceDetailCol);
									}
									columns = this.serviceDetailCol || []
									break;
							}
							commentData.push({
								currentPage: 1,
								tableHeight: 500,								tableData: [],								columns: columns,								pageTotal: 0,
								tableLoading: false
							})
						}
					}
					this.commentData = commentData;
				}
				
			},
			immediate: true
		}
	}
}
</script>