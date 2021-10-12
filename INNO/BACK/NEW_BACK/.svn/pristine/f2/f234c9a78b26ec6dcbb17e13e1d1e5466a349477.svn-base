<template>
  <div class="fan-details">
    <ActivityTemplate type="fan" :id="id" @allow="allowBack" @getPrizeList="handlePrize">
      <template #content>
        <Form ref="formRewardValidate" :model="tableData">
          <Table :columns="columns" :data="tableData.data" ref="myTable">
            <template slot-scope="{ row, index }" slot="prizesType">
              <Select v-model="row.prizesType" transfer :disabled="row.isDefault" @on-change="val => handleSetData('prizesType', index, val)">
                <Option :value="1">积分</Option>
                <Option :value="2">优惠券</Option>
                <Option :value="3">实物</Option>
                <Option :value="4">谢谢惠顾</Option>
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="content">
              <FormItem
                v-if="row.prizesType === 1"
                class="form_item_24"
                ref="pointRef"
                :prop="'data.'+index+'.prizeIntegral'"
                :rules="{required: true, message: '请输入积分', type: 'number', trigger: 'blur'}"
                :show-message="row.prizesType === 1">
                <InputNumber :min="0" :precision="0" v-model="row.prizeIntegral" v-show="row.prizesType === 1" @on-change="val => handleSetData('prizeIntegral', index, val)"></InputNumber>
              </FormItem>
              <FormItem
                v-if="row.prizesType === 2"
                class="form_item_24"
                ref="couponRef"
                :prop="'data.'+index+'.couponData'"
                :rules="{required: true, message: '请选择优惠券', type: 'array', len: 1}"
                :show-message="row.prizesType === 2">
                <coupon-select :data="row.couponData" type="radio" @del-tag="data => handleCouponClose(data, index)" v-show="row.prizesType === 2">
                  <Button type="dashed" @click="selected => handleCouponSelected(selected, index)" class="basic_select">选择优惠券</Button>
                </coupon-select>
              </FormItem>
              <FormItem
                v-if="row.prizesType === 3"
                class="form_item_24"
                ref="giftsRef"
                :prop="'data.'+index+'.giftData'"
                :rules="{required: true, message: '请选择赠品', type: 'array', len: 1}"
                :show-message="row.prizesType === 3">
                <gift-select :data="row.giftData" type="radio" @del-tag="data => handleGiftClose(data, index)" v-show="row.prizesType === 3">
                  <Button type="dashed" @click="selected => handleGiftSelected(selected, index)" class="basic_select">选择赠品</Button>
                </gift-select>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="prizeName">
              <FormItem
                v-if="row.prizesType !== 4"
                class="form_item_24"
                :prop="'data.'+index+'.prizeName'"
                :rules="{required: true, message: '请输入中奖别名', trigger: 'blur'}">
                <Input v-model="row.prizeName" class="basic_select" @on-change="() => handleSetData('prizeName', index, row.prizeName)" placeholder="请输入中奖别名"></Input>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="prizeRate">
              <FormItem
                class="form_item_24 "
                ref="probabilityRef"
                :prop="'data.'+index+'.prizeRate'"
                :rules="{required: true, message: '请输入概率',type: 'number', trigger: 'blur'}">
								<div class="flex">
									<InputNumber :min="0" v-model="row.prizeRate" @on-change="val => handleSetData('prizeRate', index, val)"></InputNumber>
									<label>&nbsp;%</label>
								</div>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="everyDayNumber">
              <FormItem
                v-if="row.prizesType !== 4"
                class="form_item_24"
                :prop="'data.'+index+'.everyDayNumber'"
                :rules="{required: true, message: '请输入每日中奖总数',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" :precision="0" v-model="row.everyDayNumber" @on-change="val => handleSetData('everyDayNumber', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="prizeTotals">
              <FormItem
                v-if="row.prizesType !== 4"
                class="form_item_24"
                :prop="'data.'+index+'.prizeTotals'"
                :rules="{required: true, message: '请输入奖品总数',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" :precision="0" v-model="row.prizeTotals" @on-change="val => handleSetData('prizeTotals', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="joinPoolNumber">
              <FormItem
                v-if="!row.isDefault"
                class="form_item_24"
                :prop="'data.'+index+'.joinPoolNumber'"
                :rules="{required: true, message: '请输入进入奖池数',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" :precision="0" v-model="row.joinPoolNumber" @on-change="val => handleSetData('joinPoolNumber', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="sort">
              <FormItem
                v-if="!row.isDefault"
                class="form_item_24"
                :prop="'data.'+index+'.sort'"
                :rules="{required: true, message: '请输入排序',type: 'number', trigger: 'blur'}">
                <InputNumber style="width:80px" :min="0" :precision="0" v-model="row.sort" @on-change="val => handleSetData('sort', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="pic">
              <FormItem
                class="form_item_24"
                :prop="'data.'+index+'.pic'"
                :rules="{required: true, message: '请上传图片', trigger: 'blur'}">
                <image-edit
                  :img="row.pic"
                  @selectImg="openImagesModal(row.pic, index)"
                  @delImg="handleDelImg(index)">
                </image-edit>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="handle">
              <p><a @click="delItem(index)" v-if="!row.isDefault">删除</a></p>
            </template>
          </Table>
        </Form>
        <Button @click="addItem">添加选项</Button>
      </template>
    </ActivityTemplate>
  </div>
</template>

