<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form inline style="display: flex;">
        <FormItem>
          <Input
            style="width:340px;"
            v-model="formSearch.search"
            placeholder="请输入关键字"
            clearable
            search
            enter-button
            @on-search="searchPage(formSearch)"
            @on-clear="searchPage(formSearch)"
            @keydown.native.enter.prevent>
              <Select v-model="formSearch.search_type" slot="prepend" style="width:120px;">
                <Option :value="1">店员名称</Option>
                <Option :value="2">代码</Option>
                <Option :value="3">电话</Option>
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
        isInit: 1,
        search_type: 1,
        search: '',
        store_id: 0
      }
    }
  },
  watch: {
    extraAddtion: {
      handler (nV) {
        this.formSearch = Object.assign({}, this.formSearch, this.extraAddtion);
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
