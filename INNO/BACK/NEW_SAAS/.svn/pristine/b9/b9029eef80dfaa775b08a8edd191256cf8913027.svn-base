<template>
  <div class="coupon_gui">
    <div class="header">
      <p class="title">优惠券</p>
      <img src="@rs/images/coupons-top.png" class="img"></img>
    </div>
    <div class="content">
      <div class="coupon_name">
        <span class="name">{{formItem.typeName}}</span>
        <span class="share">分享</span>
      </div>
      <div class="coupon_discount">
        <!-- 折扣优惠券 -->
        <p v-if="formShowList.isDiscount">{{formItem.discount.discount}}折优惠券</p>
        <!-- 非折扣优惠券 -->
        <p v-else>减免{{formItem.fullDiscount.discount}}元优惠券</p>
      </div>
      <div class="discount_condition">
        <!-- 折扣优惠券 -->
        <p v-if="formShowList.isDiscount">满{{formItem.discount.startAmount}}-{{formItem.discount.endAmount}}元可使用</p>
        <!-- 非折扣优惠券 -->
        <p v-else>满{{formItem.fullDiscount.amount}}元可使用</p>
      </div>
      <div class="valid_date">
        <p>
          有效日期
          <span v-if="formItem.validityTime.validityLimitType == 1">{{dateRange}}</span>
          <span v-if="formItem.validityTime.validityLimitType == 2">{{formItem.validityTime.validityMonth}}月</span>
          <span v-if="formItem.validityTime.validityLimitType == 3">{{formItem.validityTime.validityDay}}天</span>
        </p>
      </div>
    </div>
    <div class="desc">
      <p class="title">使用说明</p>
      <div class="details">
        <p>{{formItem.bonusDesc ? formItem.bonusDesc : '优惠券说明'}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/libs/vue-utils';

export default {
  name: 'CouponUI',
  props: ['formItem', 'formShowList'],
  computed: {
    dateRange() {
      const start = this.formItem.validityTime.validDateRange[0];
      const end = this.formItem.validityTime.validDateRange[1];
      if (start && end) {
        return utils.format(new Date(start), 'yyyy-MM-dd HH:mm:ss') + '-' + utils.format(new Date(end), 'yyyy-MM-dd HH:mm:ss');
      } else {
        return '';
      }
    }
  }
}
</script>

<style lang="less" scoped>
.coupon_gui{
  background: #f9f9f9;
  box-shadow: 0 0 0 1px #c5c5c5;
  height: 568px;
  width: 374px;
  .header{
    position: relative;
    width: 100%;
    height: 64px;
    text-align: center;
    line-height: 64px;
    .title{
      position: absolute;
      left: 50%;
      top: 64%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }
  }
  .content{
    width: 100%;
    padding: 10px;
    background: linear-gradient(0deg, rgb(254, 98, 99), rgb(254, 49, 78));
    color: #fff;
    .coupon_name{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      .name{
        flex-basis: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .share{
        color: hsla(0,0%,100%,.5);
        padding: 5px 10px;
        border: 1px solid hsla(0,0%,100%,.5);
        border-radius: 4px;
      }
    }
    .coupon_discount{
      font-size: 30px;
      height: 60px;
      text-align: center;
      p{
        width: calc(100% - 10px);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .discount_condition, .valid_date{
      height: 28px;
      text-align: center;
    }
    .valid_date{
      color: hsla(0,0%,100%,.5);
    }
  }
  .desc{
    .title{
      padding: 10px;
    }
    .details{
      overflow: hidden;
      padding: 10px;
      background: #fff;
      border-top: 1px solid #efefef;
      border-bottom: 1px solid #efefef;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>