<script>
import ActivityTemplate from '../template/index';
import Control from '@/libs/page-control';
import CouponSelect from '@/views/my-components/list-component/index-edit';
import GiftSelect from '@/views/my-components/list-component/index-edit';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import { actDetailColums } from '../common/act-detail-colums.js';
export default {
  props: ['id'],
  mixins: [Control],
  components: {
    ActivityTemplate,
    CouponSelect,
    GiftSelect,
    ImageEdit
  },
  data () {
    return {
      columns: [
        {
          title: '设置奖项',
					minWidth:100,
          key: 'name'
        },
        {
          title: '类型',
					minWidth:100,
          key: 'prizesType',
          slot: 'prizesType'
        },
        {
          title: '奖项',
          key: 'content',
          className: 'padd',
          width: 200,
          align: 'center',
          slot: 'content'
        },
        ...actDetailColums,
        {
          title: '操作',
					minWidth:80,
          key: 'handle',
          slot: 'handle'
        }
      ],
      tableData: {
        data: [
          {
            name: '奖品1',
            prizesType: 4,
            prizeIntegral: 0,
            couponData: [],
            giftData: [],
            prizeName: '',
            prizeRate: 0,
            prizeTotals: 0,
            joinPoolNumber: 0,
            sort: 0,
            pic: '',
            isDefault: true
          }
        ]
      },
      imgCol: {}
    }
  },
  methods: {
    addItem () {
      let name = '';
      let newItem = {
        name: '',
        prizesType: 1,
        prizeIntegral: 0,
        couponData: [],
        giftData: [],
        prizeName: '',
        prizeRate: 0,
        everyDayNumber:0,
        prizeTotals: 0,
        joinPoolNumber: 0,
        sort: 0,
        pic: this.imgCol['point']
      };
      if (!this.tableData.data.length) {
        name = '奖品1';
      } else {
        let max = 0;
        this.tableData.data.forEach(item => {
          let reg = /奖品(\d+)/;
          if (reg.test(item.name)) {
            if (+RegExp.$1 > max) {
              max = +RegExp.$1;
            }
          }
        });
        name = `奖品${max+1}`;
      }
      newItem.name = name;

      this.tableData.data.push(newItem);
    },
    delItem (index) {
      this.tableData.data.splice(index, 1);
    },
    handleSetData (key, index, val) {
      if (key === 'prizesType') {
        this.$refs.pointRef && (this.$refs.pointRef.validateState = '');
        this.$refs.couponRef && (this.$refs.couponRef.validateState = '');
        this.$refs.giftsRef && (this.$refs.giftsRef.validateState = '');
        this.setImage(index, val);
      }
      this.$nextTick(() => {
        this.tableData.data[index][key] = val;
      })
    },
    setImage (index, type) {
      let defaultImg = '';
      // 匹配到默认图的优先使用/或没有选择
      let isDefault = /assets/g.test(this.tableData.data[index].pic);
      if (isDefault || this.tableData.data[index].pic === '') {
        switch (type) {
          case 1:
            defaultImg = this.imgCol['point'];
            break;
          case 2:
            defaultImg = this.imgCol['bonus'];
            break;
          case 3:
            defaultImg = this.imgCol['inkind'];
            break;
          default:
            defaultImg = this.imgCol['wetryharder'];
            break;
        }
        this.tableData.data[index].pic = defaultImg;
      }
    },
    handleCouponSelected (selected, index) {
      this.$selectContent({
        mode: 'coupon',
        type: 'radio',
        data: this.tableData.data[index].couponData,
        getList: (data) => {
          this.tableData.data[index].couponData = data;
          this.$refs.formRewardValidate.validateField(`data.${index}.couponData`);
        }
      });
    },
    handleCouponClose (data, index) {
      this.tableData.data[index].couponData = data;
      this.$refs.formRewardValidate.validateField(`data.${index}.couponData`);
    },
    handleGiftSelected (selected, index) {
      this.$selectContent({
        mode: 'gift',
        type: 'radio',
        data: this.tableData.data[index].giftData,
        getList: (data) => {
          this.tableData.data[index].giftData = data;
          this.$refs.formRewardValidate.validateField(`data.${index}.giftData`);
        }
      });
    },
    handleGiftClose (data, index) {
      this.tableData.data[index].giftData = data;
      this.$refs.formRewardValidate.validateField(`data.${index}.giftData`);
    },
    // 调起图片选择器
    openImagesModal (url, index) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.tableData.data[index].pic = item.src;
        }
      });
    },
    handleDelImg (index) {
      this.tableData.data[index].pic = '';
      this.setImage(index, this.tableData.data[index].prizesType);
    },
    handleValidate (fn) {
      this.$refs.formRewardValidate.validate(valid => {
        let prizeRate = this.tableData.data.reduce((acc, item) => {
          return acc + item.prizeRate;
        }, 0);
        if (prizeRate !== 100) {
          this.$Message.error('当前概率值不为100%!');
          return;
        }
        fn(valid);
      })
    },
    allowBack() {
      this.isGlobalLeaveTip = false;
    },
    handlePrize (prize, thanks, imgCol) {
      this.imgCol = imgCol;
      if (prize.length === 0 || Object.keys(thanks).length === 0) {
				let _data = this.tableData.data || [];
				this.setImage(0, _data[0].prizesType);
				return;
			}
      let data = [thanks].concat(prize);
      data = JSON.parse(JSON.stringify(data));
      this.tableData.data = data.filter((item, index) => {
        item.name = `奖品${index+1}`;
        item.couponData = [item.bouns_data];
        item.giftData = [item.gift_data];
        item.pic = item.prizeImg;
        return true;
      });
			console.log("tableData", this.tableData);
    }
  }
}
</script>

<style lang="less">
.fan-details{
  .ivu-tag-text{
    display: inline-block;
    width: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 21px;
    height: 18px;
  }
  .ivu-table-body .padd .ivu-table-cell{
    padding-top: 20px;
  }
}
</style>
