<template>
  <Modal
    v-model="isShowModal"
    :width="800"
    class-name="member-view-modal"
    footer-hide
  >
    <div class="group-organize-layout relative">
      <div class="content-box layout-l">
        <div class="bar-box flex" style="width: 100%;">
          <groupView style="width:100%;" type="member" :multiple="multiple" :canEdit="false" slot="left" @change="changeGroupPoint" :selectData="selectData"></groupView>
        </div>
      </div>

      <div class="icon-box flex-c-c">
        <img :src="rightRrrow" class="icon" />
      </div>

      <div class="content-box layout-r">
        <div class="title-box flex-s-c">已选分组{{ids.length ? ids.length : ''}}</div>
        <div class="bar-box member-bar-box">
          <vue-scroll>
            <div class="member-box p-r-20">
              <div
                class="member-item flex-b-c"
                v-for="(item, index) in selectData"
                :key="item.group_id"
              >
                <div>{{ item.group_name || item.name || "" }}</div>
                <Icon
                  v-if="!disabledIds.includes(item.id)"
                  type="md-close"
                  class="close-icon pointer"
                  @click="delSelect(index, item)"
                />
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="btn-box flex-e-c">
        <Button class="m-r-10" type="default" @click="isShowModal = false">取消</Button>
        <Button type="primary" @click="confirm">确定</Button>
      </div>
      <!-- <div class="rewrite-page-box" v-show="!inputVal">
        <rewrite-page custom-style="border:none;" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
      </div> -->
    </div>
  </Modal>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import organizeView from "@/components/view-components/organize-view/index";
import groupView from "@/models/components/group-view/index.vue";

export default {
  name: "memberManage",
  mixins: [ListMixin, mixins],
  props: {
    title: {
      type: String,
      default: "选择分组",
    },
    multiple: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    organizeView,
    groupView
  },
  data() {
    return {
      rightRrrow: require("@/assets/images/right-arrow.png"),
      curMembers: [],
      inputVal: "",
      isShowModal: false,
      searchForm: {
        group_id: 0,
        searchq: ""
      },
      editTitle: "",
      selectData: [],
      isSelectAll: false,
      disabledIds: []
    };
  },
  computed: {
    ids() {
      let selectData = this.selectData || [];
      let ids = [], disabledIds = [];
      if (selectData instanceof Array) {
        for (let i = 0; i < selectData.length; i++) {
          let item = selectData[i];
          if(typeof(item) == "object"){
            ids.push(item.id);
          } else {
            ids.push(item);
          }
          if(item.disabled){
            disabledIds.push(item.id);
          }
        }
        // 全选
        let isAll = this.list.length >0 && true || false;
        this.list.map((item)=>{
          if(ids.indexOf(item.id) == -1){
            isAll = false;
            return;
          }
        })
        if(this.isSelectAll != isAll) this.isSelectAll = isAll;
      }
      this.disabledIds = disabledIds;
      return ids;
    },
    search_list(){
      return this.asyncList.filter(item=>{
        return item.member_name.indexOf(this.inputVal) != -1;
      })
    }
  },
  methods: {
    showModal(selectData) {
      this.isShowModal = true;
      this.selectData = JSON.parse(JSON.stringify(selectData || []));
    },
    changeGroupPoint(item, selection){
      this.selectData = selection || [];;
    },
    delSelect(index, item) {
      if(item.disabled){
        return;
      }
      if(index || index == 0){
        this.selectData.splice(index, 1);
      }
    },
    confirm() {
      this.isShowModal = false;
      this.$emit("success", this.selectData);
    },
  },
};
</script>
<style lang="less" scoped>
.member-view-modal{
  /deep/.group-organize-layout {
    .ivu-table td {
      background-color: rgba(251, 251, 251, 1);
      border: none;
    }
    .ivu-table th {
      background-color: rgba(251, 251, 251, 1);
      border: none;
    }
  }
  /deep/.radio .ivu-table-header{
    display: none;
  }
  
  /deep/.check-box-box{
    line-height: 48px;
    .ivu-checkbox{
      padding-left: 18px;
      padding-right: 8px;
    }
  }
}

</style>
<style lang="less" scoped>
.group-organize-layout {
  display: flex;
  height: 618px;
  padding: 30px 2px 50px 2px;
  .content-box {
    background: rgba(251, 251, 251, 1);
    // border: 2px solid #721c1c;
    border: 2px solid #F2F2F2;
    border-radius: 6px;
  }
  .title-box {
    border-bottom: 2px solid #f3f3f3;
    padding: 10px 15px;
    height: 60px;
  }
  .layout-l {
    width: 50%;
    flex-shrink: 0;
    height: 100%;
  }
  .layout-r {
    flex: 1;
    overflow: hidden;
  }
  .icon-box {
    width: 66px;
    height: 100%;
  }
  .icon {
    width: 32px;
    height: 23.2px;
  }
  .bar-box {
    height: 100%;
  }
  .member-bar-box {
    padding: 8px 0px 8px 15px;
    height: calc(100% - 60px);
  }
  .member-item {
    padding: 10px 0;
  }
  .organize-box {
    flex-shrink: 0;
    height: 100%;
    flex: 1;
  }
  .orgn-members-box {
    border-left: 2px solid #f3f3f3;
    width: 40%;
    height: 100%;
  }
  .btn-box {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
  }
  .rewrite-page-box{
    bottom: 35px;
    position: absolute;
    width: 100%;
  }
}
</style>