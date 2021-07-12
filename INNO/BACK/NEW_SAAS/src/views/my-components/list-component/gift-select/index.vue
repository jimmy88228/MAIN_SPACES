<template>
  <div class="gift-select">
    <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch"></list-component>
  </div>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

export default {
  name: 'GiftSelect',
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

<style lang="less">
.template-modal{
  .gift_item{
    display: flex;
    align-items: center;
    flex-direction: column;
    .img_wrapper{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #efefef;
      overflow: hidden;
      margin-bottom: 4px;
    }
  }
}
</style>
