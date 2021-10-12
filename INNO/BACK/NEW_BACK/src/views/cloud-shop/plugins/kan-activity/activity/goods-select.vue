<template>
  <div class="goods_select">
    <Table :columns="goodsTypeColumns" :data="goodsTypetableData" ref="goodsType" class="table">
      <template slot-scope="{ row }" slot="name">
        <div class="img_list_wrap">
          <div class="img_fixed">
            <img :src="row.goods_thumb2" v-if="row.goods_thumb2" :alt="row.goods_thumb2" v-viewer/>
            <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else />
          </div>
          <div class="sort_wrapper">
            {{row.goods_name}}
          </div>
        </div>
      </template>
      <template slot="handle">
        <span @click="handleDel"><a>删除</a></span>
        <span><a @click="handleEditStock()">设置库存</a></span>
      </template>
    </Table>
    <Table :columns="goodsSpecColumns" :data="goodsSpectableData" ref="goodsSpecType" class="table">
      <template slot-scope="{ row }" slot="isOnsale">
        <span>{{Number(row.is_onsale) ? '上架' : '下架'}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="number">
        <InputNumber v-model="row.product_number" :min="0" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'product_number')"/>
      </template>
      <template slot-scope="{ row, index }" slot="price">
        <InputNumber v-model="row.market_price" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'market_price')"/>
      </template>
      <template slot-scope="{ row, index }" slot="salePrice">
        <InputNumber v-model="row.bottom_price" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'bottom_price')"/>
      </template>
      <template slot-scope="{ row, index }" slot="is_enabled">
        <i-switch true-value="1" false-value="0" size="large" v-model="row.is_enabled" @on-change="(val) => handleNumber(val, index, 'is_enabled')">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </template>
      <template slot-scope="{ index }" slot="handle">
        <span @click="handleDelSpec(index)"><a>删除</a></span>
      </template>
    </Table>
    <div class="setting">
      <span class="setting_title">批量设置：</span>
      <ul class="type" v-show="showType">
        <Button class="item" type="primary" @click="handleSet('product_number')">活动库存</Button>
        <Button class="item" type="primary" @click="handleSet('market_price')">原价</Button>
        <Button class="item" type="primary" @click="handleSet('bottom_price')">活动价</Button>
      </ul>
      <div v-show="!showType">
        <InputNumber style="width: 100px;" :min="0" v-model="settingDatas"/>
        <a @click="handleSave">保存</a>
        <a @click="handleCancel">取消</a>
      </div>
    </div>

    <norms-form-stock
            ref="normsFormStock"
            :row-data="rowData"
            @edit-norms="handleEditNorms" ></norms-form-stock>
  </div>
</template>

<script>
import NormsFormStock from './norms-form-stock';
export default {
    components: {
        NormsFormStock
    },
  props: ['data','storeGoods'],
  data () {
    return {
      goodsTypeColumns: [
        {
          title: '商品',
          key: 'goods_name',
          slot: 'name'
        },
        {
          title: '商品货号',
          key: 'goods_sn'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      goodsTypetableData: [],
      goodsSpecColumns: [
        {
          title: '商品条码',
          key: 'product_sn'
        },
        {
          title: '规格1',
          key: 'color_name'
        },
        {
          title: '规格2',
          key: 'size_name'
        },
        {
          title: '上下架状态',
          key: 'is_onsale',
          slot: 'isOnsale'
        },
        {
          title: '活动库存',
          key: 'product_number',
          slot: 'number'
        },
        {
          title: '原价',
          key: 'market_price',
          slot: 'price'
        },
        {
          title: '底价',
          key: 'bottom_price',
          slot: 'salePrice'
        },
        {
          title: '状态',
          key: 'is_enabled',
          slot: 'is_enabled'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      goodsSpectableData: [],
      showType: true,
      settingDatas: 0,
      rowData: {},
    }
  },
  methods: {
    handleEditNorms (data) {
        this.formDynamic.pageData.get_products = data;
        this.$emit('get-data', this.handleFlatten(this.allData));
    },
    //点击编辑门店库存
    handleEditStock () {
        this.rowData = this.storeGoods;
        this.$refs.normsFormStock.setData().show();
    },
    handleDel () {
      this.$emit('clear-goods-data');
    },
    handleDelSpec (index) {
      this.goodsSpectableData.splice(index, 1);
    },
    handleNumber (val, index, key) {
      this.goodsSpectableData[index][key] = val;
    },
    handleSet (type) {
      this.showType = false;
      this.currentType = type;
    },
    handleSave () {
      this.showType = true;
      if (this.goodsSpectableData.length) {
        this.goodsSpectableData.forEach(item => {
          item[this.currentType] = this.settingDatas;
        })
      } else {
        this.$Message.error('请选择商品');
      }
      this.settingDatas = 0;
    },
    handleCancel () {
      this.showType = true;
    },
  },
  watch: {
    data (nV) {
      this.goodsTypetableData = nV;

      let init=[];
      if(nV.length>0){
        init = JSON.parse(JSON.stringify(nV[0].get_products.filter(item => {
          item.is_enabled =item.is_enabled?String(item.is_enabled):'0';
          return true;
        }))) || [];
      }

      if (!nV.length) {
        this.goodsSpectableData = [];
        return false;
      }
      this.goodsSpectableData = init.filter(item => {
        item.product_number = Number(item.product_number);
        item.market_price =  Number(item.market_price);
        item.bottom_price =  Number(item.bottom_price) || 0;
        item.is_enabled = item.is_enabled;
        return true;
      }) || [];
    },
    goodsSpectableData: {
      handler(nV) {
        this.$emit('get-spec-data', nV);
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.goods_select{
  .table{
    margin-top: 24px;
  }
  .setting{
    display: flex;
    align-items: center;
    margin-top: 10px;
    .setting_title{
      display: inline-block;
      margin-right: 10px;
    }
    .type{
      display: flex;
      align-items: center;
      .item{
        list-style: none;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}
</style>
