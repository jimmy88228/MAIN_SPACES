<template>
    <rewrite-area class="flex">
      <Form :label-width="60" inline class="no-tip">
        <FormItem :label-width="0">
          <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名"></rewrite-search>
        </FormItem>
        <FormItem label="组织">
        <!-- <linkageSelect :searchForm="searchForm" @on-change="search"></linkageSelect> -->
          <data-cascader ref="organizeCascader" class="base-320" type="organize" v-model="searchForm.prent_structure_ids" valueKey="id" labelKey="structure_name" @dismiss="visibleChange"></data-cascader>
        </FormItem>
        <FormItem label="状态" >
          <Select style="width:107px;" default-label="全部" v-model="searchForm.state" @on-change="search">
            <Option :value="item.key" v-for="item in stateList" :key="item.key">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "actIndexSearchForm",
    components: { linkageSelect },
    data() {
        return {
          stateList: [
            {
              key: -1,
              label: "全部"
            },
            {
              key: 0,
              label: "未完成"
            },
            {
              key: 1,
              label: "已完成"
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
      //   changeOrganize(data) {
      //     this.searchForm.structure_id = data.slice(-1)[0]
      //     this.search();
      // // this.organizeInfo.pid = Number(data.slice(-1)[0]);
      // console.log(data,333)
      //   },
        visibleChange(){
          this.searchForm.structure_id = this.searchForm.prent_structure_ids.slice(-1)[0]
          this.search();
        },
    }
};
</script>

<style>
</style>