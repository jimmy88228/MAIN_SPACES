<template>
  <div class="goods_select">
    <Table :columns="goodsTypeColumns" :data="goodsTypetableData" ref="goodsType" class="table">
      <template slot-scope="{ row, index }" slot="name">
        <div class="img_list_wrap">
          <div class="img_fixed">
            <img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.goods_thumb" v-viewer/>
            <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else/>
          </div>
          <div class="sort_wrapper">
            {{row.goods_name}}
          </div>
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="handle">
        <span @click="handleEditStock(row, index)"><a>设置库存</a></span>
        <Divider type="vertical"/>
        <span @click="handleDel"><a :class="delClass">删除</a></span>
      </template>
    </Table>
    <Table
      :columns="initColumns"
      :data="goodsSpectableData"
      ref="goodsSpecType"
      class="table"
      v-validate-table="tableRules"
      @on-validate-table="handleValidateTable">
      <template slot-scope="{ row, index }" slot="number">
        <InputNumber
          v-model="row.active_number"
          :min="0"
          style="width: 100px;"
          @on-change="(val) => handleNumber(val, index, 'active_number')"
          :data-key="'active_number'+index"/>
      </template>
      <template slot-scope="{ row, index }" slot="price">
        <InputNumber
          v-model="row.sale_price"
          :min="0"
          :step="0.1"
          style="width: 100px;"
          @on-change="(val) => handleNumber(val, index, 'sale_price')"
          :data-key="'sale_price'+index"/>
      </template>
      <template slot-scope="{ row, index }" slot="depositPrice">
        <InputNumber
          ref="depositPriceRef"
          v-model="row.deposit_price"
          :min="0"
          :max="row.sale_price"
          :step="0.1"
          style="width: 100px;"
          @on-change="(val) => handleNumber(val, index, 'deposit_price')"
          :data-key="'deposit_price'+index"/>
      </template>
      <template slot-scope="{ row, index }" slot="tailPrice">
        <InputNumber
          v-model="row.tail_price"
          :min="0"
          :max="row.sale_price"
          :step="0.1"
          style="width: 100px;"
          @on-change="(val) => handleNumber(val, index, 'tail_price')"
          :data-key="'tail_price'+index"
          :disabled="isPayAll"
          :readonly="!isStaticPay"/>
      </template>
      <template slot-scope="{ row, index }" slot="sort">
        <InputNumber
          v-model="row.sort"
          :min="0"
          :step="1"
          style="width: 100px;"
          @on-change="(val) => handleNumber(val, index, 'sort')"
          
          />
      </template>
      <template slot-scope="{ row }" slot="onsale">
        {{row.is_onsale == 1 ? '上架' : '下架'}}
      </template>
      <template slot-scope="{ row, index }" slot="status">
        <i-switch v-model="row.is_enabled" size="large" true-value="1" false-value="0" @on-change="(val) => handleNumber(val, index, 'is_enabled')">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </template>
      <template slot-scope="{ row, index }" slot="handle">
        <a @click="handleSetRule(row, index)">设置金额规则</a>
      </template>
    </Table>
    <div class="setting">
      <span class="setting_title">批量设置：</span>
      <ul class="type" v-show="showType">
        <Button class="item" type="primary" @click="handleSet('active_number')">活动库存</Button>
        <Button class="item" type="primary" @click="handleSet('sale_price')" v-show="!isDynamicPay">原价</Button>
        <Button class="item" type="primary" @click="handleSet('deposit_price')" v-show="!isDynamicPay">定金</Button>
        <Button class="item" type="primary" @click="handleSet('tail_price')" v-show="!isPayAll && !isDynamicPay">尾款</Button>
        <Button class="item" type="primary" @click="handleSet('is_enabled', true)">状态</Button>
      </ul>
      <div v-show="!showType">
        <i-switch v-model="settingStatus" size="large" true-value="1" false-value="0" v-if="isToggle">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
        <InputNumber style="width: 100px;" :min="0" v-model="settingDatas" v-else/>
        <a @click="handleSave">保存</a>
        <a @click="handleCancel">取消</a>
      </div>
    </div>
    <goods-gallery :goods-gallery="gallery" @handle-update="handleUpdate"></goods-gallery>
    <dynamic-rules ref="DynamicRules" @on-success="handleRules"></dynamic-rules>
    <norms-form-stock
      ref="normsFormStock"
      :row-data="rowData"
      @edit-norms="handleEditNorms"></norms-form-stock>
  </div>
</template>

<script>
import DynamicRules from './dynamic-rules';
import GoodsGallery from './goods-gallery';
import Utils from '@/libs/vue-utils.js';
import NormsFormStock from './norms-form-stock';

