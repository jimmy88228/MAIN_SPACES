<template>
  <hold-layout :isFull="true" class="edit-gauge" layoutCustomStyle="padding: 0;" :isShowFormSave="(((baseInfo.publish_state>=0 && baseInfo.publish_state != 1) || curTab == 'report') && (['problemsPreview', 'tScore'].indexOf(curTab) == -1))" @_cancel="cancel" @_save="save()">
    <rewrite-tabs class="tabs-box" customClass="gauge" :data="tabList" @changeTab="changeTab" :currTab="curTab">
      <template v-slot:basic>
        <form-view ref="basic" class="box" :baseInfo="baseInfo"></form-view>
      </template>
      <template v-slot:report>
        <report ref="report" class="box"></report>
      </template>
      <template v-slot:result>
        <resultSetting ref="result" class="box" :baseInfo="baseInfo"></resultSetting>
      </template>
      <template v-slot:tScore>
        <tScore ref="tScore" class="box" :baseInfo="baseInfo"></tScore>
      </template>
      <template v-slot:problems>
        <problemsDetail ref="problems" :baseInfo="baseInfo"></problemsDetail>
      </template>
      <template v-slot:problemsPreview>
        <problemsPreview ref="problemsPreview" :baseInfo="baseInfo"></problemsPreview>
      </template>
      <!-- <div slot="extra">
        <Button @click="batchImportTscore" icon="md-cloud-upload">导入T分数</Button>
      </div> -->
    </rewrite-tabs>
  </hold-layout>
</template>

<script>
import report from "./report.vue"
import formView from "./form.vue"
import problemsDetail from "./problems-detail/index.vue";
import resultSetting from "./result-setting.vue";
import problemsPreview from "./problems-preview/index.vue";
import tScore from "./t-score/index.vue";
export default {
  mixins: [],
  components: {
    formView,
    problemsDetail,
    report,
    resultSetting,
    problemsPreview,
    tScore
  },
  data() {
    return { 
      pageId:0,
      curTab: "",
      tabList:[],
      tipShow:false,
      baseInfo:{},
      tScoreTab: {
          name: "tScore",
          label:"T分数条件",
          tabName:"editGauge",
        }
    };
  },
  methods: {
      // beforeChange(name, beforeName){
      //   return new Promise((rs, rj)=>{
      //     if(name != beforeName){
      //       // this.$refs[this.curTab] && this.$refs[this.curTab].checkChange(()=>{
      //       //   this.$Modal.info({
      //       //       title: '温馨提示',
      //       //       content: '切换标签并不会自动保存数据,请记得手动保存',
      //       //       onOk:()=>{
                    
      //       //       }
      //       //   });
      //       // })
      //       this.$Modal.confirm({
      //           title: '温馨提示',
      //           content: '切换标签并不会自动保存数据,请记得手动保存',
      //           onOk:()=>{
      //             rs();
      //           },
      //           onCancel:()=>{
      //             rj();
      //           }
      //       });
      //     } else {
      //       rs();
      //     }
      //   })
      // },
      // loadGaugeInfo(){
      //   let pageQuery = this.pageQuery || {};
      //   if(!pageQuery.id) return Promise.reject();
      //   return this.$MainApi.scaleInfo({
      //         data: {
      //             id: pageQuery.id
      //         }, 
      //         other: {
      //         isErrorMsg: true
      //       }
      //     })
      //     .then((res) => {
      //         if (res.code) {
      //             let data = res.data || {};
      //             let items = data.items || {};
      //             this.gaugeInfo = items;
      //         }else{
      //             return Promise.reject(res);
      //         }
      //     })
      // },
      changeTab(name) {
        this.curTab = name;
        this.$refs[this.curTab] && this.$refs[this.curTab].init && this.$refs[this.curTab].init();
      },
      cancel(){
          this.$router.back();
      },
      save(name){
        let currTab = name || this.curTab
        let item = this.tabList.find(item=>item.name == currTab) || {};
        this.$refs[currTab].save && this.$refs[currTab].save().then(()=>{
          this.$Message.info(`${item.label}保存成功`);
        }).catch(e=>{});
      },
      init(){ 
        let type = this.pageQuery.type || "";
        this.tabList = type == 'gaugeEdit' ? 
        [{
          name:"basic",
          label:"基础信息",
          tabName:"editGauge",
        },
        {
          name:"problems",
          label:"题目维护",
          tabName:"editGauge",
        },{
          name:"problemsPreview",
          label:"题库视图",
          tabName:"editGauge",
        }] 
        : 
        [{
          name:"result",
          label:"结果设置",
          tabName:"editGauge",
        },{
          name:"report",
          label:"报告建议",
          tabName:"editGauge",
        }]
        this.curTab = this.pageQuery.currTab || this.tabList[0].name;
        this.$nextTick(()=>{
          this.getScaleInfo();
        })
      },
      getScaleInfo(){
        if(!this.pageQuery.id) return Promise.reject();
        return this.$MainApi.scaleInfo({
            data: {
                id: this.pageQuery.id || 0
            }, 
        })
        .then((res) => {
            if (res.code) {
                let data = res.data || {};
                let items = data.items || {};
                this.baseInfo = items;
                if(items.get_rule_count > 0 && this.pageQuery.type == 'resultEdit'){
                  let hasTscore = false;
                    for(let i = 0; i < this.tabList.length; i++){
                      if(this.tabList[i].name == 'tScore'){
                        hasTscore = true;
                        break;
                      }
                    }
                    if(!hasTscore){
                      this.tabList.push(this.tScoreTab);
                    }
                    this.$nextTick(()=>{
                      if(this.curTab == 'tScore'){
                        this.changeTab(this.curTab);
                      }
                    })
                    
                  }
            }else{
                return Promise.reject(res);
            }
        })
      },
      // batchImportTscore(){
      //   this.$UIModule({
      //     mode: "batch-import",
      //     props: {
      //       upLoadPayLoad: {
      //         id: this.pageQuery.id || 0
      //       }
      //     },
      //     options: {
      //         canCreate: { upload: true, download: true },
      //         uploadUrl: "batchImportTscore",
      //         downloadUrl: "batchImportTscoreTpl",
      //     },
      //     success: () => {
      //         this.getScaleInfo();
      //     },
      // });
      // }
      // saveAllLoop(index){
      //   let tabList = this.tabList;
      //   let item = tabList[index];
      //   if(item){
      //     this.$refs[item.name].save && this.$refs[item.name].save().then(()=>{
      //       index += 1;
      //       if(tabList[index]){
      //           this.saveAllLoop(index)
      //       } else {
      //         this.$Message.info(`保存成功`);
      //         this.$router.back();
      //       }
      //     }).catch(e=>{
      //         if(tabList[index]){
      //           this.curTab = tabList[index].name;
      //         }
      //     });
      //   }
      // },
      // saveAll(){
      //   this.saveAllLoop(0)
      // }
  },
  mounted () {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.edit-gauge{
}
.box{
  height: 100%;  
  background: #fff;
}
.tabs-box{
  background: #f4f4f4;
}
</style>
<style lang="less">
.edit-gauge{
    .ivu-tabs{
        height: 100%;
    }
    .ivu-tabs-content{
        height: calc(100% - 52px);
    }
}
</style>