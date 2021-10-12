<template>
  <!-- <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch"> -->
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="900">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">
        <FormItem :label-width="20">
          <Input
            style="width:260px;"
            v-model="formSearch.searchq"
            placeholder="请输入活动名称"
            clearable
            search
            enter-button
            @on-search="searchPage(formSearch)"
            @on-clear="searchPage(formSearch)"
            @keydown.native.enter.prevent/>
        </FormItem>
      </Form>
    </template>
  </modalTemplate>
</template>

<script>
import modalTemplate from '../../template/modal-template.vue';
import eventMiXin from '../../event-mixin.js';
import Mixin from './mixin';
export default {
  name: 'TagSelect',
  mixins: [eventMiXin, Mixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        searchq: '',
        enabled: 1,
        status: 0,
        time_type: 1
      }
    }
  }
}
</script>
