<template>
  <div class="label-list">
    <Card>
      <list-head title="手动标签" ref="listHead" @on-labelHandle="labelHandle" @on-groupHandle="groupHandle" @on-success="successHandle" :catArr="catArr" :canAction="canCreate"></list-head>
      <div>
        <Table  :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
          <template slot-scope="{ row }" slot="cat_name">
            <div>{{row.cat_name}}<Icon v-if="row.handle.catedit" style="cursor:pointer;" type="ios-create-outline" @click="editCatHandle(row)" /></div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="action_area">
              <template v-if="row.handle.edit">
                <a @click="editHandle(row)">编辑</a>
                <Divider type="vertical" />
              </template>
              <template v-if="row.handle.remove">
                <a @click="delHandle(row)">删除</a>
                <Divider type="vertical" />
              </template>
              <template v-if="row.handle.cateremove">
                <a @click="delCategroy(row)">删除</a>
                <Divider type="vertical" />
              </template>
              <!-- <template v-if="row.handle.status">
                <a >执行</a>
                <Divider type="vertical" />
              </template> -->
              <template v-if="row.handle.import">
                <a @click="labelImport(row)">导入</a>
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
    <!--导入-->
    <BatchImport ref="batchImport" :downloadPayLoad="downloadPayLoad" :upLoadPayLoad="upLoadPayLoad" @on-success="loadData">
      <div slot="title" class="p-15">
        <RadioGroup v-model="importType" @on-change="onImportChange">
          <Radio :label="1">
              <span>按会员卡号导入</span>
          </Radio>
          <Radio :label="2">
              <span>按会员手机号码导入</span>
          </Radio>
      </RadioGroup>
      </div>
    </BatchImport>
    <Spin size="large" fix v-if="showSpan"></Spin>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import listHead from '../components/list-head';
import PageHelper from '@/libs/page-helper.js';
import mixin from '../mixins/manualMixin.js';
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
      // tableData: [{},{},{}]
      canCreate: {},
      importType: 1,
      downloadPayLoad: {},
      upLoadPayLoad: {},
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
			return util.ajax.post(util.apiUrl.ManualLabelList, params).then(e =>{
				let res = e.data || {};
				if(res.code) {
          let data = res.data || {};
          let items = data.items || [];
          this.canCreate = data.canCreate;
          this.catArr = data.cat_arr;
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
        content: "请注意：标签删除后，所有打上该标签的会员，将失去此标签！您确定要进行删除吗？",
        onOk: ()=>{
          submitRemoveReq.call(this, row);
        }
      })
    },
    delCategroy(row){
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除该分组?",
        onOk: ()=>{
          submitGroupRemoveReq.call(this, row);
        }
      })
    },
    labelImport(row){
      this.downloadPayLoad = {
        type: this.importType
      }
      this.upLoadPayLoad = {
        tag_id: row.id,
        type: this.importType,
        opType: 0
      }
      this.$refs.batchImport.openModal({
        upload: true,
        download: true
      }, this.$api.ManualLabelImport, this.$api.ManualLabelDown);
    },
    onImportChange(){
      this.downloadPayLoad.type= this.importType;
      this.upLoadPayLoad.type = this.importType;
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
				name: 'manual-label-member',
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
  return util.ajax.post(util.apiUrl.ManualLabelAddGroup, {
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
  return util.ajax.post(util.apiUrl.ManualLabelAdd, {
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
  return util.ajax.post(util.apiUrl.ManualLabelEdit, params).then(e =>{
    let res = e.data || {};
    if(res.code && res.data) {
      this.$Message.info(res.message || '编辑成功!');
      return this.loadData();
    }
  }).finally(()=>{
    this.showSpan = false
  })
}
//remove group
function submitGroupRemoveReq(data, type){
  this.showSpan = true;
  let formData = data.formData || {};
  let params = {
    id: data.id,
    type:1,
  }
  return util.ajax.post(util.apiUrl.ManualLabelRemove, params).then(e =>{
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
    id: data.id,
    type:2,
  }
  return util.ajax.post(util.apiUrl.ManualLabelRemove, params).then(e =>{
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