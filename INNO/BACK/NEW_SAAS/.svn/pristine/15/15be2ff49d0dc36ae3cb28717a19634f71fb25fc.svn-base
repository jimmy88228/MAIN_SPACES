<template>
    <div class="export">
        <Card class="goods-list">
            <Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
                <TabPane name="product-upload" label="商品批量上传">
                    <productUpload></productUpload>
                </TabPane>
                <TabPane name="product-price" label="批量修改价格(条码)">
                    <productPrice></productPrice>
                </TabPane>
                <TabPane name="product-price-sn" label="批量修改价格(货号)">
                    <productPriceSn></productPriceSn>
                </TabPane>
                <TabPane name="product-stock" label="批量修改库存">
                    <productStock></productStock>
                </TabPane>
                <TabPane name="product-sale" label="商品批量上架">
                    <productSale></productSale>
                </TabPane>
                <TabPane name="product-name" label="批量修改商品名">
                    <product-name></product-name>
                </TabPane>
                <TabPane name="giveaway" label="批量上传赠品">
                    <giveaway></giveaway>
                </TabPane>
                <TabPane name="product-sort" label="批量修改排序">
                    <product-sort></product-sort>
                </TabPane>
                <TabPane name="product-other" label="批量修改-其他">
                    <product-other></product-other>
                </TabPane>
                <TabPane name="product-per" label="批量修改提成比例">
                    <product-per></product-per>
                </TabPane>
                <TabPane name="product-relate" label="批量导入关联关系">
                    <product-relate></product-relate>
                </TabPane>
                <TabPane name="product-album" label="批量上传商品相册">
                    <product-album></product-album>
                </TabPane>
                <TabPane name="product-thumbnail" label="批量上传商品缩略图">
                    <product-thumbnail></product-thumbnail>
                </TabPane>
                <TabPane name="product-detail" label="批量上传商品详情图">
                  <product-detail></product-detail>
                </TabPane>
                <TabPane name="product-cat" label="批量上传商品分类">
                  <product-cat></product-cat>
                </TabPane>
                <TabPane name="product-clear-sell-point" label="批量清空卖点">
                  <product-clear-sell-point></product-clear-sell-point>
                </TabPane>
                <TabPane name="product-product-sn" label="批量修改条码">
                  <product-product-sn></product-product-sn>
                </TabPane>
                <TabPane name="product-sale-kind" label="批量修改售卖类型">
                  <product-sale-kind></product-sale-kind>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
import productUpload from './product-upload';
import productPrice from './product-price';
import productPriceSn from './product-price-sn';
import productStock from './product-stock';
import productSale from './product-sale';
import ProductName from './product-name';
import giveaway from './giveaway';
import ProductOther from './product-other';
import ProductSort from './product-sort';
import ProductPer from './product-per';
import ProductRelate from './product-relate';
import ProductAlbum from './product-album';
import ProductThumbnail from './product-thumbnail';
import ProductDetail from './product-detail';
import ProductCat from './product-cat';
import ProductClearSellPoint from './product-clear-sell-point';
import ProductProductSn from './product-product-sn';
import ProductSaleKind from './product-sale-kind';

export default {
  data () {
    return {
      tabsName: 'product-upload'
    }
  },
  components: {
    productUpload,
    productPrice,
    productPriceSn,
    productStock,
    productSale,
    ProductName,
    giveaway,
    ProductOther,
    ProductSort,
    ProductPer,
    ProductRelate,
    ProductAlbum,
    ProductThumbnail,
    ProductDetail,
    ProductCat,
    ProductClearSellPoint,
    ProductProductSn,
    ProductSaleKind
  },
  methods: {
    onTabsClick (name) {
        this.$Notice.destroy()
    	}
  }
}
</script>

<style lang="less">
.export{
  .select_fixed{
    margin-bottom: 10px;
  }
}
</style>
