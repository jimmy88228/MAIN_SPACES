<template>
  <div class="spec_item">
    <!-- <Poptip placement="top-start" v-model="showItem" transfer width="400" popper-class="spec_item_pop"> -->
        <div class="attr_wrapper">
          <Input placeholder="请选择规格" class="spec_input" v-model="formatItem.spec_name" @input="handleChange" :disabled="disabled2">
            <Tooltip :content="formatItem.spec_code" placement="top" slot="prepend" v-show="formatItem.spec_code" :disabled="disabled">
              <Button type="text" class="spec_text">{{formatItem.spec_code.slice(0, 6)}}</Button>
            </Tooltip>
          </Input>
          <!-- <Icon type="md-close-circle" class="close" size="24" @click="delItem"/> -->
          <div class="drag">
            <slot name="drag"></slot>
          </div>
        </div>
        <div class="gallery" v-if="attrType === 'color'" @click.stop>
          <div class="gallery_wrapper">
            <div class="gallery_inner" v-if="formatItem.goods_gallery">
              <div v-for="(item, imgIndex) in formatItem.goods_gallery" :key="imgIndex" class="goods_img_wrapper">
                <img :src="item.img_url" class="img" style="display: block; width: 60px; height: 60px;"/>
                <!-- <Icon type="ios-close-circle-outline" class="close" @click="delImg(imgIndex)" title="删除" />
                <Icon v-handle class="handle" type="md-apps" size="18" title="拖动排序"/> -->
              </div>
            </div>
            <!-- <div class="create_img" @click="selectImg" v-if="formatItem.goods_gallery.length < 10">
              <Icon type="md-add" size="20" color="#2d8cf0"/>
              <p class="len strong_tips">{{formatItem.goods_gallery && formatItem.goods_gallery.length}}/10</p>
            </div> -->
          </div>
          <p class="strong_tips" v-show="curIndex === 0">拖拽可改变图片顺序, 建议尺寸: 800 x 800</p>
        </div>
        <div v-show="showPic && attrType === 'color'">
          <p>当前规格图片共{{formatItem.goods_gallery ? formatItem.goods_gallery.length : 0}}张<a class="view" @click.stop="viewGallery">查看</a></p>
        </div>
        <!-- <div class="sort" slot="content">
          <div class="sort_content">
            <label>分类名</label>
            <Select v-model="formatItem.cat_id" style="width: 120px;margin-right: 10px;">
              <Option :value="0">全部</Option>
              <Option v-for="item in originList" :value="item.groupId" :key="item.groupId">{{ item.value }}</Option>
            </Select>
            <label>属性值</label>
            <Select v-model="formatItem.id" style="width: 120px;">
              <Option :value="0">全部</Option>
              <Option v-for="item in attrList" :value="item.id" :key="item.id" :disabled="item.disabled">{{item.spec_name}}</Option>
            </Select>
          </div>
          <div class="footer">
            <Button size="small" @click="cancel">取消</Button>
            <Button type="primary" size="small" @click="confirm">确认</Button>
          </div>
        </div> -->
    <!-- </Poptip> -->
    <goods-gallery :show-gallery="showGallery" :gallery="gallery" @getGallery="handleGallery" @close="handleClose"></goods-gallery>
  </div>
</template>

