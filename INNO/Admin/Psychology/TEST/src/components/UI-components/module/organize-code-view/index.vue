<template>
  <custom-modal
    ref="modal"
    :footerHide="true"
    :isSlotHeader="true"
    :closable="true"
    :width="750"
    class="organize-form hold-modal-zindex"
  >
    <div class="title-box flex-b-c" slot="header">
      <div class="font-20 title">推广</div>
    </div>
    <div class="scroll-box" v-bar>
      <div>
        <div class="flex padding-box">
          <div class="ac-name">{{acInfo.activity_name}}</div>
          <a class="p-l-15" @click="createCode('act')" >活动码</a>
        </div>
        <div class="flex-b-c padding-box title-bg">
          <div>参与活动的组织</div>
          <Button class="btn" @click="batchCreateCode" >批量生成活动码</Button>
        </div>
        <div class="flex-b-c list-title list padding-box">
          <div>组织名称</div>
          <div>推广</div>
        </div>
        <div class="list padding-box flex-b-c" v-for="(item,index) in joinData" :key="index">
          <div class="name">{{item.structure_name || item.name || ""}}</div>
          <a class="code" @click="createCode('orgn',item)" >生成活动码</a>
        </div>
      </div>
    </div>
    <!--异步处理导出excel组件-->
    <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
  </custom-modal>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
  mixins:[ListMixin],
  components: {
    mpNotice,
  },
  props: {
    title: String,
  },
  data() {
    return {
      jobIdCol:[],
      acInfo:{
        structure_id:0,
        activity_name:"",
      },
      joinData: [],
      id:0,
      type:"",
      baseInfo:{
        // 'surveyAct':{
        //     codeId:"studyTaska",
        //     codeIds:"studyTasks",
        //     loadDataReq:"organizationalList",
        //     codeReq:"batchQrCode",
        //     pageLink: "pages/activities/evaluating/detail/detail",
        // },
        'studyTask':{
            codeType: "course_activity",
            codeId:"courseActivitya",
            codeIds:"courseActivitys",
            loadDataReq:"studyTaskStructureList",
            wxcodeReq: "wxcode",
            codeReq:"qrcode",
            batchCodeReq: "studyTaskBatchCode",
            pageLink: "pages/work-bench/course-details/course-details",
        }
      },
      offiaccountInfo: {}
    };
  },
  computed: {},
  methods: {
    showModal({info, type, offiaccountInfo}) {
      console.log("organize-form", info);
      this.type = type || "";
      this.acInfo.activity_name = info.activity_name || "";
      this.id = Number(info.id || 0);
      this.offiaccountInfo = offiaccountInfo || {};
      this.loadData().then(()=>{
        this.$refs.modal.show();
      })
    },
    dismiss() {
      this.$refs.modal.dismiss();
    }, 
    onLoadData(page, extraData) {
      let id = this.id;
      if (!id) return Promise.reject(); 
      let req = this.baseInfo[this.type].loadDataReq;
      let params={
        ...extraData,
        activityid: id,
        pageSize: 1000,
      }
      if(this.type == 'studyTask'){ 
        params = {
            ...extraData,
            id: id,
            pageSize: 1000,
        }
      }
      return this.$MainApi[req]({
        data: params,
        other: {
          isShowLoad: true,
          isErrorMsg: true
        },
      }).then((res) => {
        if (res.code) {
            let data = res.data || {};
            let items = data.items || [];
            let info = data.info || {};
            this.acInfo = {
              ...this.acInfo,
              ...info
            }
            this.joinData = items || []
        }
        return res
      });
    }, 
    createCode(type, row) {
        row = row || {};
        let item = this.baseInfo[this.type] || {};
        let codeId = type == 'act' ? `${item.codeId}:${this.id}` : `${item.codeIds}:${row.id}:${this.id}`
        let params = {}
        let acInfo = this.acInfo || {};
        if(this.type == 'studyTask'){
          params.courseActivityId = this.id;
          params.showTeacher = true;
          if(type == 'orgn'){
            if(acInfo.join_type.includes("school")){
              params.schoolId = row.id || 0
            } else if(acInfo.join_type.includes("class")){
              params.classId = row.id || 0
            }
          }
        }
        //
        let offiacId = this.offiaccountInfo && this.offiaccountInfo.id
        if(offiacId){
          this.$UIModule({
              mode: "wx-code-view",
              props: {
                  codeTip: `<p class="big-tip">${this.acInfo.activity_name || ""}</p>` + `${'<p class="tip">'+(row.structure_name || row.name || "")}`
              },
              options: { 
                  listParams: {
                    structure_id: acInfo.structure_id,
                    structure_type: acInfo.structure_type
                  },
                  path: item.pageLink, 
                  params,
                  offiaccountInfo: this.offiaccountInfo,
                  codeType: item.codeType,
                  codeId,
              }
          });
        } else {
          this.$UIModule({
              mode: "code-view",
              props: {
                  codeTip: `<p class="big-tip">${this.acInfo.activity_name || ""}</p>` + `${'<p class="tip">'+(row.structure_name || row.name || "")}`
              },
              options: { 
                  listParams: {
                    structure_id: acInfo.structure_id,
                    structure_type: acInfo.structure_type
                  },
                  path: item.pageLink,
                  params,
                  codeId,
                  codeType: item.codeType,
              }
          });
        }
    },
    batchCreateCode() {
      let acInfo = this.acInfo || {};
      this.$UIModule({
        mode: "code-view",
        props: {
          isLimitCode: true
        },
        options: { 
          listParams: {
            structure_id: acInfo.structure_id,
            structure_type: acInfo.structure_type
          },
        },
        success:(result)=>{
          let appletInfo = result.appletInfo || {};
          this.createCodeReq(appletInfo.appid); 
        }
      })          
    },
    createCodeReq(appid) {
        let req = this.baseInfo[this.type].batchCodeReq || "";
        return this.$MainApi[req]({
              data: {
                  applet_id: appid,
                  activityid: this.id
              },
              other: { isShowMsg: true },
          })
          .then((res) => {
              let data = res.data;
              if (data) {
                  this.jobIdCol.push(data);
                  this.$nextTick(() => {
                      this.$refs[`notice${data}`][0].showNotice(data);
                  });
              }
              return data || {};
          });
    },
  }, 
};
</script>
<style lang="less">
.organize-form{
  .ivu-modal-body{
    padding: 30px 0;
  }
}
</style>
<style lang="less" scoped>
.organize-form{
  .title-box{
    font-weight: bold;
    padding:0 15px 0 10px;
    box-sizing: border-box;
    font-size: 20px;
  }
  .scroll-box{
    width: 100%;
    height: 400px;
    padding: 0 15px;
  }
  .btn{
    width: 146px;
    height: 38px;
    border-radius: 4px;
  }
  .padding-box{
    padding: 15px;
    box-sizing: border-box;
  }
  .list-title{
    color: #b2b2b2;
  }
  .list{
    border-bottom: 1px solid rgba(0, 0, 0,0.1);
    &:last-child{
      border-bottom: none;
    }
  }
  .title-bg{
    background: rgba(216, 216, 216, 0.1);
    border-radius: 6px;
    padding: 6px 15px;
    margin-top: 10px;
  }
  .close{
    width: 40px;
    height: 40px;
    transform: rotate(-45deg);
    margin-right: -10px;
  }
  .row{
    width:50%;
    height:1px;
    background: #000;
  }
  .col{
    width:1px;
    height:50%;
    background: #000;
  }
}
</style>