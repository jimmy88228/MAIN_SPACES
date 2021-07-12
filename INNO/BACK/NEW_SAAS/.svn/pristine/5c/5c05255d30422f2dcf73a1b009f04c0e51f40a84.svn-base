<template>
  <div class="fan-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="40">
      <FormItem label="组名" class="group_name">
        <Input
          v-model="formSearch.groupName"
          placeholder="组名,支持模糊查询"
          class="basic_input"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage"/>
          <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <FormItem label="时间" class="date_wrapper">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
          </FormItem>
          <Row>
            <Col span="8">
              <FormItem label="店铺">
                <store-select :data="storeData" type="radio" @del-tag="handleTag">
                  <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
                </store-select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="店员状态" :label-width="80">
                <Select v-model="formSearch.staffStatus" class="basic_select">
                  <Option :value="-1">所有</Option>
                  <Option :value="0">在职</Option>
                  <Option :value="1">离职</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="店员">
                <Input v-model="formSearch.staffSeachStr" placeholder="请输入店员代码,店员名" class="basic_input"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <div style="margin-bottom: 10px;">
              <Button type="primary" @click="searchPage">搜索</Button>
              <Button type="primary" @click="clearCondition">重置</Button>
            </div>
          </Row>
        </div>
      </transition>
    </Form>
  </div>
</template>
<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  data () {
    return {
      formSearch: {
        groupName: '',
        staffSeachStr: '',
        startTime: '',
        endTime: '',
        store_id: 0,
        staffStatus: 0
      },
      isShowExtra: false,
      storeData: []
    }
  },
  components: {
    StoreSelect,
    DateSelect
  },
  methods: {
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleStart (date) {
      this.formSearch.startTime = date;
    },
    handleEnd (date) {
      this.formSearch.endTime = date;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.formSearch.store_id = data[0].id;
        }
      })
    },
    handleTag (data) {
      this.storeData = data;
      this.formSearch.store_id = 0;
    },
    clearCondition () {
      this.formSearch = {
        groupName: '',
        staffSeachStr: '',
        startTime: '',
        endTime: '',
        store_id: 0,
        staffStatus: 0
      };
      this.$refs.dateSelect.reset();
      this.storeData = [];
      this.formSearch.store_id = 0;
    },
  }
}
</script>

<style lang="less">
.fan-search{
  .group_name{
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
  }
  .fan-search_input{
    width:320px;
    .fan-search_select{
      width: 100px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .date_wrapper{
    width: 100%;
  }
  .ivu-form-item{
    width: 100%;
    margin-bottom: 10px;
    padding-right: 10px;
  }
}
</style>
