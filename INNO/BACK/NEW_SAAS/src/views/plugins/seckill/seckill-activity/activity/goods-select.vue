<template>
  <div class="goods_select">
    <Table :columns="goodsTypeColumns" :data="goodsTypetableData" ref="goodsType" class="table">
      <template slot-scope="{ row }" slot="name">
        <div class="img_list_wrap">
          <div class="img_fixed">
            <img :src="row.goods_thumb2" v-if="row.goods_thumb2" :alt="row.goods_thumb2" v-viewer/>
            <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
          </div>
          <div class="sort_wrapper">
            {{row.goods_name}}
          </div>
        </div>
      </template>
      <template slot="handle">
        <span @click="handleDel"><a>删除</a></span>
      </template>
    </Table>
    <Table :columns="goodsSpecColumns" :data="goodsSpectableData" ref="goodsSpecType" class="table">
      <template slot-scope="{ row }" slot="isOnsale">
        <span>{{Number(row.is_onsale) ? '上架' : '下架'}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="number">
        <InputNumber v-model="row.hold_number" :min="0" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'hold_number')"/>
      </template>
      <template slot-scope="{ row, index }" slot="price">
        <InputNumber v-model="row.market_price" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'market_price')"/>
      </template>
      <template slot-scope="{ row, index }" slot="salePrice">
        <InputNumber v-model="row.sale_price" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'sale_price')"/>
      </template>
      <template slot-scope="{ index }" slot="handle">
        <span @click="handleDelSpec(index)"><a>删除</a></span>
      </template>
    </Table>
    <div class="setting">
      <span class="setting_title">批量设置：</span>
      <ul class="type" v-show="showType">
        <Button class="item" type="primary" @click="handleSet('hold_number')">活动库存</Button>
        <Button class="item" type="primary" @click="handleSet('market_price')">原价</Button>
        <Button class="item" type="primary" @click="handleSet('sale_price')">活动价</Button>
      </ul>
      <div v-show="!showType">
        <InputNumber style="width: 100px;" :min="0" v-model="settingDatas"/>
        <a @click="handleSave">保存</a>
        <a @click="handleCancel">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
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
          title: '原价',
          key: 'goods_sn'
        },
        {
          title: '秒杀价',
          key: 'goods_sn'
        },
        {
          title: '托管任务',
          key: 'goods_sn'
        },
        {
          title: '限购数量',
          key: 'goods_sn'
        },
        {
          title: '预占销量',
          key: 'goods_sn'
        },
        {
          title: '原价购买',
          key: 'goods_sn'
        },
        {
          title: '排序',
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
          key: 'hold_number',
          slot: 'number'
        },
        {
          title: '原价',
          key: 'market_price',
          slot: 'price'
        },
        {
          title: '活动价',
          key: 'sale_price',
          slot: 'salePrice'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      goodsSpectableData: [],
      showType: true,
      settingDatas: 0
    }
  },
  methods: {
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
      if (!nV.length) {
        this.goodsSpectableData = [];
        return false;
      }
      this.goodsSpectableData = nV[0].get_products.filter(item => {
        item.hold_number = Number(item.hold_number);
        item.market_price =  Number(item.market_price);
        item.sale_price =  Number(item.sale_price);
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
