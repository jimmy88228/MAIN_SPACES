<template>
  <div class="yao-details">
    <ActivityTemplate type="yao" :id="id" @allow="allowBack" @getPrizeList="handlePrize" @getActivityInfo="handleActivityInfo">
      <template #content>
        <Form ref="formRewardValidate" :model="tableData">
          <Table :columns="columns" :data="tableData.data" ref="myTable">
            <template slot-scope="{ row, index }" slot="prizesType">
              <Select v-model="row.prizeType" transfer :disabled="row.isDefault" @on-change="val => handleSetData('prizeType', index, val)">
                <Option :value="0">谢谢惠顾</Option>
								<Option :value="1">积分</Option>
                <Option :value="2">实物</Option>
                <Option :value="3">虚拟物品</Option>
								<Option :value="4">优惠券</Option>
              </Select>
            </template>
            <template slot-scope="{ row, index }" slot="content">
              <FormItem
                v-if="row.prizeType === 1"
                class="form_item_24"
                ref="pointRef"
                :prop="'data.'+index+'.relatedValue'"
                :rules="{required: true, message: '请输入积分', type: 'number', trigger: 'blur', min: 1}"
                :show-message="row.prizeType === 1">
                <InputNumber :min="0" v-model="row.relatedValue" v-show="row.prizeType === 1" @on-change="val => handleSetData('relatedValue', index, val)"></InputNumber>
              </FormItem>
              <FormItem
                v-if="row.prizeType === 4"
                class="form_item_24"
                ref="couponRef"
                :prop="'data.'+index+'.relatedValue'"
                :rules="{required: true, message: '请选择优惠券',type: 'number', trigger: 'blur', min: 1}"
                :show-message="row.prizeType === 4">
                <!-- <coupon-select :data="row.couponData" type="radio" @del-tag="data => handleCouponClose(data, index)" v-show="row.prizeType === 4">
                  <Button type="dashed" @click="selected => handleCouponSelected(selected, index)" class="basic_select">选择优惠券</Button>
                </coupon-select> -->
								<Button type="dashed" @click="selected => handleCouponSelected(selected, index)" class="basic_select">{{(row.related_data && row.related_data.type_id) ? row.related_data.type_name : '选择优惠券'}}</Button>
              </FormItem>
              <FormItem
                v-if="row.prizeType === 2 || row.prizeType === 3"
                class="form_item_24"
                ref="giftsRef"
                :prop="'data.'+index+'.relatedValue'"
                :rules="{required: true, message: '请选择赠品', type: 'number', trigger: 'blur', min: 1}"
                :show-message="row.prizeType === 2 || row.prizeType === 3">
                <!-- <gift-select :data="row.giftData" type="radio" @del-tag="data => handleGiftClose(data, index)" v-show="row.prizeType === 2 || row.prizeType === 3">
                  <Button type="dashed" @click="selected => handleGiftSelected(selected, index)" class="basic_select">选择赠品</Button>
                </gift-select> -->
								<Button type="dashed" @click="selected => handleGiftSelected(selected, index)" class="basic_select">{{(row.related_data && row.related_data.goods_id) ? row.related_data.goods_name : '选择赠品'}}</Button>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="prizeName">
              <FormItem
                class="form_item_24"
                :prop="'data.'+index+'.prizeName'"
                :rules="{required: true, message: '请输入中奖别名', trigger: 'blur'}">
                <Input v-model="row.prizeName" class="basic_select" @on-change="() => handleSetData('prizeName', index, row.prizeName)" placeholder="请输入中奖别名"></Input>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="prizeRate">
              <FormItem
                class="form_item_24"
                ref="probabilityRef"
                :prop="'data.'+index+'.prizeRate'"
                :rules="{required: true, message: '请输入概率',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" v-model="row.prizeRate" @on-change="val => handleSetData('prizeRate', index, val)"></InputNumber>
                <label>%</label>
              </FormItem>
            </template>
						<template slot-scope="{ row, index }" slot="prizeLimitValue">
						  <FormItem
						    v-if="row.prizeType !== 4"
						    class="form_item_24"
						    :prop="'data.'+index+'.prizeLimitValue'"
						    :rules="{required: true, message: row.prizeLimit == 2 ? '请输入区间中奖次数' : '请输入每日中奖数',type: 'number', trigger: 'blur'}">
						    <InputNumber :min="0" v-model="row.prizeLimitValue" @on-change="val => handleSetData('prizeLimitValue', index, val)"></InputNumber>
						  </FormItem>
						</template>
            <template slot-scope="{ row, index }" slot="prizeTotals">
              <FormItem
                v-if="row.prizeType !== 4"
                class="form_item_24"
                :prop="'data.'+index+'.prizeTotals'"
                :rules="{required: true, message: '请输入奖品总数',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" v-model="row.prizeTotals" @on-change="val => handleSetData('prizeTotals', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="joinPoolNumber">
              <FormItem
                v-if="!row.isDefault"
                class="form_item_24"
                :prop="'data.'+index+'.joinPoolNumber'"
                :rules="{required: true, message: '请输入进入奖池数',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" v-model="row.joinPoolNumber" @on-change="val => handleSetData('joinPoolNumber', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="sort">
              <FormItem
                v-if="!row.isDefault"
                class="form_item_24"
                :prop="'data.'+index+'.sort'"
                :rules="{required: true, message: '请输入排序',type: 'number', trigger: 'blur'}">
                <InputNumber :min="0" v-model="row.sort" @on-change="val => handleSetData('sort', index, val)"></InputNumber>
              </FormItem>
            </template>
            <template slot-scope="{ row, index }" slot="prizeImg">
              <FormItem
                class="form_item_24"
                :prop="'data.'+index+'.prizeImg'"
                :rules="{required: true, message: '请上传图片', trigger: 'blur'}">
                <image-edit
                  :img="row.prizeImg"
                  @selectImg="openImagesModal(row.prizeImg, index)"
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
import { actDetailColums, setActColums } from '../common/act-detail-colums.js';
import mixins from '@/views/matrix/plugins/lottery/lottery-activity/mixins/mixins.js';
export default {
  props: ['id'],
  mixins: [Control, mixins],
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
					width: 100,
          key: 'name'
        },
        {
          title: '类型',
					width: 150,
          key: 'type',
          slot: 'prizesType'
        },
        {
          title: '奖项',
          key: 'content',
          className: 'padd',
          width: 150,
          align: 'center',
          slot: 'content'
        },
        ...actDetailColums,
        {
          title: '操作',
					width: 100,
          key: 'handle',
          slot: 'handle'
        }
      ],
      tableData: {
        data: [
          {
            name: '奖品1',
						prizeId: 0,
            prizeType: 0,
            relatedValue: 0,
            couponData: [],
						prizeLimitValue:0,
            giftData: [],
            prizeName: '',
            prizeRate: 0,
            prizeTotals: 0,
            joinPoolNumber: 0,
            sort: 0,
            prizeImg: '',
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
				prizeId: 0,
        prizeType: 1,
        relatedValue: 0,
        couponData: [],
				prizeLimitValue:0,
        giftData: [],
        prizeName: '',
        prizeRate: 0,
        prizeTotals: 0,
        joinPoolNumber: 0,
        sort: 0,
        prizeImg: this.imgCol['point']
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
    handlePrize (prize, thanks, imgCol) {
      this.imgCol = imgCol;
      if ((prize && prize.length === 0)) {
				let _data = this.tableData.data || [];
				this.setImage(0, _data[0].prizeType);
				return;
			}
      let data = JSON.parse(JSON.stringify(prize));
      this.tableData.data = data.filter((item, index) => {
        item.name = `奖品${index+1}`;
        item.couponData = [];
        item.giftData = [];
        item.prizeImg = item.prizeImg;
        return true;
      });
			console.log("this.tableData", this.tableData);
    },
		handleActivityInfo(activtyInfo){
			setActColums(this, activtyInfo);
		}
  }
}
</script>

<style lang="less">
.yao-details{
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
