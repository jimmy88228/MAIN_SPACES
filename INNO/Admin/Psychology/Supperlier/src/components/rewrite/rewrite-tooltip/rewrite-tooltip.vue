<template>
    <div class="rewrite-tooltip">
        <Tooltip content="content of tooltip" theme="light" :max-width="400">
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
          max-width: unset !important;
          width: auto;
          white-space: nowrap;
          border: 1px solid #DBDBDB;
          color:#333;
        }
      }
    }
}
</style>