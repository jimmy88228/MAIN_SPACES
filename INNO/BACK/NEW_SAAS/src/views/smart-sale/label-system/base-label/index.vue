<template>
  <div class="label-list">
    <Card>
      <list-head title="基础标签" ref="listHead" @on-labelHandle="labelHandle" @on-groupHandle="groupHandle" :canAction="canCreate"></list-head>
      <div>
        <Table row-key="id" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
          <template slot-scope="{ row }" slot="is_auto_label">
            <Icon type="ios-close-circle-outline" size="25" color="#CE3636" v-if="row.is_auto_label == '1'"/>
            <Icon type="ios-checkmark-circle-outline" size="25" color="#52BD80" v-else/>
          </template>
          <template slot-scope="{ row }" slot="is_enabled">
            <div :style="{color:( row.is_enabled == 0 ? 'red': row.is_enabled == 1 ? 'green' : 'blue')}">{{row.is_enabled_str}}</div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="action_area">
              <template v-if="row.handle.edit">
                <a @click="editHandle(row)">编辑</a>
                <Divider type="vertical" />
              </template>
              <template v-if="row.handle.status">
                <template v-if="row.is_auto_label == 1 &&row.is_enabled != 0 && row.is_enabled != 3">
                  <a @click="labelStatusHandle(row, 'end')">终止</a>
                  <Divider type="vertical" />
                </template>
                <template v-else-if="(row.is_enabled == 0 || row.is_enabled == 3) && row.is_auto_label == 1">
                  <a @click="labelStatusHandle(row,'start')">开始</a>
                  <Divider type="vertical" />
                </template>
                <template v-else-if="row.is_auto_label == 0">
                  <a @click="labelStatusHandle(row,'handle')">执行</a>
                  <Divider type="vertical" />
                </template>
              </template>
              <template v-if="row.handle.remove ">
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
    <group-model ref="group-model" @on-submitGroup="submitGroup"></group-model>
    <spin fix v-if="showSpan"></spin>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import listHead from '../components/list-head';
import PageHelper from '@/libs/page-helper.js';
import mixin from '../mixins/baseMixin.js';
// import addLabelModal from './addLabel';
import groupModel from '../components/group-model';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import vueUntils from '@/libs/vue-utils.js';
export default {
  name: 'baseLabel',
  mixins: [PageHelper, mixin],
  components: {
    listHead,
    // addLabelModal,
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
      showSpan: false
    }
  },
  mounted(){
		 this.loadData();
	},
  methods: {
    onLoadData(page, reqData){
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.BasicLabelList, reqData).then(e =>{
            let res = e.data || {};
            if(res.code) {
        let data = res.data || {};
        let items = data.items || [];
        for(let i = 0; i < items.length; i++){
            let children = items[i].get_usertag_basic || [];
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
        if(row.is_enabled == 1){
          this.$Modal.confirm({
            title: "提示",
            content: "修改指标或指标统计参数，将会清空标签历史统计数据?",
            onOk: ()=>{
              this.$router.push({
                name: "add-basic-label",
                query: {
                    tag_id: row.id
                }
            })
            }
          })
        } else {
          this.$router.push({
              name: "add-basic-label",
              query: {
                  tag_id: row.id
              }
          })
        }
      } else{
        this.$refs["group-model"].showModal(row);
      }
    },
    delHandle(row){
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除该标签?",
        onOk: ()=>{
          submitRemoveReq.call(this, row);
        }
      })
    },
    labelHandle(){
        this.$router.push({
            name: "add-basic-label"
        })
    },
    groupHandle(){
      this.$refs["group-model"].showModal();
    },
    submitGroup(returnData){
      if(!returnData.formData) return;
      if(returnData.editId){
        submitEditReq.call(this, returnData);
      }else{
        submitGroupReq.call(this, returnData.formData)
      }
    },
    labelStatusHandle(row, type){
      let warn = '';
      switch(type){
        case"start":
          warn = `标签‘${row.tag_name}’将从今天开始统计。`;
          break;
        case"handle":
          warn = `标签‘${row.tag_name}’将从今天开始统计。`;
          break;
        case"end":
          let dateStr = vueUntils.format(new Date(), 'yyyy-MM-dd HH:mm');
          warn = `标签‘${row.tag_name}’将从今天开始停止统计.统计周期的结束时间将变更为${dateStr}`;
          break;
      }
      this.$Modal.confirm({
        title: "提示",
        content: warn,
        onOk: ()=>{
          changeStatusReq.call(this, {
            id: row.id,
            type: (type == 'start' || type == 'handle') ? 1 : 2
          });
        }
      })
    },
    checkUsers(row){
        this.$router.push({
            name: 'basic-label-member',
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
  return util.ajax.post(util.apiUrl.BasicLabelAddGroup, {
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
//change status
function changeStatusReq(data){
  this.showSpan = true;
  return util.ajax.post(util.apiUrl.BasicLabelStatus, data).then(e =>{
    let res = e.data || {};
    if(res.code && res.data) {
      this.$Message.info(res.message || '操作成功!');
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
  return util.ajax.post(util.apiUrl.BasicLabelEdit, params).then(e =>{
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
  return util.ajax.post(util.apiUrl.BasicLabelRemove, params).then(e =>{
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