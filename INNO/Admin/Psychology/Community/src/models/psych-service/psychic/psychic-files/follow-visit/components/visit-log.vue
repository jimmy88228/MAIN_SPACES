<template>
  <custom-modal
    ref="modal"
    :footerHide="true"
    :isSlotHeader="true"
    :closable="true"
    :width="375"
    class="follow-visit-form hold-modal-zindex"
  >
  <div slot="header">{{viewInfo.template_name}}</div>
  <div class="follow-visit-cont">
    <vue-scroll >
      <div class="item-box">
        <div class="flex-b-s">
          <div>
            <p>
              <span class="inline-b people-attr m-r-20">{{viewInfo.user_name || '--'}}</span>
              <span class="inline-b people-tip" v-for="(item, index) in viewInfo.get_tag" :key="item.tag_id">{{item.tag_name}}</span>
            </p>
            <p class="C_7f">{{viewInfo.phoneNumber || '--'}}</p>
          </div>
          <div class="flex-c-s m-l-5">
            <div class=" p-l-5 p-r-5 text-c">
              <p class="people-attr">{{viewInfo.gender_str || '--'}}</p>
              <p class="C_7f w-nowrap">性别</p>
            </div>
            <div class="p-l-5 p-r-5 text-c">
              <p class="people-attr">{{viewInfo.age || '--'}}</p>
              <p class="C_7f w-nowrap">年龄</p>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div>
          <div class="C_7f m-b-10">{{viewInfo.prent_structure_name}}</div>
          <div>{{viewInfo.address}}</div>
        </div>
      </div>
      <div class="module-item">
        <div class="module-tip m-t-10 m-b-10">详尽资料</div>
        <div class="item-box" v-for="(qItem, qIndex) in viewTemplate" :key="qItem.id">
          <div class="question-name">{{qItem.title}}</div>
          <div class="question-cont">
            <template v-if="qItem.type == 'single_choice'">
              <RadioGroup  :value="qItem.answer && qItem.answer.option_ids && parseInt(qItem.answer.option_ids[0])">
                <Radio :disabled="true" :label="item.id" v-for="(item, index) in qItem.option_data" :key="item.id"><p class="w-break">{{item.option_content}}</p></Radio>
              </RadioGroup>
            </template>
            <template v-else-if="qItem.type == 'multi_choice'">
              <CheckboxGroup :value="qItem.answer && qItem.answer.option_ids">
                <Checkbox :disabled="true" :label="item.id + ''" v-for="(item, index) in qItem.option_data" :key="item.id"><p class="w-break">{{item.option_content}}</p></Checkbox>
              </CheckboxGroup>
            </template>
            <template v-else-if="qItem.type == 'q_a'">
              <div v-if="(qItem.answer && qItem.answer.option_content)">
                {{(qItem.answer && qItem.answer.option_content) || ""}}
              </div>
              <div class="C_B2 text-c flex-c-c" style="width: 100%;height: 50px;" v-else>暂无回答</div>
              
            </template>
          </div>
        </div>
      </div>
    </vue-scroll>
  </div>
  </custom-modal>
</template>

<script>
import stringUtil from "@/helper/utils/string-util.js";
export default {
  data(){
    return {
      pageLoading: false,
      viewInfo: {},
      viewTemplate: []
    }
  },
  methods: {
    show(detail){
      this.loadData(detail);
      this.$refs["modal"] && this.$refs["modal"].show();
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss();
    },
    loadData(detail){
      let user_id = this.pageQuery.userId || 0;
      this.pageLoading = true;
      return this.$MainApi["followRecordView"]({
        data: {
          user_id,
          record_id: detail.record_id
        }
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let info = data.info || {};
          info.phoneNumber = stringUtil.setOmitStr(info.mobile_phone);
          // 
          let viewTemplate = data.template_data || [];
          viewTemplate.map((vItem)=>{
            let answer = vItem.answer || {};
            let option_ids = answer.option_ids || [];
            option_ids.map((oItem)=>{
              oItem = parseInt(oItem);
            })
          })
          this.viewInfo = info;
          this.viewTemplate = viewTemplate;
        }
      }).finally(()=>{
        this.pageLoading = false;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.item-box{
  background: #FFFFFF;
  border-radius: 11px;
  padding: 20px;
  margin-bottom: 10px;
  font-family: PingFangSC-Medium, PingFang SC;
}
.follow-visit-form{
  /deep/.ivu-modal-body{
    background-color: #F7F7F7;
    padding-right: 0px;
  }
}
.follow-visit-cont{
  height: 70vh;
  /deep/.__panel{
    padding-right: 20px;
  }
}
.line{
  width: 100%;
  margin: 15px 0px;
  border-bottom: 1px solid #EFEFEF;
}
.people-attr{
  font-size: 14px;
  font-weight: bold;
  color: #151515;
  line-height: 24px;
  padding: 8px 0px;
}
.people-tip{
  font-size: 12px;
  font-weight: 400;
  color: #58A229;
  background: #EFFBDD;
  border-radius: 3px;
  padding: 0px 3px;
}
.module-tip{
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  vertical-align: middle;
}
.module-tip::before{
  content: "";
  width: 7px;
  height: 19px;
  background: #28D07B;
  margin-right:12px;
  display: inline-block;
  vertical-align: middle;
}
.question-name{
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #5FA403;
  line-height: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #C4E786;
  margin-bottom: 10px;
}
/deep/.ivu-radio-wrapper{
  display: flex;
  padding: 5px 0px;
}
/deep/.ivu-radio{
  margin-top: 3px;
}
/deep/.ivu-checkbox-wrapper{
  display: flex;
  padding: 5px 0px;
  align-items: center;
}
/deep/.ivu-checkbox{
  margin-right: 5px;
}
/deep/.ivu-radio-checked.ivu-radio-disabled {
  .ivu-radio-inner{
    border-color: #2d8cf0;
    background-color: #fff;
  }
  .ivu-radio-inner::after{
    background-color: #2d8cf0;
  }
}
/deep/.ivu-checkbox-checked.ivu-checkbox-disabled {
  .ivu-checkbox-inner{
    border-color: #2d8cf0;
    background-color: #fff;
  }
  .ivu-checkbox-inner::after{
    border-color: #2d8cf0;
  }
}
</style>