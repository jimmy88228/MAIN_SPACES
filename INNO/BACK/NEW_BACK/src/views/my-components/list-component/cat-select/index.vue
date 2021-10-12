<template>
  <div class="goods-select">
    <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
      <template v-slot:selected="{ selectedData, delItem }">
        <span class="item goods_item" v-for="item in selectedData" :key="item.id">
          <p class="title">
            {{item.cat_name || item.vcat_name || item.name || '&nbsp;'}}
          </p>
          <Icon type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)"/>
        </span>
      </template>
      <template v-slot:search="{ searchPage, data }">
        <Form ref="formSearch" :model="formSearch" :label-width="90" inline class="goods_search">
          <FormItem label="选择分类">
            <Select v-model="catType" @on-change="changeCat">
              <Option value="catTree">标准分类</Option>
              <Option value="vcatTree">自定义分类</Option>
            </Select>
            <!-- &nbsp;&nbsp;
            <Button type="primary" @click="searchPage(formSearch)">
              <Icon type="ios-search" />搜索
            </Button> -->
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

const defaultItem = {
  value: '0',
  label: '顶级分类',
  children: []
};
export default {
  name: 'GoodsSelect',
  mixins: [mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {},
      catType: "catTree",
      currentSort: [],
      isClear: false,
    }
  },
  methods: {
      changeCat(val){
        if(val){
          this.currentStatus.mode = val;
          this.currentStatus.listKey = val == 'catTree' ? 'cat_id' : val == 'vcatTree' ? 'vcat_id' : '';
          if(val == 'catTree'){
            this.columns = this.columns.slice(0, 1).concat(this.cat_columns);
          } else if(val == 'vcatTree'){
            this.columns = this.columns.slice(0, 1).concat(this.vcat_columns);
          }
        }
      },
      loadExtraData(){
        this.$nextTick(()=>{
          this.changeCat(this.catType);
        })
        
      },
  },
  mounted () {
    // 获取分类数据
    this.loadExtraData();
  }
}
</script>

<style lang="less">
.template-modal{
  .goods_item{
    display: flex;
    align-items: center;
    flex-direction: column;
    .img_wrapper{
      width: 50px;
      height: 50px;
      border: 1px solid #efefef;
      overflow: hidden;
      margin-bottom: 4px;
      .img{
        width: 50px;
        object-fit: contain;
      }
    }
  }
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
