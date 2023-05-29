<template>
    <div class="rewrite-drawer">
        <Drawer class="page-drawer-area" :value="value" :lock-scroll="lockScroll" :closable="closable" :transfer="transfer" :inner="inner" :width="width" @on-close="visibleChange(false)" @on-visible-change="visibleChange">
            <div class="rewrite-drawer-cont" v-if="state">
                <div class="header">
                    <slot name="header"></slot>
                </div>
                <div class="cont" v-bar>
                    <div>
                      <slot></slot>
                    </div>
                </div>
                <div class="footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </Drawer>
    </div>
</template>
<script>
export default {
    name: "rewriteDrawer",
    model: {
        prop: "value",
        event: "on-change",
    },
    props: {
        value: Boolean,
        lockScroll: {
          type: Boolean,
          default: true
        },
        closable: Boolean,
        transfer: Boolean,
        inner: Boolean,
        width: {
            type: Number,
            default: 500,
        },
    },
    data() {
        return {
            state:false
        };
    },
    methods: {
        visibleChange(state) {
            this.state = state;
            this.$emit("on-change", state);
        },
    },
};
</script>
<style lang="less" scoped>
.rewrite-drawer {
    .rewrite-drawer-cont {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .header{
      flex-shrink: 0;
      width: 100%;
      line-height: 40px;
      font-size: 18px;
      color: #171717;
      padding: 10px;
    }
    .cont {
      width: 100%;
      flex: 1;
      padding: 10px;
      padding-right: 20px;
      padding-top: 20px;
    }
    .footer{
      flex-shrink: 0;
      padding: 15px 0px;
      text-align: center;
    }
}
</style>
<style lang="less">
.page-drawer-area {
    .ivu-drawer-mask-inner,
    .ivu-drawer-mask {
        // padding-top: 70px;
        // top: -70px;
        // box-sizing: unset;
    }
    .ivu-drawer-wrap-inner,
    .ivu-drawer-wrap {
        // top: -70px;
        .ivu-drawer-body {
            padding: 5px;
        }
        // .edit-title {
        //     width: 100%;
        //     line-height: 40px;
        //     font-size: 18px;
        //     color: #171717;
        //     padding: 10px;
        //     padding-bottom: 20px;
        // }
        
        // .class-edit-area {
        //     width: 100%;
        //     height: 100%;
        //     display: flex;
        //     flex-direction: column;
        //     // transition: padding .35s;
        //     .edit-cont {
        //         width: 100%;
        //         flex: 1;
        //         padding-left: 10px;
        //         padding-right: 10px;
        //         .edit-cont-area {
        //             border: 1px solid #f2f2f2;
        //             border-bottom: none;

        //             .item-header {
        //                 padding-left: 20px;
        //                 height: 60px;
        //                 line-height: 60px;
        //                 width: 100%;
        //                 display: block;
        //                 font-family: PingFangSC-Regular;
        //                 font-size: 16px;
        //                 color: #171717;
        //                 margin-bottom: 20px;
        //                 background: rgba(216, 216, 216, 0.11);
        //                 border-top: 1px solid #f2f2f2;
        //                 border-bottom: 1px solid #f2f2f2;
        //             }
        //         }

        //         .edit-foot {
        //             padding: 20px 0px;
        //             text-align: center;
        //         }
        //     }
        // }
    }
}
</style>