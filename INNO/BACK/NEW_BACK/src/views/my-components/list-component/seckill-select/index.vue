<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">
		<FormItem :label-width="80" label="所属分组">
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
  </list-component>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';
import SeckillGroupSelect from '@/views/my-components/list-component/index-edit';

export default {
  name: 'TagSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent,
	SeckillGroupSelect
  },
  props:{
	  groupId:{
		  type:Number,
		  default: 0,
	  },
	  groupName:{
		  type:String,
		  default:"",
	  },
      groupApi: {
          type:String,
          default:"seckill-group",
      }
  },
  data () {
    return {
      formSearch: {
		  groupId: 0,
		  groupName: '',
		  searchq: '',
		  mustGroupId: 1,
      },
    }
  },
  methods:{
	  handleSeckillGroupSelect(){
		  // 打开秒杀的分组选择
	  	this.$selectContent({
	  		mode: 'seckill-group',
            reqConfig: this.groupApi,
	  		type: 'radio',
	  		data: [],
	  		getList: (data) => {
				this.formSearch.groupId = data[0].id;
				this.formSearch.groupName = data[0].name;
				
				// 立即搜索
				this.$refs['listComponent'].searchPage(this.formSearch);
	  		}
	  	})
	  },
	  handleClose(){
		  this.formSearch.groupId = 0;
		  this.formSearch.groupName = '';
		  
		  // 立即搜索
		  this.$refs['listComponent'].searchPage(this.formSearch);
	  }
  },
  mounted() {
	if( this.groupId > 0 ){
		this.formSearch.groupId = this.groupId;
		this.formSearch.groupName = this.groupName;
	}
  	if( this.formSearch.groupId == 0 ){
		this.handleSeckillGroupSelect();
	}
  }
}
</script>
