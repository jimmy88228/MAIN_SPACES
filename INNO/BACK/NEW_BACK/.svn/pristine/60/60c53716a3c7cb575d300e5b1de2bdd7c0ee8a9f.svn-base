<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form ref="formSearch" :model="formSearch" inline>
        <FormItem>
          <Input
            v-model="formSearch.searchq"
            style="width:280px;"
            placeholder="请输入关键字"
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
  name: 'ArticleSelect',
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
