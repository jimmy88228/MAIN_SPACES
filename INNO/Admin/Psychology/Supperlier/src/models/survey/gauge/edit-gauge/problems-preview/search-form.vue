<template>
    <Form class="choose-problem-form no-tip m-b-10 p-10" inline :label-width="80">
      <Form-item label="筛选维度">
        <dimensionSelect :canEdit="false" type="gauge" :showData="hasDimensions" :multiple="false" @change="search()" :id="modelId" v-model="searchForm.dimensions" placeholder="选择维度"></dimensionSelect>
      </Form-item>
    </Form>
</template>

<script>
// import dimensionSelect from "@/models/survey/gauge/edit-gauge/components/dimension-select/index.vue";
import dimensionSelect from "@/components/view-components/editable-select/index.vue";

export default {
    name: "previewProblemSearchForm",
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