<template>
    <rewrite-area class="flex">
      <Form :label-width="60" inline class="no-tip flex-b-c">
        <div>
          <FormItem :label-width="0">
            <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名"></rewrite-search>
          </FormItem>
          <FormItem label="组织">
            <data-cascader 
            placeholder="请筛选组织" 
            ref="organizeCascader" 
            class="base-320" 
            type="organize" 
            v-model="searchForm.prent_structure_ids" 
            valueKey="id" 
            labelKey="structure_name" 
            :showDefault="true"
            :defaultData="{id: -1, structure_name: '未知'}"
            @dismiss="visibleChange"
            ></data-cascader>
          </FormItem>
          <FormItem label="状态" >
            <Select style="width:107px;" default-label="全部" v-model="searchForm.state" @on-change="search">
              <Option :value="item.key" v-for="item in stateList" :key="item.key">{{item.name}}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <Button @click="exportHandle"><Icon type="md-cloud-download" /> 导出结果</Button>
        </div>
      </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    components: { },
    data() {
        return {
          stateList: [
            {
              key: -1,
              name: "全部"
            },
            {
              key: 0,
              name: "待提交"
            },
            {
              key: 1,
              name: "已提交"
            }
          ]
        };
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        structureArr:{
          type:Array,
          default:()=>{}
        }
    },
    methods: {
        search() {
            this.$emit("search");
        },
        visibleChange(){
          this.searchForm.structure_id = this.searchForm.prent_structure_ids.slice(-1)[0]
          this.search();
        },
        exportHandle(){
          this.$emit("exportHandle")
        }
    },
};
</script>

<style>
</style>