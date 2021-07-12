<template>
  <div class="custom_module_template">
    <div class="container">
      <div class="header">
        <img src="@rs/images/coupons-top.png" class="img"></img>
      </div>
      <div class="edit_content">
        <div
          v-for="(item, index) in moduleData"
          :key="item.uid"
          :class="{'cur': currentIndex === index}"
          class="wrapper"
          draggable
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent
          @drop.prevent="handleDrop($event, index)"
          @click="handleCurrentStatus(index)">
          <Icon type="md-add-circle" color="#155bd4" size="20" class="add_up_icon" @click="handlePrevData(index)"/>
          <Poptip
              placement="left"
              confirm
              title="确认删除吗?"
              style="position: absolute;
              cursor: pointer;
              right: -10px;
              top: -10px;
              z-index: 1;"
              @on-ok="handleDelData(index)"
              transfer>
              <Icon type="md-close-circle" color="#155bd4" size="20" class="close_icon"/>
          </Poptip>
          <slot name="module" v-bind:data="item"></slot>
          <Icon type="md-add-circle" color="#155bd4" size="20" class="add_down_icon" @click="handleDownData(index)"/>
          <Icon type="ios-copy" color="#155bd4" size="20" class="copy_icon" @click="handleCopyData(item, index)"/>
        </div>
        <!-- 插槽 -->
      </div>
      <div class="module_list">
        <p class="title">基础组件</p>
        <div class="basic_module" @click="handleAddModule">
          <span v-if="moduleConfig['adModule']" class="module" data-type="1">广告图</span>
          <span v-if="moduleConfig['bannerModule']" class="module" data-type="2">轮播图</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {AdModule, BannerModule} from './build-class';
import draggable from 'vuedraggable';

export default {
  name: 'CustomModuleTemplate',
  props: {
    selected: {
      type: Array,
      default() {
        return [];
      }
    },
    includeM: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      moduleData: [],
      data: [],
      moduleConfig: {
        adModule: false || this.includeM.includes('adModule'),
        bannerModule: false || this.includeM.includes('bannerModule')
      },
      currentIndex: -1,
      showIcon: false
    }
  },
  methods: {
    getNewData (type, from) {
      let data;
      if (!type) return;
      switch (Number(type)) {
        case 1:
          data = (from ? new AdModule(from) : new AdModule());
          break;
        case 2:
          data = (from ? new BannerModule(from) : new BannerModule());
          break;
        default:
          break;
      }
      return data;
    },
    handleAddModule(e) {
      let type = e.target.dataset.type;
      let data = this.getNewData(type);
      this.moduleData.push(data);
    },
    handlePrevData (index) {
      let data = this.getNewData(1);
      this.moduleData.splice(index, 0, data);
    },
    handleDownData (index) {
      let data = this.getNewData(1);
      this.moduleData.splice(index + 1, 0, data);
    },
    handleCopyData (item, index) {
      let cloneData = this.getNewData(1, JSON.parse(JSON.stringify(item)));
      this.moduleData.splice(index + 1, 0, cloneData);
    },
    handleDelData (index) {
      this.moduleData.splice(index, 1);
    },
    handleDragStart (e, index) {
      e.dataTransfer.setData('getIndex', index);
    },
    handleDrop (e, index) {
      let prevIndex = Number(e.dataTransfer.getData('getIndex'));
      let prevItem = this.moduleData[prevIndex];
      let curItem = this.moduleData[index];
      let moduleData = this.moduleData;

      this.moduleData.splice(prevIndex, 1, curItem);
      this.moduleData.splice(index, 1, prevItem);
    },
    handleCurrentStatus(index) {
      this.currentIndex = index;
    },
    getRelatedId (type, data) {
      let id = 0;
      switch (type) {
        case 'CA':
          id = data.catId;
          break;
        case 'VC':
          id = data.vcatId;
          break;
        case 'GOODS':
          id = data.goodId;
          break;
        case 'COLLAGEGOODS':
          id = data.groupGoodId;
          break;
        case 'PRESELLGOODS':
          id = data.presaleGoodId;
          break;
        case 'SK':
          id = data.timeLimitGoodId;
          break;
        case 'TOJUMP':
          id = data.linkId;
          break;
        case 'CMPAGE':
          id = data.customPageId;
          break;
        case 'COUPON':
          id = data.couponId;
          break;
        case 'Lottery':
          id = data.lotteryId;
          break;
        case 'BRANDGOODS':
          id = data.brandId;
          break;
        default:
          break;
      }
      return id;
    },
    transformData(data) {
      let cloneData = JSON.parse(JSON.stringify(data));
      cloneData = cloneData.map(item => {
          return {
            bind_type: item.type,
            config_value: '', //没啥卵用
            items_list: item.adList.map(c => {
              return {
                tag: c.name,
                func_type: c.linkType,
                related_id: this.getRelatedId(c.linkType, c), //获取对应的id
                img_path: c.pic,
                link_url: c.linkUrl,
                extend_contentd: '' //没啥卵用
              }
            })
          }
        });
        return cloneData;
    }
  },
  watch: {
    selected: {
      handler(nV) {
        nV.forEach(item => {
          let data = JSON.parse(JSON.stringify(this.getNewData(item.type, item)));
          this.moduleData.push(data);
        });
      },
      immediate: true
    },
    moduleData: {
      handler(nV) {
        this.data = this.transformData(nV);
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.custom_module_template {
  .add_up_icon, .add_down_icon, .copy_icon{
    display: none;
    position: absolute;
    cursor: pointer;
    z-index: 1;
  }
  .close_icon{
    display: none;
  }
  .add_up_icon{
    left: 50%;
    transform: translateX(-50%);
    top: -10px;
  }
  .add_down_icon{
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
  }
  .copy_icon{
    right: -10px;
    bottom: -10px;
  }
  .container{
    width: 320px;
    border: 1px solid #ebedf0;
    .header{
      width: 100%;
      .img{
        width: 100%;
        height: 64px;
        object-fit: contain;
      }
    }
    .edit_content{
      background: rgb(249, 249, 249);
      .wrapper{
        border: 1px dashed #ebedf0;
        position: relative;
        margin-bottom: 24px;
        cursor: pointer;
        &.cur{
          border: 1px dashed #155bd4;
        }
        &:hover{
          .add_up_icon, .add_down_icon, .close_icon, .copy_icon{
            display: block;
          }
        }
      }
    }
    .module_list{
      padding: 20px;
      border-top: 1px solid #ebedf0;
      .title{
        margin-bottom: 10px;
      }
      .basic_module{
        display: flex;
        align-items: center;
        flex-direction: row;
        .module{
          padding: 5px 10px;
          border: 1px dashed #ebedf0;
          cursor: pointer;
          margin-right: 10px;
          &:hover{
            color: #155bd4;
            border: 1px dashed #155bd4;
          }
        }
      }
    }
  }
}
</style>
