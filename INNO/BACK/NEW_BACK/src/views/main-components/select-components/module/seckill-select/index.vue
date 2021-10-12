<template>
  <modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">
		<FormItem :label-width="80" label="所属分组" v-if="mustGroupId">
			<Tag v-if="formSearch.groupId != 0" size="large" :closable="groupId==0"
			@on-close="handleClose">{{formSearch.groupName}}</Tag>
			<Button @click="handleSeckillGroupSelect">请选择分组...</Button>
		</FormItem>	
        <FormItem :label-width="10">
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
  mixins: [Mixin, eventMiXin],
  components: {
    modalTemplate,
	// SeckillGroupSelect
  },
  props:{
		mustGroupId: {
			type: Boolean,
			default(){
				return false
			}
		},
	  groupId:{
		  type:Number,
		  default: 0,
	  },
	  groupName:{
		  type:String,
		  default:"",
	  }
  },
  data () {
    return {
      formSearch: {
				groupId: 0,
				groupName: '',
				searchq: '',
      },
    }
  },
  methods:{
	  handleSeckillGroupSelect(){
		  // 打开秒杀的分组选择
	  	this.$selectModule({
	  		mode: 'seckill-group',
	  		type: 'radio',
	  		data: [],
	  		getList: (data) => {
				this.formSearch.groupId = data[0].id;
				this.formSearch.groupName = data[0].name;
				
				// 立即搜索
				this.$refs['modalTemplate'].loadData();
	  		}
	  	})
	  },
	  handleClose(){
		  this.formSearch.groupId = 0;
		  this.formSearch.groupName = '';
		  // 立即搜索
		  this.$refs['modalTemplate'].loadData();
	  },
		onLoadData(page, exteData){
			let formSearch = this.formSearch || {};
			return this.$ajax.post( this.$api['cloudSeckillActivityList'], {
				...this.formSearch,
				mustGroupId: this.mustGroupId ? 1 : 0,
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
  },
  mounted() {
		if( this.groupId > 0 ){
			this.formSearch.groupId = this.groupId;
			this.formSearch.groupName = this.groupName;
		}
		if(this.mustGroupId){
			if( this.formSearch.groupId == 0){
				this.handleSeckillGroupSelect();
			}
		}
  }
}
</script>
