<template>
  <Modal
    v-model="isShowModal"
    :width="945"
    class-name="member-view-modal"
    footer-hide
  >
    <div class="organize-layout relative">
      <div class="content-box layout-l">
        <div class="title-box flex-b-c">
          <div>选择人员</div>
          <rewrite-search
            :isShowAppend="false"
            placeholder="搜索人员"
            iconBoxCustomStyle="color:#B0B0B0;padding-right:3px;line-height:30px;font-size:24px;"
            :search="true"
            v-model="inputVal"
          ></rewrite-search>
        </div>
        <div class="bar-box flex">
          <organizeView
            class="organize-box"
            ref="organizeRef"
            :isShowAdd="false"
            :isShowSearch="false"
            :isModal="true"
            :showCheckbox="false"
            :expandNode="expandNode"
            :selectNode="selectNode"
            :onlyCanSelArr="assign_ids"
            :isLImitMain="isLImitMain"
            :isOnlyCanSel="isOnlyCanSel"
            @on-select-change="organizeChange"
          ></organizeView>
          <div class="orgn-members-box" v-bar>
            <hold-layout>
              <Table
                v-if="!inputVal"
                :class="[!multiple?'radio':'']"
                ref="myTable"
                :columns="columns"
                :data="list"
                border
                :loading="tableLoading"
              >
              <!-- :row-class-name="setRowClass" -->
                <template slot="selectArea" slot-scope="{ row }">
                  <div>
                    <Checkbox :value="ids.indexOf(row.id) != -1" :disabled="disabledIds.indexOf(row.id) != -1" @on-change="(state)=>checkMember(state, row)">{{row.member_name}}</Checkbox>
                  </div>
                </template>
              </Table>
              <div v-if="inputVal" class="search-result-box">
                <div v-for="(item,index) in search_list" :key="index" class="check-box-box">
                  <Checkbox :value="ids.indexOf(item.id) != -1" @on-change="(state)=>checkMember(state, item)">{{item.member_name}}</Checkbox>
                </div>
              </div>
            </hold-layout>
          </div>
        </div>
      </div>

      <div class="icon-box flex-c-c">
        <img :src="rightRrrow" class="icon" />
      </div>

      <div class="content-box layout-r">
        <div class="title-box flex-s-c">已选人员{{ids.length ? ids.length : ''}}</div>
        <div class="bar-box member-bar-box" v-bar>
          <div class="member-box">
            <div
              class="member-item flex-b-c"
              v-for="(item, index) in selectData"
              :key="item.id"
            >
              <div>{{ item.member_name||item.name||"" }}</div>
              <Icon
                type="md-close"
                class="close-icon pointer"
                v-if="disabledIds.indexOf(item.id) == -1"
                @click="delMember(index)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="btn-box flex-e-c">
        <Button class="m-r-10" type="default" @click="isShowModal = false"
          >取消</Button
        >
        <Button type="primary" @click="confirm">确定</Button>
      </div>

      <div class="rewrite-page-box" v-show="!inputVal">
        <rewrite-page custom-style="border:none;" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
      </div>
    </div>
  </Modal>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import organizeView from "@/components/view-components/organize-view/index";

export default {
  name: "memberManage",
  mixins: [ListMixin, mixins],
  props: {
    title: {
      type: String,
      default: "选择人员",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    expandNode: {
      type: Boolean,
      default: false,
    },
    selectNode: {
      type: Boolean,
      default: true,
    },
    isAuto: {
      type: Boolean,
      default: false,
    },
    isRegister: { //0是所有, 1是已注册, 没有2
      type: Number | String,
      default: 0
    },
    assign_ids:Array,
    isLImitMain: { // 手动限制选择主体
      type: Boolean | String,
      default: ""
    },
    isOnlyCanSel:Boolean,
  },
  components: {
    organizeView,
  },
  data() {
    return {
      rightRrrow: require("@/assets/images/right-arrow.png"),
      curMembers: [],
      inputVal: "",
      isShowModal: false,
      searchForm: {
        ids: 0,
        is_register: 0, //0是所有, 1是已注册, 没有2
        searchq: "",
      },
      // asyncList:[],
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
            disabledIds.push(item.id)
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
      // let ids = this.asyncList.map(item=>item.id);
      return this.asyncList.filter(item=>{
        return item.member_name.indexOf(this.inputVal) != -1;
      })
    }
  },
  methods: {
    showModal(selectData) {
      console.log('初始化0',selectData)
      this.isShowModal = true;
      this.selectData = JSON.parse(JSON.stringify(selectData || []));
      if (!this.isAuto) {
        this.init();
        this.loadData();
        this.asyncLoadData(1,500);//加载全局数据
      }
    },
    init() {
      this.$refs["organizeRef"] &&
        this.$refs["organizeRef"].getData([], { expandHold: true });
    },
    // setRowClass(row, index){ 
    //   // console.log("row", row, "index", index)
    // },
    onLoadData(page, extraData,extra={}) {
      return this.$MainApi
        .getStructureMemberList({
          data: {
            ...this.searchForm,
            is_register: this.isRegister,
            ...extraData,
            assign_ids:this.assign_ids||[] 
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.items || [];
            if(!extra || !extra.async){
              this.data = {
                total: data.total,
                list: items
              };
            }
          }
          return res
        });
    },
    checkMember(state, row){
      let index = this.ids.indexOf(row.id);
      if(state){
        if(index != -1) return;
        if(this.multiple){
          this.selectData.push(row);
        } else {
          this.selectData = [row];
        }
      } else {
        
        if(index != -1) this.selectData.splice(index, 1);
      }
    },
    delMember(index) {
      if(index || index == 0){
        this.selectData.splice(index, 1);
      }
    },
    organizeChange(detail) {
      detail = detail || {};
      let row = detail.row;
      this.searchForm.ids = row.id;
      this.loadData();
    },
    confirm() {
      this.isShowModal = false;
      this.$emit("success", this.selectData);
    },
  },
};
</script>
<style lang="less">
.member-view-modal{
  .organize-layout {
    .ivu-table td {
      background-color: rgba(251, 251, 251, 1);
      border: none;
    }
    .ivu-table th {
      background-color: rgba(251, 251, 251, 1);
      border: none;
    }
  }
  .radio .ivu-table-header{
    display: none;
  }
  
  .check-box-box{
    line-height: 48px;
    .ivu-checkbox{
      padding-left: 18px;
      padding-right: 8px;
    }
  }
}

</style>
<style lang="less" scoped>
.organize-layout {
  display: flex;
  height: 618px;
  padding: 30px 2px 110px 2px;
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
    width: 60%;
    flex-shrink: 0;
    height: 100%;
  }
  .layout-r {
    flex: 1;
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
    height: calc(100% - 60px);
  }
  .member-bar-box {
    padding: 8px 15px;
  }
  .member-item {
    padding: 5px 0;
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