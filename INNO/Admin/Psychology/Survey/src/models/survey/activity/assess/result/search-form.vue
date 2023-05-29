<template>
    <rewrite-area class="flex">
      <Form :label-width="60" inline class="no-tip flex-b-c">
        <div>
        <FormItem :label-width="0">
          <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入姓名或者学号搜索"></rewrite-search>
        </FormItem>
        <linkageSelect :searchForm="searchForm" @on-change="search" :hideSelect="['area', 'street', 'grade-type']"></linkageSelect>
        <FormItem label="状态" >
          <Select style="width:107px;" v-model="searchForm.state" @on-change="search">
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
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "actIndexSearchForm",
    components: { linkageSelect },
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
    },
    methods: {
        search() {
            this.$emit("search");
        },
        exportHandle(){
          this.$emit("exportHandle")
        }
    },
};
</script>

<style>
</style>