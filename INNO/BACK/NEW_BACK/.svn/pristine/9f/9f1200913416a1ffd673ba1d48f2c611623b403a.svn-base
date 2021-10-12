<template>
  <div class="spec_images">
    <div v-for="(item, index) in colorList" :key="item.spec1_id">
      <Row>
        <Col :lg="4" :xl="4" :xxl="2" class="title_col">
          <p class="title">{{item.spec_name}}</p>
        </Col>
        <Col :lg="19" :xl="19" :xxl="21">
          <SlickList v-model="item.goods_gallery" :useDragHandle="true" axis="x" class="gallery" v-viewer>
            <SlickItem v-for="(item, imgIndex) in item.goods_gallery" :index="imgIndex" :key="imgIndex" class="goods_img_wrapper">
              <img :src="item.img_url" class="goods_img" :alt="'图片'+(imgIndex+1)"/>
              <!-- <Input size="small" v-model="item.img_desc" placeholder="备注"/> -->
              <Icon type="ios-close-circle-outline" class="close" @click="onRemove(index, imgIndex)" title="删除" />
              <Icon v-handle class="handle" type="md-apps" size="18" title="拖动排序"/>
            </SlickItem>
          </SlickList>
          <div class="image-box" @click="openImagesModal(index, item.goods_gallery.map(item => item.img_url))">
            <Icon type="md-add" size="40"></Icon>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
  props: {
    colorList: {
      type: Array
    }
  },
  components: {
    SlickList,
    SlickItem
  },
  directives: { handle: HandleDirective },
  data () {
    return {

    }
  },
  methods: {
    onRemove (index, imgIndex) {
      // 删除指定图片
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定删除该商品图片吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          this.colorList[index].goods_gallery.splice(imgIndex, 1);
        }
      });
    },
    openImagesModal (index, url) {
      let that = this;
      this.$selectMaterial({
        multi: 1,
        type: 'image',
        selectedData: url,
        getList (list) {
          const hasCol = that.colorList[index].goods_gallery.map(item => item.img_url);
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
          that.colorList[index].goods_gallery.push(...result);
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.spec_images{
  .title_col{
    width: 120px;
    text-align: right;
    padding-right: 12px;  
    .title{
      padding: 0 10px;
      overflow: hidden;
      word-break: break-all;
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
    margin-bottom: 50px;
  }
}
</style>
