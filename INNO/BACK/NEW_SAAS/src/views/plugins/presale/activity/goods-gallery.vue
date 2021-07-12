<template>
  <div class="goods_gallery">
    <SlickList v-model="gallery" :useDragHandle="true" axis="y">
      <SlickItem v-for="(item, index) in gallery" :index="index" :key="item.id" class="wrapper">
        <span class="title" v-handle>规格一:{{item.color_name}}</span>
        <SlickList v-model="item.img_url" :useDragHandle="true" axis="x" class="gallery" v-viewer @input="onPageSortInput($event, index)">
          <SlickItem v-for="(child, imgIndex) in item.img_url" :index="imgIndex" :key="imgIndex" class="goods_img_wrapper">
            <img :src="child" class="goods_img" :alt="'图片'+(imgIndex+1)"/>
            <Icon type="ios-close-circle-outline" class="close" @click="onRemove(index, imgIndex)" title="删除" />
            <Icon v-handle class="handle" type="md-apps" size="18" title="拖动排序"/>
          </SlickItem>
        </SlickList>
        <div class="image-box" @click="openImagesModal(index)">
          <Icon type="md-add" size="40"></Icon>
        </div>
      </SlickItem>
    </SlickList>
  </div>
</template>

<script>
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
  props: {
    goodsGallery: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      gallery: []
    }
  },
  components: {
    SlickList,
    SlickItem
  },
  directives: { handle: HandleDirective },
  methods: {
    onRemove (index, imgIndex) {
      this.gallery[index].img_url.splice(imgIndex, 1);
    },
    onPageSortInput (arr, index) {
      // 排序
      this.gallery[index].img_url = arr;
    },
    openImagesModal (index) {
      this.$selectMaterial({
        multi: 1,
        type: 'image',
        selectedData: this.gallery[index].img_url,
        getList: (list) => {
          const result = list.filter(item => !this.gallery[index].img_url.includes(item.src)).map(item => item.src);
          this.gallery[index].img_url = this.gallery[index].img_url.concat(result);
        }
      });
    }
  },
  watch: {
    goodsGallery (nV) {
      this.gallery = nV;
    },
    gallery: {
      handler (nV) {
        this.$emit('handle-update', nV);
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.goods_gallery{
  margin-top: 24px;
  .wrapper{
    display: flex;
    align-items: center;
    .title{
      margin-right: 20px;
      cursor: move;
    }
  }
  .gallery{
    float: left;
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    .goods_img_wrapper{
      width: 120px;
      position: relative;
      list-style: none;
      margin-right: 20px;
      margin-bottom: 20px;
      .goods_img{
        display: block;
        width: 120px;
        height: 140px;
        line-height: 140px;
        border: 1px solid #eee;
        border-radius: 5px;
        text-align: center;
        object-fit: contain;
        cursor: pointer;
      }
      .handle{
        cursor:move;
        position: absolute;
        left: -8px;
        top: -8px;
      }
      .close{
        color:#ED4014;
        font-size:18px;
        position: absolute;
        right: -8px;
        top: -8px;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
  .image-box{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 140px;
    border: 1px solid #eee;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>
