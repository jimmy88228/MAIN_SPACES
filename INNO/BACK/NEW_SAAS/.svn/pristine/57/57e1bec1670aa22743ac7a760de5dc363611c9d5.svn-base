<template>
  <div class="goods_select">
    <div v-show="data.length">
      <Table
        :columns="goodsTypeColumns"
        :data="goodsTypetableData"
        ref="goodsType"
        class="table"
        v-validate-table="tableRules"
        @on-validate-table="handleValidateTable">
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
        <template slot-scope="{ row, index }" slot="isEnable">
          <i-switch v-model="row.isEnable" size="large" :true-value="1" :false-value="0" @on-change="(val) => handleData(val, index, 'isEnable')">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="isMain">
          <i-switch v-model="row.isMain" size="large" :true-value="1" :false-value="0" @on-change="(val) => handleData(val, index, 'isMain')">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="sort">
          <InputNumber
            v-model="row.sort"
            :min="0"
            style="width: 100px;"
            @on-change="(val) => handleData(val, index, 'sort')"
            :data-key="'sort'+index"/>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span @click="handleDel(index)"><a>删除</a></span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>

export default {
  props: ['data', 'id'],
  inject: ['formInstance'],
  data () {
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
          title: '是否启用',
          key: 'isEnable',
          slot: 'isEnable'
        },
        {
          title: '主推',
          key: 'isMain',
          slot: 'isMain'
        },
        {
          title: '排序',
          key: 'sort',
          slot: 'sort',
          check: true
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      goodsTypetableData: [],
      isToggle: false,
      tableRules: {
        sort: [
          {required: true, message: '排序不能为空', type: 'number'}
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
    handleDel (index) {
      this.goodsTypetableData.splice(index, 1);
      this.$emit('get-data', this.goodsTypetableData);
    },
    handleData (val, index, key) {
      this.goodsTypetableData[index][key] = val;
      this.$emit('get-data', this.goodsTypetableData);
    },
    handleValidateTable (bool) {
      this.$emit('on-validate-table', bool);
    }
  },
  mounted () {
    // 监听父级的事件,手动触发table校验事件
    this.formInstance.$on('validate-table', () => {
      this.$refs.goodsType.$emit('validate-table');
    });
  },
  watch: {
    data (nV) {
      if (!nV) return false;
      this.goodsTypetableData = JSON.parse(JSON.stringify(nV));
      this.goodsTypetableData.forEach((item, index) => {
        this.$set(this.goodsTypetableData[index], 'isEnable', item.isEnable || 0);
        this.$set(this.goodsTypetableData[index], 'isMain', item.isMain || 0);
        this.$set(this.goodsTypetableData[index], 'sort', item.sort || 0);
      })
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
