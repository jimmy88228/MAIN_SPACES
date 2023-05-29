<template>
  <div>
    <template v-if="cellData.type == 'search'">
      <rewrite-search v-model="searchForm[cellData.key]" @search="activeHandle" :placeholder="cellData.placeholder"></rewrite-search>
    </template>
    <template v-else-if="cellData.type == 'select'">
        <template v-if="cellData.isCustom">
            <data-select class="max-150" v-model="searchForm[cellData.key]" :type="cellConf.type" :value-key="cellConf.valueKey" :params="cellConf.params" :name-key="cellConf.nameKey" @change="activeHandle" @changeData="activeDataHandle"></data-select>
        </template>
        <template v-else>
            <Select class="max-150" v-model="searchForm[cellData.key]" @on-change="activeHandle">
                <Option v-for="(oItem, oIndex) in cellData.data" :key="oIndex" :value="oItem[cellConf.valueKey || 'id']">{{oItem[cellConf.nameKey || 'name']}}</Option>
            </Select>
        </template>
    </template>
    <template v-else-if="cellData.type == 'button'">
        <Button :type="cellConf.type" @click="activeHandle" :disabled="cellData.disabled" :icon="cellData.icon">{{cellData.label}}</Button>
    </template>
    <template v-else-if="cellData.type == 'structure'">
      <linkageSelect :isShowSchoolYear="cellConf.isShowSchoolYear" :searchForm="searchForm" @on-change="activeHandle" :hideSelect="cellConf.hideSelect"></linkageSelect>
    </template>
  </div>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
  components: {
    linkageSelect
  },
  props: {
    cellData: {
      type: Object,
      default(){
        return {}
      }
    },
    searchForm: {
        type: Object,
        default(){
            return {}
        }
    },
  },
  data(){
    return {
      
    }
  },
  computed: {
    cellConf(){ // cellConf 每个元件独有的属性， props,
      return this.cellData.cell || {};
    }
  },
  methods: {
    activeHandle(e){
      if(typeof(this.cellData.active) == "function"){
        this.cellData.active(e);
      } else {
        this.$emit("search");
      }
    },
    activeDataHandle(e){
      if(typeof(this.cellData.activeData) == "function"){
        this.cellData.activeData(e);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.max-150{
  max-width: 150px;
}
</style>