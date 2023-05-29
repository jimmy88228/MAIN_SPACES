<template>
  <rewrite-area class="flex-b-c">
      <Form inline class="no-tip flex" :label-width="50">
          <FormItem :label-width="0">
              <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键词"></rewrite-search>
          </FormItem>
          <FormItem label="状态">
              <Select v-model="searchForm.state"  @on-change="search">
                  <Option :value="item.key" v-for="(item) in stateList" :key="item.key">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="是否限制时间" :label-width="110">
              <Select v-model="searchForm.limitTime" @on-change="(data)=>changeData(data, 'limitTime')">
                  <Option :value="item.key" v-for="(item) in limitTimeList" :key="item.key">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="时间" v-if="searchForm.limitTime == 1">
              <date-time style="width:320px;" placeholder="选择时间" type="datetimerange" v-model="searchForm.time" @change="changeDate"></date-time>
          </FormItem>
      </Form>
      <div class="flex">
        <Button icon="md-add" @click="editTask()" v-hasAction="'assessment_tasks_add'">创建活动</Button>
      </div>
  </rewrite-area>
</template>

<script>
export default {
  props: {
    searchForm: {
        type: Object,
        default: () => {},
    },
  },
  data(){
    return {
      stateList: [
          {
              key: -1,
              name: "全部",
          },
          {
              key: 0,
              name: "关闭",
          },
          {
              key: 1,
              name: "未开始",
          },
          {
              key: 2,
              name: "进行中",
          },
          {
              key: 3,
              name: "已结束",
          },
      ],
      limitTimeList: [
          {
              key: -1,
              name: "全部",
          },
          {
              key: 0,
              name: "不限制",
          },
          {
              key: 1,
              name: "限制",
          },
      ]
    }
  },
  methods: {
    search() {
        this.$emit("search");
    },
    editTask(){
      this.$emit("editTask")
    },
    changeData(val, key){
        if(key == 'limitTime'){
            this.searchForm.time = [];
        }
        this.search();
    },
    changeDate(date){
      this.searchForm.startTime = date[0] || '';
      this.searchForm.endTime = date[1] || '';
      this.$nextTick(()=>{
        this.search();
      })
    }
  }
}
</script>

<style>

</style>