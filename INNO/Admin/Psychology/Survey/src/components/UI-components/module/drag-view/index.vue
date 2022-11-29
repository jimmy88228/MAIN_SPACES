<style lang="less">
.drag-view-modal {
  .drag-list {
    position: relative;
    width: 100%;
    height: calc(100vh - 300px);
    .drag-item {
      width: 100px;
      display: inline-block;
      margin: 6px;
      position: relative;
      border-radius: 6px;
      border: 2px solid transparent;
      cursor: move;
      .drag-item-view {
        border: 1px solid #dcdee2;
        overflow: hidden;
        border-radius: 6px;
        .drag-item-icon {
          overflow: hidden;
          width: 100px;
          height: 100px;
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: center center;
          display: block;
          margin: 0 auto;
        }
        .drag-item-txt {
          padding: 4px;
          background-color: #efefef;
          font-size: 12px;
          width: 100%;
        }
      }
      .item-handler {
        position: absolute;
        top: 0px;
        right: -15px;
        transform: translateY(-30%);
        opacity: 0;
        .ivu-icon {
          cursor: pointer;
        }
        .close {
          font-size: 24px;
          color: orangered;
          background: #fff;
          border-radius: 100%;
          margin-bottom: 10px;
        }
      }
      .drag-index {
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 2px 5px;
        color: #2d8cf0;
      }
    }
    .select_item {
      border: 2px solid red;
    }
    .select_item::before {
      content: "\2713";
      position: absolute;
      bottom: -3px;
      right: 1px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      z-index: 3;
    }
    .select_item::after {
      content: "";
      position: absolute;
      bottom: -16px;
      right: -16px;
      width: 0;
      height: 0;
      border-width: 16px;
      border-color: transparent transparent transparent red;
      border-style: solid;
      transform: rotate(45deg);
    }
    .drag-item:hover {
      box-shadow: 0px 0px 5px #ccc;
      .item-handler {
        opacity: 1;
      }
    }
    .drag-list-area {
      width: 100%;
      min-height: calc(100vh - 300px);
      user-select: none;
      padding: 20px;
      box-sizing: border-box;
      .slide-rect {
        position: absolute;
        z-index: 10;
        top: 0;
        border: 1px dashed #007acc;
        background-color: rgba(0, 122, 204, 0.3);
      }
    }
  }
}
</style>

