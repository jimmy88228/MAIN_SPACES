<template>
  <div class="organize-cont">
    <div class="organize-tree-area">
      <div class="choose-tip">选择学校：<a @click="trunNext = false;">{{chooseSchool.name}}</a></div>
      <div class="transform-view" :class="{'next-view': trunNext}">
        <div class="transform-item">
          <div class="tree-area" v-bar>
            <div style="padding-right: 10px;">
              <div class="search-area">
                <template v-if="inputVal && searchData.length==0">
                    <div class="empty-area" v-if="!searchData || searchData.length == 0">暂无匹配数据</div>
                </template>
                <template v-else>
                    <div class="search-item flex-s-c" :class="[chooseSchool.id == item.id ? 'selected' : '']" v-for="(item) in (inputVal ? searchData : list)" :key="item[valueKey]" @click="chooseItem(item)">
                      <span class="text-flow p-l-10">{{item.name}}</span>
                    </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="transform-item">
          <listMod
          :list="dataList" 
          :limitCount="limitCount" 
          :multiple="multiple" 
          :sumList="dataList" 
          :params="params"
          :selectData="selectData" 
          :valueKey="valueKey" 
          nameKey="viewName"></listMod>
          <Spin fix v-if="gradeloading"></Spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import listMod from './list.vue';
export default {
  name: "actSchoolGradelist",
  components: { listMod },
  props: {
    multiple: {
      type: Boolean,
      default: true,
    }, 
    isShowSearch: {
      type: Boolean,
      default: true,
    }, 
    type:String,  
    isPaging: Boolean, 
    list:{
      type: Array,
      default: ()=>[],
    },
    sumList:{
      type: Array,
      default: ()=>[],
    },
    selectData:{
      type: Array,
      default: ()=>[],
    }, 
    valueKey: {
      type: String,
      default: "id",
    },
    nameKey: {
      type: String,
      default: "name",
    },
    params:{
      type: Object,
      default(){
        return {}
      }
    },
    limitCount: Number
  },
  data() {
    return {
      inputVal: "",
      gradeloading: false,
      chooseSchool: {},
      dataList: [],
      trunNext: false
    };
  },
  computed: { 
    ids(){
        return this.selectData.map(item=>Number(item[this.valueKey]||0));
    },
    searchData(){
        return this.sumList.filter(item=>item[this.nameKey].indexOf(this.inputVal)!=-1);
    },
  },
  methods: {
    chooseItem(item){
      this.chooseSchool = item;
      this.trunNext = true;
      this.$root.selectData = [];
      this.$emit("chooseSchoolEvent", item)
      this.loadGradeData();
    },
    loadGradeData() {
      let req = "scheduleReportGrage",
          params = this.params || {};
      this.gradeloading = true;
      return this.$MainApi[req]({
          data: {
              ...params,
              school_id: this.chooseSchool.id || 0
          },
          other: {
            isErrorMsg: true
          }
      }).then((res)=>{
        if(res.code){
          let items = [];
          let data = res.data;
          if (data instanceof Array) {
              items = data || [];
          } else if (data.items) {
              items = data.items || [];
          }
          items = items.map((item, index)=>{
              return {
                id: index,
                viewName: item.grade + "(" + item.school_year + ")",
                name: item.grade
              }
          })
          this.dataList = items || [];
          console.log("dataList", this.dataList)
        }
      }).finally(()=>{
        this.gradeloading = false;
      })
    },
    // selectAll(){
    //   let isCurAll = this.selectData.length == this.list.length;
    //   console.log('selectAll',isCurAll,this.selectData.length , this.list.length)
    //   this.$root.setSelectData(isCurAll?[]:JSON.parse(JSON.stringify(this.list||[])));
    // },
    // onSelect(bool,data){
    //     if(bool){
    //         if(this.multiple){
    //           this.selectData.push(data);
    //         }else{
    //           this.$root.setSelectData([data]);
    //         }
    //     }else{
    //         let index = this.selectData.findIndex(item=>item[this.valueKey] == data[this.valueKey]);
    //         this.$delete(this.selectData,index);
    //     }
    // }
    
  },
  watch: { 
  },
};
</script>

<style lang="less" scoped>
.organize-cont {
  display: flex;
  flex-direction: column;
  position: relative;
  width:100%;
  height:100%;
  .organize-tree-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .tree-area {
      width: 100%;
      height: 100%;
    } 
  }
  //
  .search-area {
    .search-item {
      padding: 10px;
      cursor: pointer;
    }
    .search-item:hover {
      background-color: #e9f3fd;
    }
    .search-item.selected{
      background-color: #e9f3fd;
      color:#0083CE;
    }
    .img-orgn{
      margin-right:8px ;
      width: 17px;
      height: 17px;
    }
    .checkBox{
      line-height: 40px;
    }
    .searchClick{
      padding-left: 15px;
      .ivu-checkbox{
        display: none;
      }
    }
  }
}
.choose-tip{
  padding: 10px;
  flex-shrink: 0;
}
.transform-view{
  width: 200%;
  display: block;
  display: flex;
  flex: 1;
  overflow: hidden;
  transition: transform .35s;
}
.next-view{
  transform: translateX(-50%);
}
.transform-item{
  width: 50%;
  height: 100%;
  position: relative;
}
</style>