<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="时间" class="date_wrapper" :label-width="80">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
      <FormItem label="渠道类型" class="form_padding" :label-width="80">
        <Tree :data="agentList" show-checkbox @on-check-change="handleCheckChange"></Tree>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchPage">搜索</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    DateSelect,
    StoreSelect
  },
  data () {
    return {
      formSearch: {
        agentCol: [],

        start_time: '',  //开始时间   
        end_time: '',  //结束时间
        agentIds: 0 //区域id

      },
      agentList: [],
      isClear: false
    }
  },
  methods: {
    handleData (d) {
      return d.map(item => {
        return {
          title: item.label,
          value: item.value,
          expand: item.children.length !== 0 ? true : false,
          children: item.children ? this.handleData(item.children) : []
        }
      })
    },
    loadExtraData () {
      this.$ajax.post(this.$api.getAgent)
      .then(response => {
        const res = response.data;
        if (res.code) {
          const origin = res.data && res.data.items;
          this.agentList = [{
            title: '全部',
            expand: true,
            children: this.handleData(origin)
          }];
          // console.log(this.handleData(origin));
        }
      });
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.formSearch.storeData,
        getList: (data) => {
          this.formSearch.storeData = data;
        }
      })
    },
    handleTag (data) {
      this.formSearch.storeData = data;
    },
    handleCheckChange (value, current) {
      this.formSearch.agentIds = value.map(item => item.value).join();
    }
  },
  mounted () {
    this.loadExtraData()
  }
}
</script>

<style lang="less">
.brand-search{
    .brand-search_input{
        width:320px;
        .brand-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
    .edit-select{
      width: 300px;
    }
}
</style>