<template>
  <div class="drag-view-area">
    <Modal
      v-model="isShowModal"
      :loading="modalLoading"
      :title="title + '-(可滑动选择元素)'"
      :width="970"
      :styles="{ top: '20px' }"
      class-name="drag-view-modal"
    >
      <div class="flex f-just-between">
        <div></div>
        <Input
          class="basic_input"
          v-model="formSearch.search"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="filterData()"
          @on-clear="filterData"
          @keydown.native.enter.prevent
        >
        </Input>
      </div>
      <div class="drag-list">
        <vue-scroll ref="vue-scroll" :ops="scrollOptions">
          <div
            class="drag-list-area"
            ref="drag-list-area"
            @mousedown="drapMousedown"
            @mousemove="drapMousemove"
            @mouseup="drapMouseup"
          >
            <draggable
              ghost-class="ghost"
              :list="dragData"
              v-bind="dragOptions"
            >
              <div
                class="drag-item"
                :class="[item._checked ? 'select_item' : '', 'drag-item-' + index]"
                :title="item[txtKey]"
                v-for="(item, index) in dragData"
                :name="item.id"
                :key="item.id"
                v-show="!item._isHide"
                @mousedown.stop="() => {}"
                @click.stop="chooseItem(index)"
              >
                <div class="drag-item-view">
                  <div
                    class="drag-item-icon"
                    :style="{ 'background-image': 'url(' + item[imgKey] + ')' }"
                  ></div>
                  <p class="drag-item-txt clamp">{{ item[txtKey] }}</p>
                </div>
                <span class="drag-index">{{ index + 1 }}</span>
                <div class="item-handler">
                  <Icon
                    type="md-close-circle"
                    class="close"
                    @click.stop="remove(index)"
                  ></Icon>
                </div>
                <!-- <div class="" v-if="item._checked">

				</div> -->
              </div>
            </draggable>
            <div class="no-data" v-if="!filterDataLen || filterDataLen == 0 || this.dragData.length == 0">
              暂无匹配数据
            </div>
            <div
              class="slide-rect"
              :style="slideRectStyle"
              v-show="isDownHold"
            ></div>
          </div>
        </vue-scroll>
      </div>
      <div slot="footer">
        <div class="flex f-just-between">
          <div>
            <Checkbox
              v-model="isCheckAll"
              :true-value="1"
              :false-value="0"
              @on-change="changeCheck"
              >全选</Checkbox
            >
            <Button type="warning" @click="batchRemove">删除</Button>
          </div>
          <div>
            <Button type="default" @click="onCancel">取消</Button>
            <Button type="primary" @click="onOk">确定</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "goodsSelect",
  components: {
    draggable,
  },
  props: {
    title: {
      type: String,
      default() {
        return "拖拽排序";
      },
    },
  },
  data() {
    return {
      isShowModal: false,
      dragData: [],
      modalLoading: false,
      imgKey: "",
      txtKey: "",
      formSearch: {
        search: "",
      },
      filterDataLen: 0,
      // 虚拟滚动条
      scrollOptions: {
        mode: "native",
        bar: {
          keepShow: false,
          background: "#c8c8c8",
          size: "3px",
        },
        // 滚动轨道
        rail: {
          size: "3px",
        },
        scrollPanel: {
          scrollingX: false,
        },
      },
      isCheckAll: 0,
      //
      dragListArea: {},
      isDownHold: false,
      isMoveHold: false,
      sX: 0,
      sY: 0,
      eX: 0,
      eY: 0,
      chooseId: [],
      chooseTimer: null
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    slideRectStyle() {
      let style = "";
      let w = Math.abs(this.eX - this.sX);
      let h = Math.abs(this.eY - this.sY);
      let areaT = parseFloat(this.dragListArea.top || 0);
      let areaL = parseFloat(this.dragListArea.left || 0);
      let x, y;
      if (this.sX > this.eX) {
        // 鼠标左移
        if (this.eY < this.sY) {
          style = `transform: translate(${this.eX - areaL}px, ${
            this.eY - areaT
          }px);width:${w}px;height:${h}px;`;
          y = this.eY;
        } else {
          style = `transform: translate(${this.eX - areaL}px, ${
            this.sY - areaT
          }px);width:${w}px;height:${h}px;`;
          y = this.sY;
        }
        x = this.eX;
      } else {
        //鼠标右移
        if (this.eY < this.sY) {
          style = `transform: translate(${this.sX - areaL}px, ${
            this.eY - areaT
          }px);width:${w}px;height:${h}px;`;
          y = this.eY;
        } else {
          style = `transform: translate(${this.sX - areaL}px, ${
            this.sY - areaT
          }px);width:${w}px;height:${h}px;`;
          y = this.sY;
        }
        x = this.sX;
      }
      this.batchChooseItem({x, y, w, h});
      return style;
    },
  },
  methods: {
    showModal({ dragData, imgKey, txtKey, idKey = "id" }) {
      this.isShowModal = true;
      if (dragData.length > 0) {
        for (let i = 0; i < dragData.length; i++) {
          dragData[i]._isHide = false;
          dragData[i]._checked = false;
        }
        this.dragData = dragData || [];
        this.filterDataLen = dragData.length;
        this.idKey = idKey;
        this.imgKey = imgKey;
        this.txtKey = txtKey;
      }
    },
    changeCheck(val) {
      this.dragData.map((item) => {
        item._checked = val;
      });
    },
    filterData() {
      let search = this.formSearch.search || "";
      let filterDataLen = 0;
      if (search) {
        // 考虑到需要拖拽排序，只做隐藏元素，不抽取部分元素展示
        this.dragData.map((item) => {
          if (item[this.txtKey] && item[this.txtKey].indexOf(search) != -1) {
            item._isHide = false;
            filterDataLen += 1;
          } else {
            item._isHide = true;
          }
        });
      } else {
        this.dragData.map((item) => {
          item._isHide = false;
        });
        filterDataLen = this.dragData.length;
      }
      this.filterDataLen = filterDataLen || 0;
    },
    remove(index) {
      this.$delete(this.dragData, index);
    },
    batchRemove() {
      let result = [];
      let dragData = this.dragData || [];
      for (let i = 0; i < dragData.length; i++) {
        if (!dragData[i]._checked) {
          result.push(dragData[i]);
        }
      }
      this.dragData = result;
    },
    chooseItem(index) {
      let item = this.dragData[index] || {};
      this.$set(this.dragData[index], "_checked", !item._checked);
    },
    batchChooseItem(mRect) {
      // if(this.chooseTimer){
      //   clearTimeout(this.chooseTimer);
      //   this.chooseTimer = null;
      // }
      // this.chooseTimer = setTimeout(()=>{
      // }, 50)
      if(!this.isDownHold) return;
      let dragData = this.dragData || [];
      let area = this.$refs['drag-list-area'] || {};
      for(let i = 0; i < dragData.length; i++){
        let item = area.getElementsByClassName('drag-item-' + i)[0];
        let client = item && item.getBoundingClientRect() || {};
        if(client.left + client.width > mRect.x && client.left < mRect.x + mRect.w && client.top + client.height > mRect.y && client.top < mRect.y + mRect.h){
          this.dragData[i]._checked = true;
        } else {
          this.dragData[i]._checked = false;
        }
      }
    },

    drapMousedown(e) {
      this.isDownHold = true;
      this.dragListArea =
        (this.$refs["drag-list-area"] &&
          this.$refs["drag-list-area"].getBoundingClientRect()) ||
        {};
      this.sX = e.x;
      this.sY = e.y;
      this.eX = e.x;
      this.eY = e.y;
    },
    drapMouseup(e) {
      this.isDownHold = false;
      this.eX = e.x;
      this.eY = e.y;
    },
    drapMousemove(e) {
      if (!this.isDownHold) return;
      this.eX = e.x;
      this.eY = e.y;
    },
    onOk() {
      this.isShowModal = false;
      this.$emit("success", { dragData: this.dragData });
    },
    onCancel() {
      this.isShowModal = false;
      this.$emit("fail");
    },
  },
  mounted() {},
  watch: {
    "formSearch.search": {
      handler(nV) {
        this.filterData();
      },
      immediate: true,
    },
  },
};
</script>