export default {
  props: ['data', 'type', 'id', 'gallery'],
  inject: ['formInstance'],
  components: {
    DynamicRules,
    GoodsGallery,
    NormsFormStock
  },
  data () {
    const checkActiveNumber = (rule, value, callback) => {
      const {
        field
      } = rule;
      const reg = /^active_number(?<index>\d+)$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.goodsSpectableData[index].product_number < value) {
        // callback(new Error('活动库存不能大于库存!'));
        callback();
      } else {
        callback();
      }
    }
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
          title: '款号',
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
        // {
        //   title: '库存',
        //   key: 'product_number'
        // },
        {
          title: '活动库存',
          key: 'active_number',
          slot: 'number',
          check: true
        },
        {
          title: '已售',
          key: 'sale_qty'
        },
        {
          title: '原价',
          key: 'sale_price',
          slot: 'price',
          check: true
        },
        {
          title: '定金',
          key: 'deposit_price',
          slot: 'depositPrice',
          check: true
        },
        {
          title: '尾款',
          key: 'tail_price',
          slot: 'tailPrice',
          check: true
        },
        {
          title: '优惠金额',
          key: 'discount_price'
        },
        {
          title: '上下架状态',
          key: 'is_onsale',
          slot: 'onsale'
        },
        {
          title: '排序',
          key: 'sort',
          slot: 'sort',
          check: true
        },
        {
          title: '状态',
          key: 'is_enabled',
          slot: 'status'
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
      settingStatus: '0',
      isToggle: false,
      orignData: [],
      rowData: {},
      allData: [],
      storeGoodsInfo: {},
      isFirst: 0,
      tableRules: {
        active_number: [
          {required: true, message: '活动库存不能为空', type: 'number'},
          {validator: checkActiveNumber, type: 'number'}
        ],
        sale_price: [
          {required: true, message: '原价不能为空'}
        ],
        deposit_price: [
          {required: true, message: '定金不能为空'}
        ],
        tail_price: [
          {required: true, message: '尾款不能为空'}
        ]
      }
    }
  },
  computed: {
    isEditStatus () {
      return Number(this.id) ? true : false
    },
    isPayAll () {
      // 是否为全款付
      return this.type === 1;
    },
    isStaticPay () {
      // 是否为固定膨胀金
      return this.type === 3;
    },
    isDynamicPay () {
      // 是否为动态膨胀金
      return this.type === 4;
    },
    initColumns () {
      let result;
      // 全款付与动态膨胀金没有尾款列
      // 动态膨胀金另外设置尾款
      switch (this.type) {
        case 1:
        case -1:
          result = this.goodsSpecColumns.filter(item => item.key !== 'tail_price' && item.key !== 'handle');
          break;
        case 2:
        case 3:
          result = this.goodsSpecColumns.filter(item => item.key !== 'handle');
          break;
        case 4:
          result = this.goodsSpecColumns.filter(item => item.key !== 'tail_price' && item.key !== 'sale_price' && item.key !== 'deposit_price');
          break;
        default:
          break;
      }
      return result;
    },
    delClass () {
      return {
        'strong_tips': this.isEditStatus,
        'not-allowed': this.isEditStatus
      }
    }
  },
  methods: {
    handleDel () {
      if (this.isEditStatus) return false;
      this.$emit('clear-goods-data');
    },
    handleDelSpec (index) {
      this.goodsSpectableData.splice(index, 1);
    },
    handleNumber (val, index, key) {
      this.goodsSpectableData[index][key] = val;
      if (key === 'deposit_price' || key === 'sale_price' || key === 'tail_price') {
        switch (this.type) {
          case 1:
            // 全款付: 原价=定金+优惠金额
            if (this.goodsSpectableData[index]['sale_price'] < this.goodsSpectableData[index]['deposit_price']) {
              this.goodsSpectableData[index]['deposit_price'] = this.goodsSpectableData[index]['sale_price'];
            }
            this.goodsSpectableData[index]['discount_price'] = Utils.reduceCalc(this.goodsSpectableData[index]['sale_price'], this.goodsSpectableData[index]['deposit_price']);
            break;
          case 2:
            // 定金: 原价=定金+尾款
            if (this.goodsSpectableData[index]['sale_price'] < this.goodsSpectableData[index]['deposit_price']) {
              this.goodsSpectableData[index]['deposit_price'] = this.goodsSpectableData[index]['sale_price'];
            }
            this.goodsSpectableData[index]['tail_price'] = Utils.reduceCalc(this.goodsSpectableData[index]['sale_price'], this.goodsSpectableData[index]['deposit_price']);
            break;
          case 3:
            // 固定膨胀金: 原价=定金+尾款+优惠金额
            if (this.goodsSpectableData[index]['sale_price'] < this.goodsSpectableData[index]['deposit_price']
            || this.goodsSpectableData[index]['sale_price'] < this.goodsSpectableData[index]['tail_price']) {
              this.goodsSpectableData[index]['deposit_price'] = this.goodsSpectableData[index]['sale_price'];
              this.goodsSpectableData[index]['tail_price'] = 0;
            }
            const discount = this.goodsSpectableData[index]['sale_price'] - this.goodsSpectableData[index]['deposit_price'] - this.goodsSpectableData[index]['tail_price'];
            if (key === 'deposit_price' && discount < 0) {
              this.goodsSpectableData[index]['deposit_price'] = this.goodsSpectableData[index]['sale_price'];
              this.goodsSpectableData[index]['tail_price'] = 0;
            } else if (key === 'tail_price' && discount < 0) {
              this.$nextTick(() => {
                this.goodsSpectableData[index]['tail_price'] = Utils.reduceCalc(this.goodsSpectableData[index]['sale_price'], this.goodsSpectableData[index]['deposit_price']);
                this.goodsSpectableData[index]['discount_price'] = 0;
              });
            } else {
              const diff = Utils.reduceCalc(this.goodsSpectableData[index]['sale_price'], this.goodsSpectableData[index]['deposit_price'])
              this.goodsSpectableData[index]['discount_price'] = Utils.reduceCalc(diff, this.goodsSpectableData[index]['tail_price']);
            }
            break;
          default:
            break;
        }
      }
    },
    handleSet (type, isToggle = false) {
      this.isToggle = isToggle;
      this.showType = false;
      this.currentType = type;
    },
    handleSave () {
      this.showType = true;
      if (this.goodsSpectableData.length) {
        this.goodsSpectableData.forEach((item, index) => {
          item[this.currentType] = this.currentType === 'is_enabled' ? this.settingStatus : this.settingDatas;
          this.handleNumber(this.currentType === 'is_enabled' ? this.settingStatus : this.settingDatas, index, this.currentType);
        })
      } else {
        this.$Message.error('请选择商品');
      }
      this.settingDatas = 0;
    },
    handleCancel () {
      this.showType = true;
    },
    handleSetRule (row, index) {
      this.$refs.DynamicRules.setData(row, index).show();
    },
    handleRules (data, index) {
      this.goodsSpectableData[index].goods_rule = data;
      // 接口的要求
      this.goodsSpectableData[index].deposit_price = data[0].deposit_price;
    },
    resetData (data) {
      this.goodsSpectableData = data.map(item => {
        return Object.assign({}, item, {
          id: item.id ? item.id : 0,
          goods_name: this.goodsTypetableData[0].goods_name, //有用？？？？ 为啥不用ID
          goods_sn: this.goodsTypetableData[0].goods_sn, //有用？？？？ 为啥不用ID
          sku: item.product_sn,
          sale_price: item.market_price ? Number(item.market_price) : Number(item.sale_price), //原价(字段不同)
          deposit_price: Number(item.deposit_price) ? Number(item.deposit_price) : Number(item.market_price), //定金
          tail_price: Number(item.tail_price) ? Number(item.tail_price) : 0, //尾款
          discount_price: Number(item.discount_price) ? Number(item.discount_price) : 0, //优惠金额
          active_number: Number(item.active_number) ? Number(item.active_number) : 0, //初始化活动库存等于库存，编辑的时候取active_number
          sale_qty: item.sale_qty ? item.sale_qty : 0, //初始化已售为0
          is_enabled: item.is_enabled ? item.is_enabled : '0', //初始化关闭
          sort: Number(item.sort) ? Number(item.sort) : 0, 
          goods_rule: item.goods_rule ? item.goods_rule : [
            {
              id: 0, //接口要求的，新增为0
              sign: 0, //v-for key必须不一致
              rule_type: 1, //未知字段，写死
              rule_rate: 1,
              deposit_price: 0,
              tail_price: 0,
              discount_price: 0
            }
          ] //规则
        });
      }) || [];
    },
    handleValidateTable (bool) {
      this.$emit('on-validate-table', bool);
    },
    handleUpdate (imgData) {
      this.$emit('get-img-data', imgData);
    },
    handleEditStock (row, index) {
      this.rowData = row;
      this.$refs.normsFormStock.setData(index,this.isFirst).show();
    },
    handleEditNorms (data, index) {
      // console.log('lllllx')
      console.log(data)

      this.storeGoodsInfo = data.map(item => {
                return {
                  id: item.act_store_goods_id,
                  activity_id: item.activity_id,
                  store_id: item.store_id,
                  goods_id: item.goods_id,
                  inventory: item.inventory_number
                }
              })
      this.$emit('get-store-goods-data', this.storeGoodsInfo);
      this.isFirst = 1;
      // this.formDynamic.pageData[index].get_products = data;
      // this.$emit('get-data', this.handleFlatten(this.allData));
    },
  },
  mounted () {
    // 监听父级的事件,手动触发table校验事件
    this.formInstance.$on('validate-table', () => {
      this.$refs.goodsSpecType.$emit('validate-table');
    });
  },
  watch: {
    data (nV) {
      this.goodsTypetableData = nV;
      
      if (!nV.length) {
        this.goodsSpectableData = [];
        return false;
      }
      this.resetData(nV[0].get_products);
      this.orignData = nV[0].get_products;
      this.goodsTypetableData[0].goods_id = nV[0].get_products[0].goods_id || 0;
    },
    goodsSpectableData: {
      handler(nV) {
        this.$emit('get-spec-data', nV);
      },
      deep: true
    },
    type (nV) {
      // 用户重新设置活动类型，重新初始化
      this.resetData(this.orignData);
    }
  }
}
</script>

<style lang="less">
.goods_select{
  .table{
    margin-top: 24px;
  }
  .not-allowed{
    cursor: not-allowed;
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
