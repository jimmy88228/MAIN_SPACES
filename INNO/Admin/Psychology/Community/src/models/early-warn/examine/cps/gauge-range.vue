<template>
  <div class="gauge-range">
    <FormItem label="量表" :label-width="50">
      <data-select
        v-model="searchForm.model_id"
        :isShowAll="false"
        class="screen-item"
        type="gauge"
        valueKey="model_id"
        nameKey="model_name"
        ref="gaugeSelectRef"
        @change="changeSelect('gauge')"
      ></data-select>
    </FormItem>
    <FormItem label="得分状态" :label-width="80">
      <data-select
        v-model="searchForm.range_id"
        :isShowAll="false"
        :customData="customData.range"
        :params="{ model_id: searchForm.model_id }"
        class="screen-item"
        type="range"
        valueKey="id"
        nameKey="range_name"
        ref="rangeSelectRef"
        @change="changeSelect('range')"
      ></data-select>
    </FormItem>
  </div>
</template>

<script>
export default {
  data() {
    return {
        timer:null,
        customData:{range:[]}

    };
  },
  props: { 
    searchForm: {
        type: Object,
        default: () => ({})
    },
  },
  methods: {
    changeSelect(type) {
      // 初始化时不初始化传进来的值
      this.$nextTick(() => {
        switch (type) {
          case "gauge":
            this.$set(this.searchForm, "range_id", 0);
            this.$set(this.searchForm, "min_value", 0);
            this.$set(this.searchForm, "max_value", 0);
            if (this.customData.range.length <= 0) {
              let curGauge =
                (this.$refs["gaugeSelectRef"] &&
                  this.$refs["gaugeSelectRef"].getCurData()) ||
                [];
              this.customData.range = curGauge;
            }
            this.$nextTick(() => {
              this.$refs["rangeSelectRef"] &&
                this.$refs["rangeSelectRef"].getData();
            });
            break;
          case "range":
            if (this.searchForm.range_id) {
              let curRange =
                (this.$refs["rangeSelectRef"] &&
                  this.$refs["rangeSelectRef"].getCurData()) ||
                [];
              let curItem =
                curRange.find((item) => item.id == this.searchForm.range_id) ||
                {};
              this.$set(this.searchForm, "min_value", curItem.min_value || 0);
              this.$set(this.searchForm, "max_value", curItem.max_value || 0);
              break;
            } else {
              this.$set(this.searchForm, "min_value", 0);
              this.$set(this.searchForm, "max_value", 0);
              this.customData.range = [];
            }
          default:
            break;
        }
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.$nextTick(() => {
            this.timer = setTimeout(() => {
                this.$emit("on-change", this.searchForm);
                this.timer = null;
            }, 300);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.gauge {
  .screen-item {
    width: 150px;
  }
}
</style>