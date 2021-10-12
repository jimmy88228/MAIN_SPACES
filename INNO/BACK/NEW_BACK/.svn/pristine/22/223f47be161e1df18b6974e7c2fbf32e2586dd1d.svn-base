

<template>
  <div class="list-head statistics-page">
      <Divider orientation="left">{{ title }}</Divider>
     
        <Row>
            <Form ref="formSearch"  :model="formSearch" :label-width="86">
              <Col span="8"> 
              <FormItem label="分组名称">
                <Select
                  v-model="formSearch.cat_id" 
                  multiple
                  filterable 
                  v-if="isSelect"
                  placeholder="请选择分组" 
                  style="width:250px" 
                >
                    <Option v-for="(item, index) in catList" :value="item.id" :key="index" :label="item.cat_name"></Option>
                </Select>
              </FormItem> 
              </Col> 
              <Col span="8">
              <FormItem label="标签名称">
                <div class="flex" style="width:400px" >
                  <Input v-model="formSearch.searchq" clearable placeholder="请输入标签名称" style="width:200px"  class="basic_input"  />
                  <Button type="primary" @click="successHandle"><Icon type="ios-search" /></Button>
                </div>
              </FormItem> 
              </Col>           
            </Form>
          <Col span="8">
           <div class="operate-btn">
            <Button type="primary" @click="labelHandle" v-if="canAction.add">+ 新建标签</Button>&nbsp;&nbsp;
            <Button type="primary" @click="groupHandle" v-if="canAction.addgroup">+ 新建分组</Button>
          </div>
          </Col>
  
        </Row>

  </div>
</template>

<script>
export default {
  name: 'labelHead',
  components: {},
  props: {
    title: {
      type: String,
      default(){
        return "标题"
      }
    },
    canAction: {
      type: Object,
      default(){
        return {}
      }
    },
    catArr: {
      type: Array,
      default(){
        return {}
      }
    }
  },
  data () {
    return {
      formSearch:{
        cat_id:[],
        searchq:'',
      },
      catList:[],
      isSelect:true,
    }
  },
  methods: {
    labelHandle(){
      this.$emit("on-labelHandle");
    },
    groupHandle(){
      this.$emit("on-groupHandle");
    },
    successHandle(){
      this.$emit("on-success",this.formSearch);
    }
  },
  watch:{
    catArr:function(nv){
      this.catList=nv;
    }
  }
}
</script>

<style lang="less">
.list-head{
  padding-bottom:20px;
  .operate-btn{
    width:100%;
    display:flex;
    justify-content: flex-end;
  }
} 
</style>
