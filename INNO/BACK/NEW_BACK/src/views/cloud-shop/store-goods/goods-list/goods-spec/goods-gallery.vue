<template>
  <div>
    <Modal
        class="goods_gallery"
        v-model="showGallery"
        title="商品图展示"
        :width="defaultWidth"
        :closable="false">
        <SlickList v-model="goodsGallery" :useDragHandle="true" @input="onPageSortInput($event)" axis="x" class="gallery" v-viewer>
					<SlickItem v-for="(item, imgIndex) in goodsGallery" :index="imgIndex" :key="imgIndex" class="goods_img_wrapper">
						<img :src="item.img_url" class="goods_img" :alt="'图片'+(imgIndex+1)"/>
            <Input size="small" v-model="item.img_desc" placeholder="备注"/>
						<Icon type="ios-close-circle-outline" class="close" @click="onRemove(imgIndex)" title="删除" />
						<Icon v-handle class="handle" type="md-apps" size="18" title="拖动排序"/>
					</SlickItem>
          <div class="image-box" @click="openImagesModal('goods_gallery', goodsGallery.map(item => item.img_url))">
            <Icon type="md-add" size="40"></Icon>
          </div>
				</SlickList>
        <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" @click="confirm">确认</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
  props: {
    showGallery: {
      type: Boolean,
      default:false
    },
    gallery: {
      type: Array,
      required: true
    }
  },
  components: {
    SlickList,
    SlickItem
  },
  directives: { handle: HandleDirective },
  data () {
    return {
      goodsGallery: [],
      defaultWidth: 900
    }
  },
  methods: {
    confirm () {
      if (this.goodsGallery.length === 0) {
        this.$Message.error('请选择规格图片');
        return false;
      }
      this.$emit('getGallery', this.goodsGallery);
      this.$emit('close', false);
    },
    cancel () {
      this.$emit('close', false);
    },
    onPageSortInput (arr, index) {
      // 排序
      this.goodsGallery = arr;
    },
    onRemove (imgIndex) {
      // 删除指定图片
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定删除该商品图片吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          this.goodsGallery.splice(imgIndex, 1);
        }
      });
    },
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        multi: 1,
        type: 'image',
        selectedData: url,
        getList (list) {
          const len = that.goodsGallery.length;
          let newItem = list.slice(len).map(item => {
            return {
              img_id: '0',
              img_url: item.src,
              img_desc: ''
            }
          });
          that.goodsGallery.push(...newItem);
        }
      });
    }
  },
  watch: {
    gallery: {
      handler(newVal) {
        if (newVal) {
          this.goodsGallery = [...newVal].map(item => {
            return {
              img_id: item.img_id,
              img_url: item.img_url,
              img_desc: item.img_desc
            }
          });
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.goods_gallery{
  .gallery{
    padding: 10px;
    display: flex;
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
}
</style>
