<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch"></list-component>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

export default {
  name: 'PagesSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {}
    }
  }
}
</script>
