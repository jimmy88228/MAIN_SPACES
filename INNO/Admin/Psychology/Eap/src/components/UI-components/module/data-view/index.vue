<template>
	<Modal v-model="isShowModal" :title="title" class-name="staff-data-modal" :width="width">
		<div slot="header" class="flex f-just-between f-align-center" v-if="typeList.length">
			<div class="fw-bold">{{title}}</div>
			<div class="inputClassBox" style="margin-right:30px;">
				<Input
				    class="inputClass"
				    :value="formSearch.searchq" 
				    placeholder="请输入关键字,多以逗号分隔"
				    clearable
				    search
				    enter-button
				    @on-search="searchPage"
				    @on-clear="searchPage"
				    @keydown.native.enter.prevent="searchPage">
						<Select slot="prepend" v-model="formSearch.typeIndex" style="width:130px;">
							<Option :value="index" v-for="(item, index) in typeList" :key="item.id">{{item.name}}</Option>
						</Select>
				</Input>
			</div>
		</div>
		<div class="m-bottom-10" v-if="isSelection">
			<!-- <Checkbox :value="selectPageAll" @on-change="selectPageAllEvent">选择当前页</Checkbox> -->
			<Checkbox :value="selectAll" @on-change="selectAllEvent">全部选择</Checkbox>
			<Button type="warning" size="small" @click="remove" :disabled="selectData.length == 0">批量删除</Button>
		</div>
		<Table :columns="tableColumns" :data="tableData" :loading="tableLoading" :height="500" ref="myTable" @on-selection-change="tableSelectChange"></Table>
		<div v-show="total" class="list_page">
		  <Page
		    :total="total"
		    :page-size="pageSize"
		    :current="currentPage"
		    :page-size-opts="pageSizeOpts"
		    @on-change="e => changePage(e)"
		    @on-page-size-change="ps => handlePageSize(ps)"
		    show-elevator
		    show-total
		    show-sizer></Page>
		</div>
		<div slot="footer">
			<Button @click="onCancel">取消</Button>
			<Button @click="onOk" type="primary">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import Conf from '@/config/index.js';
	export default{
		props: {
			width: {
				type: String | Number,
				default(){
					return 800
				}
			},
			columns: {
				type: Array,
				default(){
					return []
				}
			},
			title: {
				type: String,
				default(){
					return ""
				}
			},
			isSelection: {
				type: Boolean,
				default(){
					return false
				}
			},
			idKey: {
				type: String,
				default(){
					return 'id'
				}
			},
			
		},
		data(){
			return {
				viewData: [],
				isShowModal: false,
				pageSizeOpts: Conf.PAGE_SIZE_OPTS,
				pageSize: Conf.PAGE_SIZE_OPTS[0],
				currentPage: 1,
				tableLoading: false,
				selectPageAll: false,
				selectAll: false,
				selectData: [],
				//
				formSearch: {
					searchq: '',
					typeIndex: 1
				},
				typeList: []
			}
		},
		computed:{
			tableData(){
				let viewData = this.viewData || [];
				let page = this.currentPage;
				let pageSize = this.pageSize;
				let tableData = [];
				let formSearch = this.formSearch || {};
				let filterData = [];
				this.tableLoading = true;
				if(formSearch.searchq){
					let typeKey = this.typeList[formSearch.typeIndex].key;
					let searchqArr = formSearch.searchq.split(",");
					for(let i = 0; i < viewData.length; i++){
						let typeKeyValue = viewData[i][typeKey];
						if(searchqArr.length > 0){
							let hasKey = false;
							for(let j = 0; j < searchqArr.length; j++){
								let searchq = searchqArr[j] || '';
								if(searchq && typeKeyValue.indexOf(searchq) != -1){
									hasKey = true;
									break;
								}
							}
							if(hasKey) filterData.push(viewData[i]);
						}
					}
				} else {
					filterData = viewData;
				}
				if(page && pageSize){
					let lIndex = page - 1 ? (page - 1) * parseInt(pageSize) : 0;
					let rIndex = parseInt(page) * parseInt(pageSize);
					tableData = filterData.slice(lIndex, rIndex);
				} else {
					tableData = filterData;
				}
				setTimeout(()=>{
					this.tableLoading = false;
				}, 200);
				console.log("tableData",tableData);
				return tableData;
			},
			tableColumns(){
				let isSelection = this.isSelection || false;
				let columns = this.columns || []
				if(isSelection){
					columns.unshift({
						type: 'selection',
						width: 60
					})
				}
				return columns;
			},
			selectIds(){
				let selectData = this.selectData || [];
				let ids = []
				for(let i = 0; i < selectData.length; i++){
					let keyValue = selectData[i][this.idKey];
					if(keyValue){
						ids.push(keyValue)
					}
				}
				return ids;
			},
			total(){
				let viewData = this.viewData || [];
				if((!this.tableData || this.tableData.length == 0) && this.currentPage > 1){
					this.changePage(this.currentPage - 1)
				}
				return viewData.length;
			}
		},
		methods:{
			showModal({viewData, total, page, pageSize, search}){
				this.isShowModal = true;
				this.viewData = viewData || [];
				if(this.isSelection){
					this.installTableData(viewData);
				}
				this.currentPage = page;
				this.pageSize = pageSize;
				this.typeList = search.typeList || [];
				if(search.default == 0 || search.default){ // 搜索设置默认类型
					this.formSearch.typeIndex = search.default;
				}
			},
			changePage(page){
				this.currentPage = page
			},
			handlePageSize(ps){
				this.pageSize = ps
			},
			searchPage(value){
				this.formSearch.searchq = value;
			},
			tableSelectChange(selection){
				this.selectData = selection || [];
			},
			selectPageAllEvent(state){
				this.setSelectState(true, false);
				let tableData = this.tableData || [];
				this.selectData = state ? tableData : [];
				this.$nextTick(()=>{
					let viewData = this.viewData || [];
					this.installTableData(viewData, state, this.selectIds);
				})
			},
			selectAllEvent(state){
				this.setSelectState(false, true);
				let viewData = this.viewData || [];
				let data = this.installTableData(viewData, state);
				this.selectData = state ? data : [];
			},
			remove(){
				if(this.selectData.length == 0){
					this.$Message.warning("请勾选删除项！");
					return;
				}
				let viewData = this.viewData || [];
				let data = [];
				for(let i = 0; i  < viewData.length; i++){
					let dataKey = viewData[i][this.idKey];
					if(!dataKey || this.selectIds.indexOf(dataKey) == -1){
						data.push(viewData[i]);
					}
				}
				this.setSelectState(false, false);
				this.selectData = [];
				this.viewData = data;
			},
			installTableData(data, checkState, selectIds){
				selectIds = selectIds || [];
				if(data instanceof Array){
					for(let i = 0; i  < data.length; i++){
						if(selectIds.length > 0){
							let dataKey = data[i][this.idKey];
							if(dataKey && selectIds.indexOf(dataKey) != -1){
								this.$set(this.viewData[i], '_checked', checkState || false);
							} else {
								this.$set(this.viewData[i], '_checked', false);
							}
						} else {
							this.$set(this.viewData[i], '_checked', checkState || false);
						}
					}
				}
				return data
			},
			setSelectState(page, all){
				this.selectAll = all ? true : false;
				this.selectPageAll = page ? true : false;
			},
			onOk(){
				this.isShowModal = false;
				this.$emit("success", { data: this.viewData });
			},
			onCancel(){
				this.isShowModal = false;
				this.$emit("fail");
			}
		},
		watch:{
			pageSize(nV){
				if(this.selectPageAll){
					this.$nextTick(()=>{
						this.selectPageAllEvent(true);
					})
				}
			}
		}
	}
</script>
<style lang="less">
	.staff-data-modal{
		.ivu-modal-body{
			// height: calc(100vh - 300px);
			overflow-x: hidden;
			overflow-y: auto;
		}
	}
	.inputClassBox{
		.ivu-input{
			width: 200px;
		}
	}
</style>