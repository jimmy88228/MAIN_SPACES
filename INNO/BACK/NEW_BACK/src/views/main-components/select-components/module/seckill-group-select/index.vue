<template>
  <modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">

        <FormItem :label-width="10">
          <Input
            style="width:260px;"
            v-model="formSearch.searchq"
            placeholder="请输入分组名称"
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
// import ListComponent from '../template/template';
import Mixin from './mixin';
// import EventMixin from '../event-mixin';

export default {
  name: 'seckillGroupSelect',
  mixins: [eventMiXin, Mixin],
  components: {
    modalTemplate
  },
  data () {
    return {
      formSearch: {
        searchq: ''
      }
    }
  },
	methods:{
		onLoadData(page, exteData){
			let formSearch = this.formSearch || {};
			return this.$ajax.post( this.$api['cloudSeckillGroupList'], {
				...this.formSearch,
				...exteData
				}).then( (response) => {
						var res = response.data || {};
						if(res.code == 1){
							let data = res.data || {};
							let items = data.items || [];
							this.data = {
								items: items,
								total: data.total
							}
							return Promise.resolve(data)
						} else {
							return Promise.reject();
						}
			}).catch(()=>{
				
			})
		},
	}
}
</script>
