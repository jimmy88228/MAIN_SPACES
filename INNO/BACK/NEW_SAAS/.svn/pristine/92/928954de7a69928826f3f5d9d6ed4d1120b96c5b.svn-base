<template>
  <div class="label-list">
    <Card>
      <list-head title="手动标签" ref="listHead" @on-labelHandle="labelHandle" @on-groupHandle="groupHandle" :canAction="canCreate"></list-head>
      <div>
        <Table row-key="id" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
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
    }
  },
  mounted(){
		 this.loadData();
	},
  methods: {
    onLoadData(page, reqData){
      this.showSpan = true;
			return util.ajax.post(util.apiUrl.ErpTagLabelList, reqData).then(e =>{
				let res = e.data || {};
				if(res.code) {
          let data = res.data || {};
          let items = data.items || [];
          for(let i = 0; i < items.length; i++){
            let children = items[i].getErpTag || [];
            items[i]._showChildren = true;
            items[i].children = children;
          }
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
    editHandle(row){
      if(row.cat_id){
        this.$refs["add-label-modal"].showModal(row);
      } else{
        this.$refs["group-model"].showModal(row);
      }
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
      this.loadData();
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
      this.loadData();
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
      this.loadData();
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
      this.loadData();
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