<template>
  <div class="page-setting-comp">
    <div class="flex-b-c setting-comp-tip">
      <span>可以拖动排序组件</span>
      <div class="clear-all" v-show="compList.length > 0">
        <Poptip confirm placement="right-start" title="确定清空吗？" @on-ok="removeComp('ALL')">
          清空组件
        </Poptip>
      </div>
    </div>
    <draggable class="draggable-box" ghost-class="ghost" :list="compList" :group="{name:'itemBox'}" handle=".handle_r" v-bind="dragOptions" @start="dragStart" @end="dragEnd">
      <div v-for="(item,index) in compList" :key="item.module_type + '|' + index" :class="['com-item',index == commonInfo.curIndex ? 'selected' : '']">
        <Row>
          <Col :span="3">
          <Icon type="md-menu" class="handle_r" />
          </Col>
          <Col :span="18" style="font-size:13px;line-height:2.1;">
          {{ item.module_name || "未知组件"}}
          {{ item.setting && item.setting.widgetRemark ? "备注：[" + item.setting.widgetRemark + ']' : '' }}
          </Col>
          <Col :span="3">
          <Poptip confirm v-if="item.can_remove" placement="right-start" title="确定删除吗？" @on-ok="removeComp(index)">
            <Icon type="md-trash" class="close" />
          </Poptip>
          </Col>
        </Row>
      </div>
    </draggable>
    <div v-if="compList.length == 0" class="no-comp-tip">暂无排序组件</div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "pageSettingComp",
  components: {
    draggable,
  },
  props: {
    compList: {
      type: Array,
      default: () => [],
    },
    commonInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currSelectIndex: -1,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        chosenClass: "chosen",
      };
    },
  },
  methods: {
    itemChange(index) {
      if (index || index == 0) {
        this.commonInfo.curIndex = index;
      }
    },
    dragStart(e) {
      this.itemChange(e.oldIndex);
    },
    dragEnd(e) {
      this.itemChange(e.newIndex);
    },
    removeComp(index) {
      if (index == "ALL") {
        // this.$store.commit("setPageCompList", []);
        this.$emit('setCmpList',[]);
        this.commonInfo.curIndex = -1;
      } else {
        if (this.commonInfo.curIndex == index) {
          this.commonInfo.curIndex = -1;
        }
        this.$delete(this.compList, index);
        this.$nextTick(() => {
          this.commonInfo.curIndex = index;
        });
      }
    },
  },
  watch: {
    // currSelectIndex: {
    //   handler(nV) {
    //     console.log('$root',this.$root)
    //     console.log('$parent',this.$parent)
    //     console.log('page-setting-comp setSelectCompIndex watch',nV)
    //     this.$store.commit("setSelectCompIndex", nV);
    //   },
    //   immediante: true,
    // },
  },
};
</script>

<style lang="less" scoped>
.page-setting-comp {
  width: 100%;
  min-height: calc(100% - 0px);
  padding: 0px 10px;
  .setting-comp-tip {
    position: sticky;
    top: 0px;
    left: 0px;
    background-color: #fff;
    z-index: 2;
  }
  .draggable-box {
    padding-top: 20px;
    min-height: 170px;
    .com-item {
      box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
      border-radius: 2px;
      background-color: #fff;
      margin: 10px 0px;
      padding: 5px;
      opacity: 0.6;
      &.selected{
        opacity: 1;
      }
      .handle_r {
        font-size: 20px;
        color: #ccc;
        cursor: move;
        margin-top: 2px;
      }
      .close {
        font-size: 20px;
        color: #ccc;
        float: right;
        cursor: pointer;
        margin-top: 2px;
      }
    }
  }
  .no-comp-tip {
    margin: 200px 0px;
    display: block;
    text-align: center;
    color: #b2b2b2;
  }
}
</style>