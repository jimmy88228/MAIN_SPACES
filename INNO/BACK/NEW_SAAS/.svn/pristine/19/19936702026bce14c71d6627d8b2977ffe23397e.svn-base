<template>
  <div class="input_num">
    <Input
      v-model="formatValue"
      class="input"
      :class="{'fix_class': fixClass}"
      type="text"
      :disabled="disabled"
      placeholder="请输入内容"
      @on-change="handleChange"
      @on-keydown="handleKeyDown"
      @on-blur="handleBlur"></Input>
      <p class="alert">{{tip}}</p>
  </div>
</template>

<script>
export default {
  name: 'inputNum',
  props: {
    // v-model双向绑定
    value: [String, Number],
    // 配置验证正则表达式: 1.默认不传;2.只传文本;3.修改验证方式
    configTips: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否限制英文字符输入,默认限制
    isLimit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formatValue: '',
      fixClass: false,
      tip: '',
      defaultConfig: {
        empty: {
          t: '请输入内容',
          r: /\S+/
        },
        range: {
          t: '必须大于0',
          r: /^\+?[1-9][0-9.]*$|^0\.[0-9]+$/
        }
      }
    }
  },
  methods: {
    handleChange () {
      this.$emit('input', this.formatValue);
    },
    handleBlur () {
      let showAlert = false;
      for (let key in this.defaultConfig) {
        const formatData = this.formatValue === '' || isNaN(this.formatValue) ? this.formatValue : String(Number(this.formatValue));
        if (this.defaultConfig[key] !== null && !this.defaultConfig[key].r.test(formatData)) {
          this.tip = this.defaultConfig[key].t;
          showAlert = true;
          break;
        } else {
          this.tip = '';
        }
      }
      this.fixClass = showAlert;
      this.$emit('checkVaild', !showAlert);
    },
    handleKeyDown (e) {
      if (!this.isLimit) return false;
      // 1.数字
      // 2.删除键
      // 3.小数点
      if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 8 || e.keyCode === 190 || e.keyCode === 110) {

      } else {
        e.preventDefault();
      }
    }
  },
  watch: {
    value: {
      handler (newValue) {
        this.formatValue = String(newValue);
        const keyCols = Object.keys(this.configTips);
        const len = keyCols.length;
        const cloneDefault = {...this.defaultConfig};
        if (len > 0) this.defaultConfig = Object.assign({}, this.defaultConfig, this.configTips);
        for (let key in this.defaultConfig) {
          if (this.defaultConfig[key] !== null && !this.defaultConfig[key].r) {
            this.$set(this.defaultConfig[key], 'r', cloneDefault[key].r);
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less">
.input_num{
  .ivu-input-wrapper{
    margin: 18px 0;
  }
  position: relative;
  .input{
    display: inline-block;
    width: 100%;
    &.fix_class{
      .ivu-input{
        border: 1px solid #ed4014;
      }
    }
  }
  .alert{
    position: absolute;
    left: 0;
    top: 44px;
    color: red;
    font-size: 14px;
  }
}
</style>
