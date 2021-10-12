<template>
  <div class="goods_select">
    <Row>
      <Col span="18">
        <Input
          class="basic_input"
          v-model="formSearch.searchq"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage"></Input>
      </Col>
      <Col span="6" align="right">
        <Button type="primary" icon="md-add" class="import_btn" @click="handleImport">批量导入</Button>
      </Col>
    </Row>
    <div v-show="data.length">
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
          <span @click="handleDel"><a :class="delClass">删除</a></span>
        </template>
      </Table>
      <Table
        :columns="goodsSpecColumns"
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
        <template slot-scope="{ row, index }" slot="salePrice">
          <InputNumber
            v-model="row.market_price"
            :min="0"
            :step="0.1"
            style="width: 100px;"
            @on-change="(val) => handleNumber(val, index, 'market_price')"
            :data-key="'market_price'+index"/>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <i-switch v-model="row.status" size="large" true-value="1" false-value="0" @on-change="(val) => handleNumber(val, index, 'status')">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
      </Table>
      <div class="setting">
        <span class="setting_title">批量设置：</span>
        <ul class="type" v-show="showType">
          <Button class="item" type="primary" @click="handleSet('active_number')">活动库存</Button>
          <Button class="item" type="primary" @click="handleSet('sale_price')">原价</Button>
          <Button class="item" type="primary" @click="handleSet('market_price')">活动价</Button>
          <Button class="item" type="primary" @click="handleSet('status', true)">状态</Button>
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
    </div>
    <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
  </div>
</template>

<script>
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  props: ['data', 'id'],
  inject: ['formInstance'],
  components: {
    BatchImport
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
        callback(new Error('活动库存不能大于库存!'));
      } else {
        callback()
      }
    }
    const checkMarketPrice = (rule, value, callback) => {
      const {
        field
      } = rule;
      const reg = /^market_price(?<index>\d+)$/;
      const matchObj = reg.exec(field);
      const index = matchObj.groups.index;
      if (this.goodsSpectableData[index].sale_price && this.goodsSpectableData[index].sale_price < value) {
        callback(new Error('活动价不能大于原价!'));
      } else {
        callback()
      }
    }
    return {
      formSearch: {
        searchq: ''
      },
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
          title: '库存',
          key: 'product_number'
        },
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
          title: '活动价',
          key: 'market_price',
          slot: 'salePrice',
          check: true
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        }
      ],
      goodsSpectableData: [],
      showType: true,
      settingDatas: 0,
      settingStatus: '0',
      isToggle: false,
      tableRules: {
        active_number: [
          {required: true, message: '活动库存不能为空', type: 'number'},
          {validator: checkActiveNumber, type: 'number'}
        ],
        sale_price: [
          {required: true, message: '原价不能为空'}
        ],
        market_price: [
          {required: true, message: '活动价不能为空'},
          {validator: checkMarketPrice, type: 'number'}
        ]
      }
    }
  },
  computed: {
    isEditStatus () {
      return Number(this.id) ? true : false
    },
    delClass () {
      return {
        'strong_tips': this.isEditStatus,
        'not-allowed': this.isEditStatus
      }
    }
  },
  methods: {
    searchPage () {
      // this.$emit('on-search', this.formSearch);
    },
    handleImport () {
      this.$refs.batchImport.openModal({
        upload: true,
        download: true
      }, this.$api.goodsBrandUpload, this.$api.goodsBrandDownload);
    },
    onImportSuccess () {
      // this.loadData();
    },
    handleDel () {
      if (this.isEditStatus) return false;
      this.$emit('clear-goods-data');
    },
    handleDelSpec (index) {
      this.goodsSpectableData.splice(index, 1);
    },
    handleNumber (val, index, key) {
      this.goodsSpectableData[index][key] = val;
    },
    handleSet (type, isToggle = false) {
      this.isToggle = isToggle;
      this.showType = false;
      this.currentType = type;
    },
    handleSave () {
      this.showType = true;
      if (this.goodsSpectableData.length) {
        this.goodsSpectableData.forEach(item => {
          item[this.currentType] = this.currentType === 'status' ? this.settingStatus : this.settingDatas;
        })
      } else {
        this.$Message.error('请选择商品');
      }
      this.settingDatas = 0;
    },
    handleCancel () {
      this.showType = true;
    },
    handleValidateTable (bool) {
      this.$emit('on-validate-table', bool);
    }
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
      this.goodsSpectableData = nV[0].get_products.map(item => {
        return Object.assign({}, item, {
          id: item.id ? item.id : 0,
          market_price: Number(item.market_price),
          sale_price: Number(item.sale_price),
          active_number: Number(item.active_number) ? Number(item.active_number) : Number(item.product_number), //初始化活动库存等于库存，编辑的时候取active_number
          sale_qty: item.sale_qty ? item.sale_qty : 0, //初始化已售为0
          status: item.status ? item.status : '0' //初始化关闭
        });
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
  .ivu-input-icon{
    right: 50px;
  }
  .ivu-table-cell-slot{
    padding: 10px 0;
  }
  .not-allowed{
    cursor: not-allowed;
  }
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
