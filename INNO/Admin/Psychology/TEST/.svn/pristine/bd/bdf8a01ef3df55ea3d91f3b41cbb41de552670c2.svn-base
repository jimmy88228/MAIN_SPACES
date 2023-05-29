<template>
    <div class="rewrite-tooltip">
        <Tooltip content="content of tooltip" :placement="placement" :disabled="disabled" :theme="theme" :max-width="maxWidth">
            <span>
              <slot name="_tip"></slot>
            </span>
            <div slot="content">
              <slot name="_content"></slot>
            </div>
        </Tooltip>
    </div>
</template>

<script>
export default {
    name: "rewrite-tooltip",
    props: {
      theme: {
        type: String,
        default: 'light'
      },
      placement: {
        type: String,
        default: "bottom"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxWidth: {
        type: String | Number,
        default: 400
      }
    },
    data() {
        return {};
    },
};
</script>

<style lang="less">
.rewrite-tooltip {
    display: inline-block;
    .ivu-tooltip{
      .ivu-tooltip-popper{
        .ivu-tooltip-arrow{

        }
        .ivu-tooltip-inner{
          width: auto;
          white-space: nowrap;
          border: 1px solid #DBDBDB;
          color:#333;
        }
      }
    }
}
</style>