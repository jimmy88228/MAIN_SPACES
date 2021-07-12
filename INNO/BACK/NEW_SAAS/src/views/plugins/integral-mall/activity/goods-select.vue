<template>
  <div class="goods_select">
    <Table :columns="goodsTypeColumns" :data="goodsTypetableData" ref="goodsType" class="table">
      <template slot-scope="{ row }" slot="name">
        <div class="img_list_wrap">
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
      <template slot-scope="{ row, index }" slot="inventory">
        <InputNumber v-model="row.inventory" :min="0" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'inventory')"/>
      </template>
      <template slot-scope="{ row, index }" slot="price">
        <InputNumber v-model="row.market_price" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'market_price')"/>
      </template>
      <template slot-scope="{ row, index }" slot="salePrice">
        <InputNumber v-model="row.sale_price" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'sale_price')"/>
      </template>
      <template slot-scope="{ row, index }" slot="integral">
        <InputNumber v-model="row.integral" :min="0" :step="0.1" style="width: 100px;" @on-change="(val) => handleNumber(val, index, 'integral')"/>
      </template>
      <template slot-scope="{ row, index }" slot="enable">
        <i-switch true-value="1" false-value="0" size="large" v-model="row.enable" @on-change="(val) => handleNumber(val, index, 'enable')">
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
        <Button class="item" type="primary" @click="handleSet('inventory')">活动库存</Button>
        <Button class="item" type="primary" @click="handleSet('market_price')">原价</Button>
        <Button class="item" type="primary" @click="handleSet('sale_price')">活动价</Button>
        <Button class="item" type="primary" @click="handleSet('integral')">兑换积分</Button>
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
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      goodsTypetableData: [],
      goodsSpecColumns: [
        {
          title: '规格1',
          key: 'color_name'
        },
        {
          title: '规格2',
          key: 'size_name'
        },
        {
          title: '活动库存',
          key: 'inventory',
          slot: 'inventory'
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
          title: '兑换积分',
          key: 'integral',
          slot: 'integral'
        },
        {
          title: '状态',
          key: 'enable',
          slot: 'enable'
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
      let init = JSON.parse(JSON.stringify(nV[0].get_products.filter(item => {
        item.enable =  item.enable || '0';
        return true;
      })));
      if (!nV.length) {
        this.goodsSpectableData = [];
        return false;
      }
      this.goodsSpectableData = init.filter(item => {
        item.inventory = +(item.inventory) || 0;
        item.market_price =  Number(item.market_price);
        item.sale_price =  Number(item.sale_price);
        item.integral = +item.integral || 0;
        item.enable = item.enable;
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
