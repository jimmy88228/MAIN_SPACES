<template>
  <basic-info :form-show-list="formShowList" @setStatus="handleStatus">
    <template v-slot:ui="{formItem, formShowList}">
      <coupon-ui :form-item="formItem" :form-show-list="formShowList"/>
    </template>
    <template v-slot:extend="{data, editData}">
      <extend-info :form-show-list="formShowList" :data="data" :edit-data="editData"/>
    </template>
  </basic-info>
</template>

<script>
import BasicInfo from './basic-info';
import CouponUi from './coupon-ui';
import ExtendInfo from './extend-info';
import Conf from './config';
import Control from '@/libs/page-control';

export default {
  name: 'CouponDetails',
  mixins: [Control],
  components: {
    BasicInfo,
    CouponUi,
    ExtendInfo
  },
  computed: {
    // 发放类型
    pId() {
      return Number(this.$route.query.pid);
    },
    // 优惠券类型
    id() {
      return Number(this.$route.query.id);
    }
  },
  data () {
    return {
      formShowList: {}
    }
  },
  methods: {
    generateList() {
      switch (this.pId) {
        case 0:
          if (this.id === 1) {
            this.formShowList = Conf['shopAndFulldiscount'];
          } else if (this.id === 4) {
            this.formShowList = Conf['shopAndDiscount'];
          }
          break;
        case 3:
          if (this.id === 1) {
            this.formShowList = Conf['scanAndFulldiscount'];
          }
          break;
        case 4:
          if (this.id === 1) {
            this.formShowList = Conf['erpAndFulldiscount'];
          } else if (this.id === 4) {
            this.formShowList = Conf['erpAndDiscount'];
          } else if (this.id === 5) {
            this.formShowList = Conf['erpAndPhysical'];
          }
          break;
        case 5:
          if (this.id === 1) {
            this.formShowList = Conf['generalAndFulldiscount'];
          } else if (this.id === 4) {
            this.formShowList = Conf['generalAndDiscount'];
          }
          break;
        default:
          break;
      }
    },
    handleStatus() {
      // 保存成功不需要离开页面提示
      this.isGlobalLeaveTip = false;
    }
  },
  mounted () {
    // 生成form显示配置数据
    this.generateList();
  }
}
</script>
