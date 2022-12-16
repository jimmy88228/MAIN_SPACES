<template>
    <Form class="choose-problem-form no-tip m-b-10" inline :label-width="80">
      <Form-item label="题目状态" >
        <Select v-model="searchForm.state" @on-change="changeState()">
          <Option :value="-1">全部</Option>
          <Option :value="0">未关联维度</Option>
          <Option :value="1">已关联维度</Option>
        </Select>
      </Form-item>
      <Form-item label="关联维度">
        <dimensionSelect style="width: 200px;" :canEdit="false" :showData="hasDimensions" :multiple="true" @change="search()" :disabled="searchForm.state != 1" :modelId="modelId" v-model="searchForm.dimensions" placeholder="选择维度"></dimensionSelect>
      </Form-item>
    </Form>
</template>

<script>
import dimensionSelect from "../../components/dimension-select/index";
export default {
    name: "chooseProblemSearchForm",
    components: { dimensionSelect },
    data() {
        return {};
    },
    props: {
        modelId: {
          type: Number | String,
          default: 0
        },
        searchForm: {
            type: Object,
            default: () => {},
        },
        hasDimensions: {
          type: Array,
          default: ()=>{
            return []
          }
        }
    },
    methods: {
      changeState(){
        if(this.searchForm.state != 1){
          this.searchForm.dimensions = [];
        }
        this.search();
      },
      search() {
          this.$emit("search");
      }
    },
};
</script>

<style lang="less">
.choose-problem-form.ivu-form-inline{
    .ivu-form-item-label{
      top:0px;
      transform: translateY(0);
      padding: 6px;
      padding-left: 0px;
    }
}
</style>