<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form inline style="display: flex;">
        <FormItem>
            <Input
            v-model="formSearch.searchq"
            style="width:400px;"
            placeholder="关键词搜索"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
            <Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px;">
              <Option value="dstb_staff_name">店员名称</Option>
              <Option value="dstb_staff_code">代码</Option>
              <Option value="dstb_staff_phone">电话</Option>
            </Select>
          </Input>
        </FormItem>
      </Form>
    </template>
  </list-component>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

export default {
  name: 'StaffSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        store_id: 0,
        is_level: '0', //等级 0全部 1 等级一 2 等级二
        is_bind: '0', //是否绑定 0全部 1 是 2 否
        is_enabled: '0',  //是否启用 0全部 1 是 2 否
        status: '-1', //分销员状态 -1全部 0 离职 1 在职 2 兼职
        start_time: '', //开始时间
        end_time: '', //结束时间
        searchq: '',  //搜索值
        searchq_type: '',  //搜索类型
        sortType: 'DESC'
      }
    }
  }
}
</script>
