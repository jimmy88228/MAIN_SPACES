<template>
    <hold-layout :isFull="true" class="resource-page-layout" layoutCustomStyle="padding: 0;" :isShowFormSave="curTab != 'result'" @_cancel="cancel" @_save="save()">
      <div class="resource-name-area" v-if="pageQuery.customer_name">{{pageQuery.customer_name}}</div>
      <rewrite-tabs class="tabs-box" customClass="gauge" :data="tabListView" @changeTab="changeTab" :currTab="curTab">
        <template v-slot:basic>
          <baseIndex ref="basic" class="box" @next="nextTab" :baseInfo="baseInfo"></baseIndex>
        </template>
        <template v-slot:problems>
          <problemsIndex ref="problems" class="box" :problemsInfo="baseInfo"></problemsIndex>
        </template>
        <template v-slot:result>
          <resultIndex ref="result" class="box"></resultIndex>
        </template> 
      </rewrite-tabs>
    </hold-layout>
</template>

<script>
import baseIndex from "./base/index.vue";
import typeIndex from "./type/index.vue";
import resultIndex from "./result/index.vue";
import problemsIndex from "../problems-detail/index.vue"
export default {
  name: "resourceManageIndex",
  components: { baseIndex, typeIndex, resultIndex,problemsIndex },
  data() {
    return {
      currentTab: 'base',
      curTab: "",
      baseInfo:{
        id: 0,
        type: '',
        name: "",
        multi_choice: 0,
        quotation: "",
        virtual_number: 0,
        detail: "",
        pic_data: []
      },
      tabList:[{
        name:"basic",
        label:"基础信息",
        tabName:"editFunny",
      },
      {
        name:"problems",
        label:"题目管理",
        tabName:"editFunny",
      },
      {
        name:"result",
        label:"结果维护",
        tabName:"editFunny",
      }]
    };
  },
  computed:{
    tabListView(){
      let tabList = this.tabList || [];
      for(let i = 0; i < tabList.length; i++){
        if(!this.pageQuery.testId && tabList[i].name != 'basic'){
          tabList[i].disabled = true;
        } else {
          tabList[i].disabled = false;
        }
      }
      return tabList
    }
  },
  methods: { 
    init(){
      this.curTab = this.pageQuery.currTab || this.tabList[0].name;
      this.baseInfo.type = this.pageQuery.type;
      this.loadData();
    },
    loadData(){
      if(!this.pageQuery.testId){ return Promise.reject() }
      this.pageLoading = true
      return this.$MainApi
        .tasteTestInfo({
          data: {
            id: this.pageQuery.testId,
            type: this.pageQuery.type
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.items || {};
            let getpic = items.getpic || [];
            let pic_data = [];
            getpic.map((item)=>{
              pic_data.push(item.picture);
            })
            items.pic_data = pic_data;
            let baseInfo = {
              ...items,
              id: items.id,
              type: items.type,
              name: items.name,
              quotation: items.quotation,
              virtual_number: items.virtual_number,
              detail: (items.getdetails && items.getdetails.detail) || "",
              pic_data: pic_data
            }
            this.baseInfo = JSON.parse(JSON.stringify(baseInfo));
          }
        }).finally(()=>{
          this.pageLoading = false
        })
    },
    changeTab(name){
      this.curTab = name;
      if(this.$refs[this.curTab] && this.$refs[this.curTab].inited){
        this.$refs[this.curTab].inited = false;
        this.$refs[this.curTab] && this.$refs[this.curTab].init && this.$refs[this.curTab].init();
      }
    },
    nextTab(detail){
      if(detail.name){
        this.curTab = detail.name;
      }
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
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.resource-page-layout {
  .resource-name-area{
    padding: 0px 10px;
    margin-bottom: 10px;
  }
  .box{
    height: 100%;  
    background: #fff;
  }
  .tabs-box{
    background: #f4f4f4;
  }
}
</style>
<style lang="less">
.resource-page-layout{
  .ivu-tabs{
    width:100%;
    flex: 1;
    height: 100%;
    // overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 36px;
  }
  .ivu-tabs-bar{
    position: absolute;
    top:0px;
    left: 0px;
    width:100%;
  }
  .ivu-tabs-content{
    flex: 1;
    height: 100%;
  }
  .ivu-tabs-tabpane{
    width:100%;
    height:100%;
  }
}
</style>