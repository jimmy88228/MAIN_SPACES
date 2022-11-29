<template>
  <div class="organize-cont">
    <rewrite-area v-if="isShowSearch">
      <Input v-model="inputVal" prefix="ios-search" placeholder="搜索" style="width: 100%;" clearable @on-change="search" />
    </rewrite-area>
    <div class="organize-tree-area">
      <div class="tree-area" v-bar>
        <div style="padding-right: 10px;">
          <div class="search-area">
            <template v-if="inputVal && searchData.length==0">
                 <div class="empty-area" v-if="!searchData || searchData.length == 0">暂无匹配数据</div>
            </template>
            <template v-else> 
                <div class="search-item flex-s-c" :class="[ids.indexOf(Number(item.id)) != -1 ? 'selected' : '']" v-for="(item) in (inputVal?searchData:list)" :key="item.id">
                <div>
                    <Checkbox 
                    :value="ids.indexOf(Number(item.id)) != -1" 
                    @on-change="(state)=>onSelect(state, item)" 
                    class="flex-s-c checkBox" 
                    style="width:100%;">
                    <span class="text-flow p-l-10">{{item[nameKey]}}</span>
                    </Checkbox>
                </div>
                </div>
            </template>
            <!-- <div class="empty-area" v-if="!searchData || searchData.length == 0">暂无匹配数据</div> -->
          </div>
        </div>
      </div>
    </div>
    <Spin fix v-show="loading"></Spin>
  </div>
</template>

<script>
export default {
  name: "listModal",
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
  },
  data() {
    return {
      inputVal: "",
      loading: false,
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
    search(e){
        console.log(e)
    },
    onSelect(bool,data){
        if(bool){
            this.selectData.push(data);
        }else{
            let index = this.selectData.findIndex(item=>item.id == data.id);
            this.$delete(this.selectData,index);
        }
    }
    
  },
  watch: { 
  },
};
</script>

<style lang="less">
.organize-cont {
  display: flex;
  flex-direction: column;
  position: relative;
  width:100%;
  height:100%;
  .organize-tree-area {
    flex: 1;
    overflow: hidden;
    .tree-area {
      width: 100%;
      height: 100%;
    } 
  }
  //
  .search-area {
    .search-item {
      padding: 3px;
      margin-bottom: 5px;
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
</style>