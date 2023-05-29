<template>
  <div>
    <div class="level-list" v-for="(lItem, lIndex) in data" :key="lIndex"  v-show="lItem.level">
      <div class="level-tip" v-show="!searchq">
        <Checkbox  @on-change="(state)=>chooseLevel(state, lIndex)">
          <span class="C_7f">{{lItem.levelName ? lItem.levelName + "级组织" : ''}}</span>
        </Checkbox>
      </div>
      <div class="structure-list">
        <div class="structure-item" v-for="(item, index) in lItem.data" :key="index" v-show="showItem(item)">
          <Checkbox :value="selectedIds.indexOf(item.id) != -1" @on-change="(state)=>chooseStructure(state, item)">{{item.structure_name}}</Checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default(){
        return {}
      }
    },
    selected: {
      type: Array,
      default(){
        return []
      }
    },
    selectedIds: {
      type: Array,
      default(){
        return []
      }
    },
    searchq: String
  },
  computed: {},
  data(){
    return {}
  },
  methods: {
    showItem(item){
      let searchq = this.searchq || ''
      if(searchq){
        if(((searchq.indexOf(item.searchKey) != -1) || (item.searchKey.indexOf(searchq) != -1)) && item.level){
          return true;
        } else {
          return false;
        }
      }
      return !!item.level
    },
    chooseLevel(state, level){
      this.$emit("chooseLevel", {
        state,
        level
      })
    },
    chooseStructure(state, item){
      this.$emit("chooseStructure", {
        state,
        item
      })
    }
  }
}
</script>

<style lang="less" scoped>
.hide{
  display: none
}
.level-list{
  padding-right: 10px;
}
.level-tip{
  background-color:#FBFBFB;
  position:sticky;
  left: 0px;
  top: 0px;
  padding: 5px;
  z-index: 2;
}
.structure-list{
  padding-left: 20px;
}
.structure-item{
  padding: 5px;
}
.ivu-checkbox-wrapper{}
</style>