<template>
  <div class="cev-root bg-page spin-box">
    <div class="cev-root" v-bar>
      <div class="bg-shadow padding20 list-box">
        <div class="cev-toolbar">
          <div class="left">{{ title }}</div>
          <div class="right">
            <Button type="primary" @click="getAllList">所有报名人</Button>
            <Input class="inputable" placeholder="请输入搜索内容" v-model="keywords" clearable />
            <Button type="primary" @click="e=>loadData()">
              <i class="iconfont min r5 icon-search"></i>搜索
            </Button>
            <Button type="primary" @click="e=>exportExcel()">导出名单</Button>
          </div>
        </div>
        <Table
          ref="table"
          class="table"
          :columns="columns"
          :data="list"
          border
          @on-selection-change="selectChange"
        >
          <template slot="user" slot-scope="p">
            <div class="padding20">
              <div>{{ p.row.user_name }}</div>
              <div>{{ p.row.mobile_phone }}</div>
            </div>
          </template>
          <template slot="specs" slot-scope="p">
            <div>{{ p.row.specsStr }}</div>
          </template>
          <template slot="action" slot-scope="p">
            <div v-if="p.row.lottery_id > 0">已设置中奖</div>
            <Button type="primary" @click="e=>setSelect(e,p.row.enroll_id)" v-else>设置为中奖</Button>
          </template>
        </Table>
        <div class="left select-all">
          <Checkbox v-model="isSelectAll" @on-change="selectAll" class="all-checkbox"></Checkbox>全选
          <Button class="set-prize-btn" type="primary" @click="e=>setSelect(e)">设为中奖</Button>
        </div>
        <Page
          v-if="showPage"
          :total="count"
          :current="pageIndex"
          :page-size="pageSize"
          :page-size-opts="pageSizeOpts"
          @on-change="e=>loadData(e)"
          @on-page-size-change="handlePageSizeChange"
          show-sizer
          show-elevator
          show-total
          transfer
        ></Page>
      </div>
    </div>
    <Spin v-if="loading" class="spin" size="large" fix></Spin>
    <progressView :viewShow="exportLoad" :animShow="exportClass" :percent="percentVal"></progressView>
  </div>
</template>

