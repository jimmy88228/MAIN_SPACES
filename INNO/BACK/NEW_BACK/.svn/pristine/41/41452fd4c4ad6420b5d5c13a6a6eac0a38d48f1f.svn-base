<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">
        <FormItem :label-width="20">
          <Input
            style="width:280px;"
            v-model="formSearch.searchq"
            placeholder="微信群名称/编码，支持模糊搜索"
            clearable
            search
            enter-button
            @on-search="searchPage(formSearch)"
            @on-clear="searchPage(formSearch)"
            @keydown.native.enter.prevent></Input>
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
  name: 'WeChatGroup',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        searchq: ''
      }
    }
  }
}
</script>
