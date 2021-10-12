<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch"></list-component>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

export default {
  name: 'TagSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        searchq: '',
        is_enabled: 1,
        presale_type: 0,
        start_time: '',
        end_time: ''
      }
    }
  }
}
</script>
