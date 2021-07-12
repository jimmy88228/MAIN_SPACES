<style lang="less">
  .brand-setting {}
</style>

<template>
  <div v-show="isShowSetting" class="brand-setting">

    <!--超管后台-品牌参数设置-->
    <options ref="options" :showCodes="settingCodes" :brandId="currBrandId" @on-success="showSetting" @on-close="onClose"></options>

  </div>
</template>

<script>
  import options from '@/views/settings/options/options';

  export default {
    name: 'brandSetting',
    components: {
      options,
    },
    data() {
      return {
        dataList: [],

        isShowSetting: false,
        currBrandId: 0,

        spinShow: false,
        settingCodes: ['brandSetting', 'shopBasic', 'shopOrders', 'shopPays', 'shopExamine'],
      }
    },
    methods: {
      // 初始化
      init() {

      },
      showSetting(brandId = '') {
        this.isShowSetting = true;
        if (brandId != '') {
          this.currBrandId = brandId;
        }

        this.$nextTick(() => {
          this.$refs['options'].init();
          this.$refs['options'].openModal();
        });
      },
      onClose() {
        this.isShowSetting = false;
        this.$emit('on-close');
      }
    },
    mounted() {
      //this.init();
    },
  };
</script>
