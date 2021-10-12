<template>
  <div class="goods-select">
    <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
      <template v-slot:selected="{ selectedData, delItem }">
		<span class="item"v-for="(item, index) in selectedData" :key="index">
		  <p class="title">
			{{ item.name || '&nbsp;'}}
		  </p>
		  <Icon type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)"/>
		</span>
      </template>
      <template v-slot:search="{ searchPage, data }">
        <Form ref="formSearch" :model="formSearch" :label-width="100" inline class="goods_search">
          <FormItem label="选择标签分类">
            <Select v-model="tabType" @on-change="changeTabs">
              <Option :value="item.type" v-for="(item, index) in tabs" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>
    </list-component>
  </div>
</template>

<script>
import ListComponent from '../template/template';
import mixin from './mixin';
import EventMixin from '../event-mixin';
export default {
  name: 'labelSelect',
  mixins: [mixin, EventMixin],
  components: {
    ListComponent
  },
  props: {
	extraData: Object, //
  },
  data () {
    return {
      formSearch: {},
      tabType: "auto",
      currentSort: [],
      isClear: false,
			tabs: [
				{
				type: "auto",
				name: "基础标签"
				},
				{
				type: "buy", 
				name:"消费统计标签"
				},
				{
				type: "goods", 
				name:"商品销售标签"
				},
				{
				type: "manual", 
				name:"手动标签"
				},
				{
				type: "mkt", 
				name:"营销标签"
				},
				{
				type: "visit", 
				name:"访问标签"
				},
				{
				type: "storestaff", 
				name:"导购标签"
				},
				{
				type: "erp", 
				name: "ERP标签"
				}
			]
    }
  },
  methods: {
      loadExtraData(){
        this.$nextTick(()=>{
			if(this.showTab){
				let showTab = this.showTab;
				if(typeof showTab == 'string'){
					showTab = showTab.split(",");
				}
				let tabs = []
				for(let i = 0; i < this.tabs.length; i++){
					if(showTab.indexOf(this.tabs[i].type) != -1){
						tabs.push(this.tabs[i])
					}
				}
				this.tabType = tabs[0].type;
				console.log("this.tabType", this.tabType);
				this.tabs = tabs;
			}
			this.currentStatus.mode = this.tabType;
        })
      },
	  changeTabs(name){
		  this.tabType = name;
		  this.currentStatus.mode = name;
	  },
	  getkeyName(type){
		  let tabs = this.tabs || [], name = null;
		  for(let i in tabs){
			  if(tabs[i].type == type){
				  name = tabs[i].name;
				  break;
			  }
		  }
		  return name;
	  }
  },
  mounted () {
    this.loadExtraData();
  }
}
</script>

<style lang="less">
.template-modal{
  .goods_search{
    .ivu-form-item{
      margin-bottom: 8px;
    }
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
    .ivu-input-icon-clear{
			right:50px;
		}
		.goods-search_input{
			width:320px;
			.goods-search_select{
				width: 90px;
			}
		}
  }
}
</style>
