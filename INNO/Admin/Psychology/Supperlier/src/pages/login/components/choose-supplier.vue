<template>
  <custom-modal ref="modal" class="choose-supplier-modal" :footerHide="true" :width="530" :closable="true">
    <div class="supplier-modal-title">选择主体进入</div>
    <div class="supplier-list-area" v-bar>
      <div class="supplier-list">
        <div class="flex-b-c list-item" v-for="(item, index) in supplierData" :key="item.id" @click="chooseSupplier(item.id)">
          <div class="item-l flex-s-c">
            <div class="item-img-area">
              <img :src="item.supplier_logo" class="item-img"/>
            </div>
            <div class="item-name">{{item.name}}</div>
          </div>
          <div class="item-r"><Icon type="ios-arrow-forward" /></div>
        </div>
      </div>
    </div>
    <Spin v-if="pageLoading" fix></Spin>
  </custom-modal>
</template>

<script>
export default {
  name: "choose-supplier-modal",
  props: {
    // supplierData: {
    //   type: Array,
    //   default(){
    //     return []
    //   }
    // }
  },
  data(){
    return {
      supplierData: [],
      pageLoading: false
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal({ supplierData }) {
      this.supplierData = supplierData || [];
      this.$refs.modal.show();
    },
    chooseSupplier(id){
      if(!Number(id)) {
        this.$Message.warning("无效ID");
        return;
      }
      this.pageLoading = true;
      return this.$MainApi
        .selectSupplierLogin({
          data: {
            id: id,
          },
        })
        .then((res) => {
          if (res.code) {
            this.dismiss();
            this.$nextTick(()=>{
              this.$emit("callback", {
                ...res,
                chooseSupplier: id
              });
            })
          } else {
            this.$Message.warning(res.message || "选择无效");
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    }
  }
}
</script>

<style lang="less" scoped>
.choose-supplier-modal{
  .supplier-modal-title{
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 25px;
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .supplier-list-area{
    width:100%;
    height:300px;
    padding-right: 10px;
  }
  .list-item{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    height: 76px;
    border-bottom:1px solid #F1F1F1;
    padding: 10px;
    background-color:#fff;
    cursor: pointer;
    .item-l{
      .item-img-area{
        position:relative;
        border-radius: 100%;
        overflow: hidden;
        width: 44px;
        height: 44px;
        margin-right: 11px;
        flex-shrink: 0;
        background-color:#efefef;
      }
      .item-img{
        width:100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .item-name{

      }
      
    }
  }
  .list-item:hover{
    background-color:#efefef;
  }
}
</style>