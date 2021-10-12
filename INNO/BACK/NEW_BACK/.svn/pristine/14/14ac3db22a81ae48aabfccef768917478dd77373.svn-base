<template>
    <div class="goods-autosyn">
        <Card>
            <Row>
                <Col :span="16">
                    <SearchForm :stock-type="stockType" @on-search="searchPage"></SearchForm>
                </Col>
                <Col :span="8" class="save">
                    <Button type="primary" @click="modalOk">保存</Button>
                </Col>
            </Row>
            <Transfer
                :list-style="transferStyle"
                :titles="titles"
                :data="originData"
                :target-keys="targetData"
                :render-format="renderData"
                filterable
                :filter-method="filterMethod"
                filter-placeholder="请输入关键字"
                @on-change="onChange">
                <div :style="{float: 'right', margin: '5px'}">
                    <Button size="small" @click="reloadData">重置数据</Button>
                </div>
            </Transfer>
        </Card>
        <Spin size="large" fix v-if="showspin"></Spin>
    </div>
</template>

<script>
import SearchForm from './search-form';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      searchForm: {
        search: '',
        type: 1
      },
      stockType: {},
      storeList: [],
      warehouse: [],

      titles: ['待选店铺', '选定店铺'],
      originData: [],
      targetData: [],
      transferStyle: {
        width: '40%',
        height: '400px'
      },
      // 用来存储原始同步数据
      tempSaveData: [],
      showspin:true,
    }
  },
  methods: {
    searchPage (searchForm) {
      this.showspin=true;
      this.searchForm = { ...searchForm };
        	return this.$ajax.post(this.$api.goodsAutosyn, searchForm)
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            this.stockType = res.data && res.data.stock_type;
            this.storeList = res.data && res.data.store_list;
            this.warehouse = res.data && res.data.warehouse;
            this.selectStoreList = res.data && res.data.select_store_list;
            this.selectWarehouseList = res.data && res.data.select_warehouse_list;
            if (this.searchForm.type == 1) {
              // 店铺数据
              this.originData = [...this.storeList, ...this.selectStoreList].map(item => {
                return Object.assign({}, item, {
                  label: item.name,
                  key: item.code
                });
              });
              this.targetData = this.selectStoreList.map(item => {
                return item.code;
              });
            } else if (this.searchForm.type == 2) {
              // 仓库数据
              this.originData = [...this.warehouse, ...this.selectWarehouseList].map(item => {
                return Object.assign({}, item, {
                  label: item.name,
                  key: item.code
                });
              });
              this.targetData = this.selectWarehouseList.map(item => {
                return item.code;
              });
            }
            this.tempSaveData = [...this.targetData];
          }
        }).finally(()=>{
          this.showspin=false;
        });
    },
    loadData (page) {
      this.showspin=true;
      return this.$ajax.post(this.$api.goodsAutosyn, { page })
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.stockType = res.data && res.data.stock_type;
          }
          this.showspin=false;
        }).finally(()=>{
          
          this.showspin=false;
          console.log("输出", this.showspin)
        });
    },
    // Transfer操作
    renderData (item) {
      const shopkName = item.name;
      const shopCode = item.code;
      return `${shopkName}(${shopCode})`;
    },
    onChange (newTargetKeys) {
      this.targetData = newTargetKeys;
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1;
    },
    reloadData () {
      this.targetData = [...this.tempSaveData];
    },
    modalOk () {
      if (this.targetData.length === 0) {
        this.$Modal.error({
          title: '提示',
          content: '请选择内容'
        });
        return false;
      }
      return this.$ajax.post(this.$api.goodsAutosynSave, {
        type: this.searchForm.type,
        code: this.targetData.join(',')
      })
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.$Message.success(res.message);
          }
        });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.goods-autosyn{
    .save{
        text-align: right;
    }
}
</style>
