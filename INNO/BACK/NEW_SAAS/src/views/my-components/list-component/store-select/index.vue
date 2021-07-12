<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">
        <FormItem label="回收站">
          <Select v-model="formSearch.cancel" class="basic_select">
            <Option :value="0">全部</Option>
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="20">
          <Input
            style="width:380px;"
            v-model="formSearch.search"
            placeholder="店铺名称/代码，支持模糊搜索"
            clearable
            search
            enter-button
            @on-search="searchPage(formSearch)"
            @on-clear="searchPage(formSearch)"
            @keydown.native.enter.prevent>
              <Select v-model="formSearch.search_type" slot="prepend" style="width:120px;">
                <Option :value="1">店铺名称</Option>
                <Option :value="2">门店编码</Option>
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
  name: 'StoreSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        isInit: 2,
        search: '',
        search_type: 1,
        cancel: 0,
        selectBrandId: 0
      }
    }
  }
}
</script>
