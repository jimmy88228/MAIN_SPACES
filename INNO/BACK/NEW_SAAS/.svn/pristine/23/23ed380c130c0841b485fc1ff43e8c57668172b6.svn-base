<template>
  <div class="img-gallery">
    <div class="gallery_wrapper">
      <div class="gallery_inner" v-if="imgGallery.length">
        <SlickList v-model="imgGallery" :useDragHandle="true" @input="onPageSortInput($event)" axis="x" class="gallery_list" v-viewer>
          <SlickItem v-for="(item, imgIndex) in imgGallery" :index="imgIndex" :key="item.img_url" class="goods_img_wrapper">
            <img :src="item.img_url" class="img"/>
            <Icon type="ios-close-circle-outline" class="close" @click="delImg(item.img_url)" title="删除" />
            <Icon v-handle class="handle" type="md-apps" size="18" title="拖动排序"/>
          </SlickItem>
        </SlickList>
      </div>
      <div class="create_img" @click="selectImg" v-if="_limitLength && imgGallery.length < _limitLength">
        <Icon type="md-add" size="30" color="#2d8cf0"/>
        <p class="len strong_tips">{{imgGallery && imgGallery.length}}/{{_limitLength}}</p>
      </div>
      <div class="create_img" @click="selectImg" v-if="!_limitLength">
        <Icon type="md-add" size="30" color="#2d8cf0"/>
      </div>
    </div>
    <p class="strong_tips">
      <slot name="tips">拖拽可改变图片顺序, 建议尺寸: 800 x 800</slot>
    </p>
  </div>
</template>

<script>
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
  name: 'imgGallery',
  components: {
    SlickList,
    SlickItem
  },
  directives: { handle: HandleDirective },
  props: ['imgList', 'limitLen'],
  data () {
    return {
      imgGallery: []
    }
  },
  computed: {
    _limitLength () {
      return Number(this.limitLen) || 0;
    }
  },
  methods: {
    onPageSortInput (arr) {
      this.$emit('handle-list', arr);
    },
    delImg (url) {
      const index = this.imgGallery.findIndex(item => item.img_url === url);
      this.$emit('del-item', index);
    },
    selectImg () {
      let url = [];
      let that = this;
      if (this.imgGallery.length > 0) {
        url = this.imgGallery.map(item => item.img_url);
      }
      this.$selectMaterial({
        multi: 1,
        type: 'image',
        selectedData: url,
        getList (list) {
          const hasCol = that.imgGallery.map(item => item.img_url);
          let result = [];
          let newItem = list.forEach(item => {
            if (!hasCol.includes(item.src)) {
              result.push({
                id: 0,
                img_url: item.src,
                sort: ''
              })
            }
          });
          that.$emit('handle-list', that._limitLength ? [...that.imgGallery, ...result].slice(0, that._limitLength) : [...that.imgGallery, ...result]);
        }
      });
    }
  },
  watch: {
    imgList: {
      handler (nV) {
        this.imgGallery = JSON.parse(JSON.stringify(nV));
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.img-gallery{
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
          width: 80px;
          position: relative;
          list-style: none;
          margin-right: 20px;
          margin-bottom: 4px;
          .img{
            display: block;
            width: 80px;
            height: 80px;
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
    width: 80px;
    height: 80px;
    border: 1px solid #dcdee2;
    cursor: pointer;
    .len{
      font-size: 12px;
      line-height: 12px;
    }
  }
}
</style>
