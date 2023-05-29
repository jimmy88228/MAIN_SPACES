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
      <div class="font-20 title">活动推广</div>
    </div>
    <div class="scroll-box" v-bar>
      <div>
        <div class="flex padding-box">
          <div class="ac-name">{{acInfo.activity_name}}</div>
          <a class="p-l-15" @click="createCode({name:acInfo.activity_name},'act')" v-hasAction="'appraisal_activity_qr_code'">活动码</a>
        </div>
        <div class="flex-b-c padding-box title-bg">
          <div>参与活动的组织</div>
          <Button class="btn" @click="batchCreateCode" v-hasAction="'appraisal_activity_batch_organizational_code'">批量生成活动码</Button>
        </div>
        <div class="flex-b-c list-title list padding-box">
          <div>组织名称</div>
          <div>推广</div>
        </div>
        <div class="list padding-box flex-b-c" v-for="(item,index) in acInfo.join_data" :key="index">
          <div class="name">{{item.structure_name||item.name||""}}</div>
          <a class="code" @click="createCode(item,'orgn')" v-hasAction="'appraisal_activity_organizational_code'">生成活动码</a>
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
        activity_name:"",
        join_data:[],
      },
      id:0,
      type:"",
      pageLink: "pages/activities/evaluating/detail/detail",
    };
  },
  computed: {},
  methods: {
    showModal(info,type) {
      console.log("organize-form", info);
      this.type = type||"";
      this.acInfo.activity_name = info.activity_name||"";
      this.id = Number(info.id || 0);
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
      let req = 'organizationalList';
      let params={
        ...extraData,
        activityid: id,
        pageSize: 1000,
      }
      if(this.type == 'readInfo'){
        req = 'studyTaskInfo';
        params = {
          id
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
          let items = data.items;
          if(this.type == 'readInfo'){
            this.acInfo.join_data = items && items.join_data||[];
          }else{
            this.acInfo.join_data = items && items || [];
          }
          console.log("organizationalList", this.acInfo.join_data);
        }
        return res
      });
    }, 
    createCode(row,type) {
      let codeId = type == 'act' ? `surveya:${this.id}` : `surveys:${row.id}:${this.id}`
        this.$UIModule({
            mode: "code-view",
            props: {
                codeTip: `<p class="big-tip">${row.name}</p>`
            },
            options: {  
                path: this.pageLink, 
                params: {
                    activityId: this.id,
                },
                codeId,
            }
        });
    },
    batchCreateCode() {
        this.createCodeReq();            
    },
    createCodeReq() {
        let ids = this.acInfo.join_data.map(item=>Number(item.id||0));
        return this.$MainApi
          .batchQrCode({
              data: {
                  ids,
                  activityid:this.id,
                  type:2,
              },
              other: { isShowMsg: true },
          })
          .then((res) => {
              let data = res.data;
              if (ids.length > 0 && data) {
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