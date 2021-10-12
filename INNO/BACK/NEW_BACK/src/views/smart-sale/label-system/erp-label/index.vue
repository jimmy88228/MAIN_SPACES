<template>
  <div class="label-list">
    <Card>
      <list-head title="ERP标签" ref="listHead" @on-labelHandle="labelHandle" @on-groupHandle="groupHandle" @on-success="successHandle" :catArr="catArr" :canAction="canCreate"></list-head>
      <div>
        <Table :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
          <template slot-scope="{ row }" slot="cat_name">
            <div>{{row.cat_name}}<Icon v-if="row.handle.catedit" style="cursor:pointer;" type="ios-create-outline" @click="editCatHandle(row)" /></div>
          </template>
          <template slot-scope="{ row }" slot="is_enabled">
            <Icon type="ios-close-circle-outline" size="30" color="#CE3636" v-if="row.is_enabled == '1'"/>
            <Icon type="ios-checkmark-circle-outline" size="30" color="#52BD80" v-else/>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="action_area">
              <template v-if="row.handle && row.handle.edit">
                <a @click="editHandle(row)">编辑</a>
                <Divider type="vertical" />
              </template>
              <template v-if="row.handle && row.handle.remove">
                <a @click="delHandle(row)">删除</a>
                <Divider type="vertical" />
              </template>
            </div>
          </template>
          <template slot-scope="{ row }" slot="user_total">
            <a v-if="row.user_total || row.user_total == 0" @click="checkUsers(row)">{{ row.user_total }}</a>
          </template>
        </Table>
      </div>
      <div class="list_page">
          <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="changePage"
            @on-page-size-change="handlePageSize"
            show-total
            show-elevator
            show-sizer></Page>
        </div>
    </Card>
    <add-label-modal ref="add-label-modal" @on-submitLabel="submitLabel"></add-label-modal>
    <group-model ref="group-model" @on-submitGroup="submitGroup"></group-model>
    <Spin size="large" fix v-if="showSpan"></Spin>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import listHead from '../components/list-head';
import PageHelper from '@/libs/page-helper.js';
import mixin from '../mixins/erpMixin.js';
import addLabelModal from './addLabel';
import groupModel from '../components/group-model';
import BatchImport from '@/views/my-components/batch-import/batch-import';
export default {
  name: 'manualLabel',
  mixins: [PageHelper, mixin],
  components: {
    listHead,
    addLabelModal,
    groupModel,
    BatchImport
  },
  
  data () {
    return {
      canCreate: {},
      showSpan:true,
      catArr:[],
      formSearch:{
        cat_ids:[],
        searchq:'',
      },
    }
  },
  mounted(){
		 this.loadData();
	},
  methods: {
    onLoadData(page, reqData){
      this.showSpan = true;
      let params={
        cat_ids: this.formSearch.cat_ids,
        searchq: this.formSearch.searchq,
        ...reqData
      }
			return util.ajax.post(util.apiUrl.ErpTagLabelList, params).then(e =>{
				let res = e.data || {};
				if(res.code) {
          let data = res.data || {};
          let items = data.items || [];
          this.catArr = data.cat_arr;
          this.canCreate = data.canCreate;
          this.data = {
						items: items,
						total: data.total
					}
				}
			}).finally(()=>{
				this.showSpan = false
			})
		},
    editCatHandle(row){
      let cat_row={
        id:row.cat_id,
        cat_name:row.cat_name,
      }
      this.$refs["group-model"].showModal(cat_row);
    },
    editHandle(row){
      this.$refs["add-label-modal"].showModal(row);
    },
    delHandle(row){
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除？",
        onOk: ()=>{
          submitRemoveReq.call(this, row);
        }
      })
    },
    labelHandle(){
      this.$refs["add-label-modal"].showModal();
    },
    groupHandle(){
      this.$refs["group-model"].showModal();
    },
    submitLabel(returnData){
      if(!returnData.formData) return;
      if(returnData.editId){
        submitEditReq.call(this, returnData);
      } else {
        submitLabelReq.call(this, returnData.formData);
      }
    },
    submitGroup(returnData){
      console.log("xsdsdsd", returnData);
      if(!returnData.formData) return;
      if(returnData.editId){
        submitEditReq.call(this, returnData);
      }else{
        submitGroupReq.call(this, returnData.formData)
      }
    },
    successHandle(searchqData){
      this.formSearch.cat_ids=searchqData.cat_id;
      this.formSearch.searchq=searchqData.searchq;
      this.loadData();
    },
    checkUsers(row){
      this.$router.push({
				name: 'erp-tag-label-member',
				query: {
          tag_id: row.id
        }
			});
    }
  },
}
//add group
function submitGroupReq(data){
  this.showSpan = true;
  return util.ajax.post(util.apiUrl.ErpTagLabelAddGroup, {
    cat_name: data.cat_name
  }).then(e =>{
    let res = e.data || {};
    if(res.code && res.data) {
      this.$Message.info(res.message || '添加分组成功!');
      return this.loadData();
    }
  }).finally(()=>{
    this.showSpan = false
  })
}
//add label
function submitLabelReq(data){
  this.showSpan = true;
  return util.ajax.post(util.apiUrl.ErpTagLabelAdd, {
    ...data
  }).then(e =>{
    let res = e.data || {};
    if(res.code && res.data) {
      this.$Message.info(res.message || '添加成功!');
      return this.loadData();
    }
  }).finally(()=>{
    this.showSpan = false
  })
}
// edit label edit group
function submitEditReq(data, type){
  this.showSpan = true;
  let formData = data.formData || {};
  let params = {
    id: data.editId,
    type: formData.cat_id ? 2 : 1, // type 1 分组   2  标签
    ...formData
  }
  return util.ajax.post(util.apiUrl.ErpTagLabelEdit, params).then(e =>{
    let res = e.data || {};
    if(res.code && res.data) {
      this.$Message.info(res.message || '编辑成功!');
      return this.loadData();
    }
  }).finally(()=>{
    this.showSpan = false
  })
}
//del label edit group
function submitRemoveReq(data, type){
  this.showSpan = true;
  let formData = data.formData || {};
  let params = {
    id: data.id
  }
  return util.ajax.post(util.apiUrl.ErpTagLabelRemove, params).then(e =>{
    let res = e.data || {};
    if(res.code && res.data) {
      this.$Message.info(res.message || '编辑成功!');
      return this.loadData();
    }
  }).finally(()=>{
    this.showSpan = false
  })
}
</script>
<style lang="less">
  .label-list{
    .action_area{
      .ivu-divider:last-of-type{
        display:none;
      }
    }
  }
  
</style>