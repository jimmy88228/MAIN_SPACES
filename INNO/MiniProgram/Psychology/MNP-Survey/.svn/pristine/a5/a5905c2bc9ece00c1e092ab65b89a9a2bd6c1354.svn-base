<template>
  <view>
    <view v-if="justSelectFir"><slot name="content"></slot></view>
    <!-- uni-app原生 -->
    <picker v-else :mode="mode" :disabled="disabled" :range-key="rangeKey" @columnchange="columnchange" @change="pickerChange" :value="picker_value"
      :range="range">
      <!-- 自定义内容 -->
      <view>
        <slot name="content"></slot>
      </view>
      <!-- 默认模板 -->
      <!-- <template v-if="isShowModel">
          <template v-if="mode == 'selector'">
            <div class="flex-s-c">
              <template v-if="picker_value>=0">
                <text  v-for="(item,index) in range" :key="index">{{range[index][picker_value]}}</text>
              </template>
              <view v-else>请选择</view>
            </div>
          </template>
          <template v-else-if="mode == 'multiSelector'">
            <div class="flex-s-c">
              <template v-if="picker_value.length>0">
                <text  v-for="(item,index) in range" :key="index">{{range[index][picker_value[index]]}}</text>
              </template>
              <view v-else>请选择</view>
            </div>
          </template>
        </template> -->
    </picker>
  </view>
</template>

<script>
  const pageOption = Page.BaseComp({
    data() {
      return {
        picker_value: '',
        showBool: false,
        justSelectFir:false
      }
    },
    props: {
      selectFir: {
        type: Boolean,
        default: false
      },
      isShowModel: {
        type: Boolean,
        default: false
      },
      'range-key': {
        type: String,
        default: ''
      },
      mode: {
        type: String,
        default: ''
      },
      pickerValue: {
        type: Number | String | Array,
        default: ''
      },
      range: {
        type: Array,
        default: function () {
          return [];
        }
      },
      customChange: { //picker组件处理数据  默认false:父组件处理数据则传
        type: Boolean,
        default: false
      },
      disabled: Boolean
    },
    methods: {
      pickerChange(e) {
        this.$emit('pickerChange', e);
        if (this.customChange) {
          this.picker_value = e.detail.value || (this.mode == 'selector' ? '' : []);
        }
      },
      columnchange(e) {
        console.log('columnchange', e);
        this.$emit('columnchange', e);
        if (this.customChange) {
          this.picker_value = e.detail.value || (this.mode == 'selector' ? '' : []);
        }
      },
    },
    watch: {
      pickerValue: {
        handler(nV) {
          this.picker_value = nV;
        },
        immediate: true
      },
      selectFir:{
         handler(nV) {
          this.justSelectFir = nV;
        },
        immediate: true
      }
    },
  })
  export default pageOption
</script>

<style scoped lang="scss">

</style>