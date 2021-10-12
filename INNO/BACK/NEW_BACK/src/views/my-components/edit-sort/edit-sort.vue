<template>
  <div class="edit_sort">
    <Input
      v-model="formatValue"
      class="basic_input"
      :class="{'fix_class': fixClass}"
      type="text"
      placeholder="请输入内容"
      style="width:100px;"
      :maxlength="maxLength"
      @on-keydown="handleKeyDown"
      @on-blur="handleBlur"></Input>
    <p class="strong_tips">{{dTip ? dTip : `值${rangeStart}~${rangeEnd}，数字越大的排前`}}</p>
    <p class="alert" v-show="emptyTip && required">{{eTip ? eTip : '排序不能为空'}}</p>
    <p class="alert" v-show="!emptyTip && required && rangeTip">值{{rangeStart}}~{{rangeEnd}}</p>
  </div>
</template>

<script>
export default {
  name: 'editSort',
  props: {
    value: [String, Number],
    range: {
      type: Array,
      default () {
        return [0, 9999];
      }
    },
    dTip: {
      type: String,
      default: ''
    },
    eTip: {
      type: String,
      default: ''
    },
    disabledRange: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formatValue: '',
      emptyTip: false,
      rangeTip: false,
      fixClass: false
    }
  },
  computed: {
    rangeStart () {
      return this.range[0] || 0;
    },
    rangeEnd () {
      return this.disabledRange ? Number.MAX_SAFE_INTEGER : this.range[1];
    },
    maxLength () {
      return this.disabledRange ? Number.MAX_SAFE_INTEGER : String(this.range[1]).length;
    }
  },
  methods: {
    handleBlur () {
      this.emptyTip = this.formatValue === '';
      this.rangeTip = (Number(this.formatValue) > this.rangeEnd || Number(this.formatValue) < this.rangeStart || Number.isNaN(Number(this.formatValue)));
      this.fixClass = (this.emptyTip && this.required) || this.rangeTip;
      this.$emit('input', this.formatValue);
      this.$emit('checkVaild', (!this.emptyTip && this.required) && !this.rangeTip);
    },
    handleKeyDown (e) {
      if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 8) {

      } else {
        e.preventDefault();
      }
    }
  },
  watch: {
    value: {
      handler (newValue) {
        this.formatValue = newValue;

        this.emptyTip = this.formatValue === '';
        this.rangeTip = (Number(this.formatValue) > this.rangeEnd || Number(this.formatValue) < this.rangeStart || Number.isNaN(Number(this.formatValue)));
        this.fixClass = (this.emptyTip && this.required) || this.rangeTip;
        this.$emit('checkVaild', (!this.emptyTip && this.required) && !this.rangeTip);
      },
      immediate: true
    }
  }
}
</script>

<style lang="less">
.edit_sort{
  position: relative;
  .basic_input{
    &.fix_class{
      .ivu-input{
        border: 1px solid #ed4014;
      }
    }
  }
  .alert{
    position: absolute;
    left: 0;
    top: 50px;
    color: red;
  }
  .ivu-form-item{
    margin-bottom: 18px;
  }
}
</style>
