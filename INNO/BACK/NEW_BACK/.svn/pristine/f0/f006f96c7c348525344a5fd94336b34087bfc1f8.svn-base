<template>
  <div>
    <PageTopBase isSave @save="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="模板名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入模板名称" class="basic_input"></Input>
        </FormItem>
        <FormItem label="模板简称" prop="short_name">
          <Input v-model="formItem.short_name" placeholder="请输入模板简称" class="basic_input"></Input>
        </FormItem>
        <FormItem label="排序号">
          <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
        </FormItem>
        <FormItem
          ref="dateRange"
          label="时间范围"
          prop="dateRange">
          <DatePicker type="datetimerange" placeholder="请选择时间范围" style="width: 340px;" v-model="formItem.dateRange" @on-change="handleChange"></DatePicker>
        </FormItem>
        <FormItem label="是否启用" prop="is_enabled">
          <i-switch v-model="formItem.is_enabled" size="large" true-value="1" false-value="0">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="优惠券" prop="couponData">
          <Button type="dashed" @click="handleSelected" class="basic_select" style="margin-bottom: 24px;">选择优惠券</Button>
          <Table
            v-show="selectCoupon.length"
            :columns="tableColumns"
            :data="selectCoupon"
            ref="goodsSpecType"
            class="table"
            v-validate-table="tableRules">
            <template slot-scope="{ row, index }" slot="sort">
              <InputNumber
                v-model="row.sort"
                :min="1"
                style="width: 100px;"
                @on-change="(val) => handleNumber(val, index, 'sort')"
                :data-key="'sort'+index"/>
            </template>
            <template slot-scope="{ row, index }" slot="coupon_number">
              <InputNumber
                v-model="row.coupon_number"
                :min="1"
                style="width: 100px;"
                @on-change="(val) => handleNumber(val, index, 'coupon_number')"
                :data-key="'coupon_number'+index"/>
            </template>
            <template slot-scope="{ row, index }" slot="limit_number">
              <InputNumber
                v-model="row.limit_number"
                :min="1"
                style="width: 100px;"
                @on-change="(val) => handleNumber(val, index, 'limit_number')"
                :data-key="'limit_number'+index"/>
            </template>
            <template slot-scope="{ row }" slot="handle">
              <a @click="handleDel(row)">删除</a>
            </template>
          </Table>
        </FormItem>
      </Form>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    EditSort,
    CouponSelect
  },
  data () {
    return {
      formItem: {
        name: '',
        short_name: '',
        is_enabled: '0',
        dateRange: [],
        couponData: [],
        sort: 0
      },
      selectCoupon: [],
      ruleValidate: {
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
        dateRange: [{required: true, trigger: 'change', type: 'array', validator: this.checkValidRange}],
        couponData: [{required: true, message: '优惠券不能为空', trigger: 'change', type: 'array', min: 1}]
      },
      tableRules: {
        sort: [
          {required: true, message: '排序不能为空', type: 'number'}
        ],
        coupon_number: [
          {required: true, message: '总库存不能为空', type: 'number'}
        ],
        limit_number: [
          {required: true, message: '每人限领数量不能为空', type: 'number'}
        ]
      },
      tableColumns: [
        {
          title: '优惠券名称',
          key: 'type_name'
        },
        {
          title: '排序',
          key: 'sort',
          slot: 'sort',
          check: true
        },
        {
          title: '总库存',
          key: 'coupon_number',
          slot: 'coupon_number',
          check: true
        },
        {
          title: '每人限领数量',
          key: 'limit_number',
          slot: 'limit_number',
          check: true
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      spinShow: false,
      sortVaild: false
    }
  },
  methods: {
    checkValidRange (rule, value, callback) {
      if (!value[0] && !value[1]) {
        callback(new Error('时间范围不能为空'));
      } else {
        callback();
      }
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleChange (val) {
      this.formItem.dateRange = val;
    },
    handleSelected (selected) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.couponData,
        getList: (data) => {
          this.formItem.couponData = data;
          let idCols = this.selectCoupon.map(item => item.type_id);
          this.selectCoupon = this.formItem.couponData.filter(item => !idCols.includes(item.type_id)).map(item => {
            return {
              type_id: item.type_id,
              type_name: item.type_name,
              sort: 1,
              coupon_number: 1,
              limit_number: 1,
            }
          }).concat(this.selectCoupon);
          this.$refs.formValidate.validateField('couponData');
        }
      });
    },
    handleNumber (val, index, key) {
      this.selectCoupon[index][key] = val;
    },
    handleDel (row) {
      const selectIndex = this.selectCoupon.findIndex(item => item.type_id === row.type_id);
      const selectCouponIndex = this.formItem.couponData.findIndex(item => item.type_id === row.type_id);
      this.selectCoupon.splice(selectIndex, 1);
      this.formItem.couponData.splice(selectCouponIndex, 1);
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          const isChange = JSON.stringify(this.selectCoupon) !== JSON.stringify(this.originData);
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.spinShow = true;
          this.$ajax.post((this.id ? this.$api.cloudGoodsCouponsActivityEdit : this.$api.cloudGoodsCouponsActivityAdd), {
            id: this.id,
            is_enabled: this.formItem.is_enabled,
            stime: this.formItem.dateRange[0] || '',
            etime: this.formItem.dateRange[1] || '',
            name: this.formItem.name,
            short_name: this.formItem.short_name,
            sort: this.formItem.sort,
            bonus_data_state: isChange ? 2 : 1,
            bonus_data: this.selectCoupon.map(item => {
              return {
                type_id: item.type_id,
                sort: item.sort,
                limit_number: item.coupon_number,
                limit_number_pre_person: item.limit_number
              }
            })
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
                // 保存成功
                this.$Message.success(res.message);
                this.$router.go(-1);
              }
              this.spinShow = false;
		    		});
        }
      });
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudGoodsCouponsActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data;
          if (data = res.data) {
            this.formItem = {
              name: data.name,
              short_name: data.short_name,
              is_enabled: data.is_enabled,
              dateRange: [data.stime, data.etime],
              couponData: data.get_goods_receive_bonus_detail.map(item => {
                return {
                  type_id: Number(item.bonus_type_id),
                  name: item.bouns_list.name
                }
              }),
              sort: Number(data.sort)
            };
            this.selectCoupon = data.get_goods_receive_bonus_detail.map(item => {
              return {
                type_id: Number(item.bonus_type_id),
                type_name: item.bouns_list.name,
                sort: Number(item.sort),
                coupon_number: Number(item.limit_number),
                limit_number: Number(item.limit_number_pre_person),
              }
            });
            Object.defineProperty(this, 'originData', {
              value: JSON.parse(JSON.stringify(this.selectCoupon))
            });
          }
        }
        this.spinShow = false;
      });
    },
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>
