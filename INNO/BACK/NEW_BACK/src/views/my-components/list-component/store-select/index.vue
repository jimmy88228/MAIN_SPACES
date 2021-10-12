<template>
  <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
    <template v-slot:search="{ searchPage }">
      <Form :label-width="60" inline style="display: flex;">
      <Row style="width:100%;">
			<Col span="18">
        <FormItem label="回收站">
          <Select v-model="formSearch.cancel" class="basic_select">
            <Option :value="0">全部</Option>
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="20">
          <Input
            style="width:380px;"
            v-model="formSearch.search"
            placeholder="店铺名称/代码，支持模糊搜索"
            clearable
            search
            enter-button
            @on-search="searchPage(formSearch)"
            @on-clear="searchPage(formSearch)"
            @keydown.native.enter.prevent>
              <Select v-model="formSearch.search_type" slot="prepend" style="width:120px;">
                <Option :value="1">店铺名称</Option>
                <Option :value="2">门店编码</Option>
          </Select>
              
          </Input>
          
          </FormItem>
      	</Col>
        <Col span="2">
        <FormItem>
          <Button @click="importStore" type="primary"><Icon type="md-cloud-upload" />&nbsp;导入店铺</Button>
        </FormItem>
        	</Col>
		</Row>
    <!--导入-->
		<BatchImport ref="batchImportRef" @on-success="onImportSuccess" ></BatchImport>
      </Form>
    </template>
    
  </list-component>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  name: 'StoreSelect',
  props: ['data', 'saleTypeArr', 'isShowImport'],
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent,
    BatchImport
  },
  data () {
    return {
      formSearch: {
        isInit: 2,
        search: '',
        search_type: 1,
        cancel: 0,
        selectBrandId: 0
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
		importStore(){
			this.$refs.batchImportRef.openModal({
				upload: true,
				download: true
			}, this.$api.storeSearchImport, this.$api.storeSearchTpl);
		},
      onImportSuccess(data){
        console.log("data", data)
        if(data){ // 返回商品SN的,连接字符串
          this.formSearch.search_type = 2;
          this.formSearch.search = data;
          this.formSearch.page = 1;
          this.formSearch.pageSize = 10000;
          // this.$refs['listComponent'].pageSize = 1000;
          this.$refs['listComponent'].searchPage(this.formSearch);
        }
		}
  }
}
</script>
