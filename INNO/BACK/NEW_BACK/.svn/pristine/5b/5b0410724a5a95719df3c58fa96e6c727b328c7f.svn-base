<template>
    <div class="export">
        <Card class="goods-list">
            <Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
                <TabPane name="product-upload" label="商品批量上传">
                    <productUpload></productUpload>
                </TabPane>
                <TabPane name="product-name" label="批量修改商品名">
                    <ProductName></ProductName>
                </TabPane>
                <TabPane name="product-sort" label="批量修改排序">
                    <ProductSort></ProductSort>
                </TabPane>
                <TabPane name="product-other" label="批量修改-其他">
                    <ProductOther></ProductOther>
                </TabPane>
                <TabPane name="product-per" label="批量修改提成比例">
                    <Product-per></Product-per>
                </TabPane>
                <TabPane name="product-relate" label="批量导入关联关系">
                    <ProductRelate></ProductRelate>
                </TabPane> 
                <TabPane name="product-album" label="批量上传商品相册">
                    <ProductAlbum></ProductAlbum>
                </TabPane> 
                <TabPane name="product-thumbnail" label="批量上传商品缩略图">
                    <ProductThumbnail></ProductThumbnail>
                </TabPane>
                <TabPane name="product-detail" label="批量上传商品详情图">
                    <ProductDetail></ProductDetail>
                </TabPane>                      
            </Tabs>
        </Card>
    </div>
</template>

<script>
import productUpload from './product-upload'; //上传
import ProductName from './product-name'; //商品名
import ProductOther from './product-other'; //其他
import ProductSort from './product-sort'; //排序
import ProductRelate from './product-relate'; //关联关系
import ProductAlbum from './product-album'; //批量上传商品相册
import ProductThumbnail from './product-thumbnail'; //批量上传商品缩略图
import ProductDetail from './product-detail'; //批量上传商品详情图
import ProductPer from './product-per'; //批量修改提成比例

export default {
  data () {
    return {
      tabsName: 'product-upload'
    }
  },
  components: {
    productUpload,
    ProductName,
    ProductOther,
    ProductSort,
    ProductRelate,
    ProductAlbum,
    ProductThumbnail,
    ProductDetail,
    ProductPer
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
