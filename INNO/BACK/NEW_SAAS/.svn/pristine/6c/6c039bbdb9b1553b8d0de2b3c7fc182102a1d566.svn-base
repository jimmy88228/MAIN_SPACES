<template>
    <div class="product_sale_kind">
        <BatchImport ref="batchImport" >
            <!-- <template v-slot:header>
              <label>商品类型</label>
              <Select v-model="proType" class="basic_select select_fixed" @on-change="handleTypeChange">
                <Option value="1">正常商品</Option>
                <Option value="4">促销</Option>
                <Option value="99">赠品</Option>
              </Select>
            </template> -->
            <template v-slot:footer>
                <span class="sign">备注： 建议上传数量不超过100000条数据</span>
            </template>
        </BatchImport>
    </div>
</template>

<script>
import BatchImport from './batch-import';

export default {
  components: {
    BatchImport
  },
  data () {
    return {
      proType: 0,
      typeParams: {
        sale_type: 0
      }
    }
  },
  computed: {
    // typeUpload () {
    //   return this.typeParams.sale_type !== 0;
    // }
  },
  methods: {
    // handleTypeChange () {
    //   this.typeParams.sale_type = this.proType;
    // }
  },
  mounted () {
    // 批量修改价格
    this.$refs.batchImport.openModal(this.$api.goodsBatchSaleKind, this.$api.goodsBatchSaleKindTpl);
  }
}
</script>

<style lang="less" scoped>
.product_sale_kind{
    .sign{
        color: red;
    }
}
</style>