<script>
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import StringHelper from "@/helper/utils/string-util";
import Mixin from "./mixin";
import exportExcelHelper from "@/support/exportExcel/exportExcel";
import progressView from "@/components/progress-view";
let model = 5,pSize = 1000;
export default {
  name: "ScreenList",
  mixins: [ListPageMixin, Mixin],
  components: {},
  data() {
    return {
      keywords: "",
      selectData: [],
      isSelectAll: false,
      exportDataList:[],
      exportLoad:false,
      exportClass:false,
      percentVal:10,
    };
  },
  mounted() {
    this.initParams();
    this.loadData();
  },
  methods: {
    initParams() {
      let query = this.$route.query || {};
      this.actId = query.actId;
      this.ruleId = query.ruleId;
      this.title = query.title;
    },
    onLoadData(index, data,type) {
      if (!(parseInt(this.actId) > 0)) return;
      type != 'export' && (this.loading = true);
      data = {
        activityId: this.actId,
        etime: "",
        keywords: this.keywords,
        orderBy: "",
        ...data
      };
      MainApi.getEnrollInfoList({
        data: data
      })
        .then(res => {
          if (res.code === "1") {
            type != 'export' && (this.pageIndex = index);
            let data = res.data;
            let list = data.list || [];
            let canSelectNum = 0;
            for (let i = 0; i < list.length; i++) {
              // 规格
              let specs = (list[i].specs && JSON.parse(list[i].specs)) || "";
              if (specs) {
                data.list[i].specsStr = "";
                for (let j in specs) {
                  data.list[i].specsStr = data.list[i].specsStr
                    ? data.list[i].specsStr + "; " + specs[j]
                    : specs[j];
                }
              }
              if(type == 'export'){
                data.list[i].codes = exportExcelHelper.csvTransform(data.list[i].codes); 
                data.list[i].id_card = exportExcelHelper.csvTransform(data.list[i].id_card);
                data.list[i].mobile_phone = exportExcelHelper.csvTransform(data.list[i].mobile_phone);
                data.list[i].create_time = exportExcelHelper.csvTransform(data.list[i].create_time); 
              }
              // 可选
              if (parseInt(list[i].lottery_id) > 0) {
                list[i]._disabled = true;
              } else {
                canSelectNum++;
              }
            }
            
            type != 'export' && (this.canSelectNum = canSelectNum);
            type != 'export' && (this.data = JSON.parse(JSON.stringify(data)));
          } else {
            if(type == 'export'){
                return Promise.resolve([]);
            }
            return Promise.reject(res.msg);
          }
        })
        .catch(msg => {
          if (msg && StringHelper.trim(msg)) {
            this.$Message.error(msg || "加载失败");
          }
        })
        .finally(() => {
          type != 'export' && (this.loading = false);
        });
    },
    getAllList() {
      this.keywords = "";
      this.loadData();
    },
    selectAll(status) {
      this.$refs.table.selectAll(status);
    },
    selectChange(data) {
      if (data.length > 0 && this.canSelectNum === data.length) {
        this.isSelectAll = true;
      } else {
        this.isSelectAll = false;
      }
      if (data.length > 0) {
        this.selectData = data;
      }
    },
    setSelect(e, id) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否确认开奖",
        onOk: () => {
          let enrollIds = [];
          if (id) {
            enrollIds.push(id);
          } else {
            for (let i = 0; i < this.selectData.length; i++) {
              let enrollId = this.selectData[i].enroll_id;
              enrollIds.push(enrollId);
            }
          }
          if (enrollIds.length > 0) {
            activiePrize.call(this, enrollIds);
          }
        }
      });
    },
    exportExcel() {
      let columns = this.columns.filter(i => i.key !== "user" && i.key !== "select" && i.key !== "action");
      columns.unshift({ "key": "mobile_phone", "title": "手机号" });
      columns.unshift({ "key": "user_name", "title": "报名人信息" });
      let obj = {
        name: "筛选表格",
        datas: this.list,
        colums: columns
      };
      exportExcelHelper.exportCsv(obj);
    },
    exportClick(){
          let start = 0, end=model, total = this.total||0;
          if(!total || this.exportLoad)return
          if(this.exportDataList && this.exportDataList.length == total){
              this.exportExcel();
              return
          }
          exportExcelHelper.getList({start,end,model,pSize,total,fnc:this.promiseModel,that:this}).then(res=>{
              this.exportDataList = res;
              console.log('resres',res)
              this.exportExcel();
          });
      },
      promiseModel({start,end}){
          let _arr = [];
          for(let i = start,len=end;i<len;i++){
              let _params = {
                      activityId: this.actId,
                      keywords: "",
                      orderBy: "",
                      pageIndex:i+1,
                      pageSize: pSize,
              }
              _arr.push(this.onLoadData(i,_params,'export')); 
          }
          return _arr;
      },
  }
};
function activiePrize(enrollIds) {
  this.loading = true;
  MainApi.addLotteryUser({
    data: {
      activityId: this.actId,
      ruleId: this.ruleId,
      enrollIds: enrollIds
    }
  })
    .then(res => {
      if (res.code === "1") {
        this.$Message.info("设置成功");
        this.isSelectAll = false;
        this.loadData();
      } else {
        return Promise.reject(res.msg);
      }
    })
    .catch(msg => {
      if (msg && StringHelper.trim(msg)) {
        this.$Message.error(msg || "加载失败");
      }
    })
    .finally(() => {
      this.loading = false;
    });
}
</script>

<style lang="less" scoped >
.select-all {
  width: 100%;
  .all-checkbox {
    margin: 0px 25px;
  }
  .set-prize-btn {
    margin-left: 20px;
  }
}
</style>