<script>
import GoodsGallery from './goods-gallery.vue';
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
  name: 'SpecItem',
  components: {
    GoodsGallery,
    SlickList,
    SlickItem
  },
  directives: { handle: HandleDirective },
  props: {
    originTree: {
      type: Array,
      required: true
    },
    curItem: {
      type: Object,
      required: true
    },
    curIndex: {
      type: Number,
      required: true
    },
    attrType: {
      type: String,
      required: true
    },
    showPic: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showItem: false,
      formatItem: {},
      showGallery: false,
      gallery: [],
      disabled2: true
    }
  },
  computed: {
    disabled () {
      // 阻止两个弹窗同时出现
      return this.showItem;
    },
    attrList () {
      let attrList = [];
      this.originList.forEach(item => {
        if (item.groupId === this.formatItem.cat_id) {
          attrList = item.children;
        }
      });
      return attrList;
    },
    originList () {
      return this.originTree;
    }
  },
  methods: {
    cancel () {
      this.showItem = false;
    },
    confirm () {
      // 循环取值key为id,默认加sign进行标识
      const regex = /sign/gmi;
      if (regex.test(this.formatItem.id) || this.formatItem.id === 0) {
        this.$Message.error('请选择规格');
        return false;
      }
      this.showItem = false;
      this.originList.forEach(item => {
        if (item.groupId === this.formatItem.cat_id) {
          this.formatItem.value = item.value;
        }
      });
      this.attrList.forEach(item => {
        if (item.id === this.formatItem.id) {
          this.formatItem.spec_name = this.curItem.id == this.formatItem.id ? this.formatItem.spec_name : item.spec_name;
          this.formatItem.spec_code = item.spec_code;
          if (this.attrType === 'color') {
            this.formatItem.goods_gallery = item.goods_gallery;
            this.formatItem.spec_sort = item.spec_sort;
          }
          this.$emit('selectedChange', this.formatItem, this.curIndex);
        }
      });
    },
    delItem () {
      this.$emit('deleteItem', this.curIndex);
    },
    viewGallery () {
      this.showGallery = true;
      this.gallery = this.formatItem.goods_gallery;
    },
    handleGallery (list) {
      if (this.attrType === 'color') {
        this.formatItem.goods_gallery = list;
        this.$emit('selectedChange', this.formatItem, this.curIndex);
      }
    },
    handleClose (bool) {
      this.showGallery = bool;
    },
    handleChange () {
      this.$emit('inputChange', this.formatItem, this.attrType);
    },
    onPageSortInput (arr, index) {
      // 排序
      this.$emit('editGallery', this.curIndex, arr);
    },
    delImg (index) {
      let clone = JSON.parse(JSON.stringify(this.formatItem.goods_gallery))
      clone.splice(index, 1);
      this.$emit('editGallery', this.curIndex, clone);
    },
    selectImg () {
      let url = [];
      let that = this;
      if (this.formatItem.goods_gallery.length > 0) {
        url = this.formatItem.goods_gallery.map(item => item.img_url);
      }
      this.$selectMaterial({
        multi: 1,
        type: 'image',
        selectedData: url,
        getList (list) {
          const hasCol = that.formatItem.goods_gallery.map(item => item.img_url);
          const result = [];
          let newItem = list.forEach(item => {
            if (!hasCol.includes(item.src)) {
              result.push({
                img_id: '0',
                img_url: item.src,
                img_desc: ''
              })
            }
          });
          that.$emit('editGallery', that.curIndex, [
            ...that.formatItem.goods_gallery,
            ...result
          ]);
        }
      });
    }
  },
  watch: {
    curItem: {
      handler (newVal) {
        if (newVal) {
          this.formatItem = {...newVal};
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less">
.spec_item{
  margin-bottom: 20px;
  .view{
    text-decoration: underline;
  }
  .attr_wrapper{
    position: relative;
    margin-right: 20px;
    .spec_input{
      width: 220px;
    }
    .close{
      cursor: pointer;
      display: none;
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 2;
    }
    .drag{
      position: absolute;
      left: -10px;
      top: -15px;
    }
    &:hover .close{
      display: inline-block;
    }
    .spec_text{
      width: 84px;
      padding: 0 4px;
      box-sizing: border-box;
    }
  }
  .ivu-poptip-rel{
    display: flex;
  }
  .gallery{
    .gallery_wrapper{
      display: flex;
      align-items: center;
      .gallery_inner{
        display: flex;
        align-items: center;
        .gallery_list{
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .goods_img_wrapper{
            width: 60px;
            position: relative;
            list-style: none;
            margin-right: 15px;
            margin-bottom: 4px;
            .img{
              display: block;
              width: 60px;
              height: 60px;
              border: 1px solid #dcdee2;
              object-fit: contain;
              cursor: pointer;
            }
            .handle{
              display: none;
              cursor:move;
              position: absolute;
              left: -8px;
              top: -8px;
            }
            .close{
              display: none;
              color:#ED4014;
              font-size:18px;
              position: absolute;
              right: -8px;
              top: -8px;
              cursor: pointer;
              font-weight: bold;
            }
            &:hover .handle, &:hover .close{
              display: block;
            }
          }
        }
      }
    }
    .create_img{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 60px;
      height: 60px;
      border: 1px solid #dcdee2;
      cursor: pointer;
      .len{
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
.spec_item_pop{
  .ivu-select-dropdown{
		max-height: 200px;
  }
  .sort_content{
    margin-bottom: 10px;
  }
}
</style>
