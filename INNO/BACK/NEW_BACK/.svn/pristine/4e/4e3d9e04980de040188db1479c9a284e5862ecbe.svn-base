<template>
  <div class="ad-module">
    <DPoptip title="编辑内容" placement="right" width="500" :eles="ele">
        <div class="content" :class="contentClass">
          <Carousel v-model="currentIndex" loop v-if="imgList.length">
            <CarouselItem v-for="item in imgList" :key="item.uid">
                <div style="height: 400px;overflow: hidden;">
                  <img :src="item.pic" style="width: 100%;height: 100%; object-fit: contain;"/>
                </div>
            </CarouselItem>
          </Carousel>
          <p v-else style="text-align: center;" class="strong_tips">请添加广告位</p>
        </div>
        <div slot="content">
          <Form ref="FormData" :label-width="60">
            <FormItem label="列表操作">
              <Button type="primary" @click="handleAdd">添加广告位</Button>
            </FormItem>
            <div class="edit">
              <div v-for="(item, index) in originData.adList" :key="item.uid" class="ad_wrapper">
                <div class="image_wrapper">
                  <FormItem :label-width="0">
                    <image-edit :img="item.pic" @selectImg="openImagesModal('pic', item.pic, index)" @delImg="handleDelImg(index)">
                    </image-edit>
                  </FormItem>
                </div>
                <div class="image_wrapper">
                  <FormItem label="标签名">
                    <Input v-model="item.name" placeholder="请输入标签名"/>
                  </FormItem>
                  <FormItem label="跳转链接">
                    <Select v-model="item.linkType" transfer @on-change="val => handleLinkChange(index)">
                      <Option value="CA">标准分类</Option>
                      <Option value="VC">自定义分类</Option>
                      <Option value="GOODS">商品</Option>
                      <Option value="COLLAGEGOODS">拼团商品</Option>
                      <Option value="PRESELLGOODS">预售商品</Option>
                      <Option value="SK">限时特惠</Option>
                      <Option value="TOJUMP">快捷跳转</Option>
                      <Option value="LINKURL">外链</Option>
                      <Option value="CMPAGE">自定义页</Option>
                      <Option value="COUPON">一点领券</Option>
                      <Option value="Lottery">抽奖</Option>
                      <Option value="BRANDGOODS">商品品牌</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="内容选择">
                    <CatComp :cat-id-list="item.catData" :is-auto-load="false" :data="catData" @get-cat-id="id => handleCatData(id, index)" v-show="item.linkType === 'CA'"/>
                    <VcatComp :vcat-id-list="item.vcatData" :is-auto-load="false" :data="vcatData" @get-vcat-id="id => handleVCatData(id, index)" v-show="item.linkType === 'VC'"></VcatComp>
                    <goods-select :data="item.goodData" type="radio" class="brand_select" @del-tag="e => handleCloseTag('goodData', 'goodId', index)"  v-show="item.linkType === 'GOODS'">
                      <Button type="dashed" @click="handleSelect('goods', 'goodData', 'goodId', index)" class="basic_select">选择商品</Button>
                    </goods-select>
                    <pin-select
                      :data="item.groupGoodData"
                      type="radio"
                      class="brand_select"
                      @del-tag="e => handleCloseTag('groupGoodData', 'groupGoodId', index)"
                      v-show="item.linkType === 'COLLAGEGOODS'">
                      <Button type="dashed" @click="handleSelect('pin', 'groupGoodData', 'groupGoodId', index)" class="basic_select">选择商品</Button>
                    </pin-select>
                    <presale-select
                      :data="item.presaleGoodData"
                      type="radio"
                      class="brand_select"
                      @del-tag="e => handleCloseTag('presaleGoodData', 'presaleGoodId', index)"
                      v-show="item.linkType === 'PRESELLGOODS'">
                      <Button type="dashed" @click="handleSelect('presale', 'presaleGoodData', 'presaleGoodId', index)" class="basic_select">选择预售商品</Button>
                    </presale-select>
                    <time-limit-select
                      :data="item.timeLimitData"
                      type="radio"
                      class="brand_select"
                      @del-tag="e => handleCloseTag('timeLimitData', 'timeLimitGoodId', index)"
                      v-show="item.linkType === 'SK'">
                      <Button type="dashed" @click="handleSelect('limit', 'timeLimitData', 'timeLimitGoodId', index)" class="basic_select">选择限时特惠</Button>
                    </time-limit-select>
                    <Select class="basic_select" v-model="item.linkId" v-show="item.linkType === 'TOJUMP'">
                      <Option :value="3">个人中心</Option>
                      <Option :value="4">店铺导航</Option>
                      <Option :value="9">积分商城</Option>
                      <Option :value="11">拼团活动</Option>
                      <Option :value="12">预售</Option>
                      <Option :value="14">付费购券</Option>
                      <Option :value="15">付费分销员</Option>
                      <Option :value="16">签到</Option>
                      <Option :value="17">砍价活动</Option>
                    </Select>
                    <Input v-model="item.linkUrl" placeholder="请输入链接" @on-change="handleLinkUrlChange"  v-show="item.linkType === 'LINKURL'"/>
                    <pages-select :data="item.pageData" type="radio" class="brand_select" @del-tag="e => handleCloseTag('pageData', 'customPageId', index)"  v-show="item.linkType === 'CMPAGE'">
                      <Button type="dashed" @click="handleSelect('pages', 'pageData', 'customPageId', index)" class="basic_select">选择自定义页</Button>
                    </pages-select>
                    <coupon-select :data="item.couponData" type="radio" @del-tag="e => handleCloseTag('couponData', 'couponId', index)"  v-show="item.linkType === 'COUPON'">
                      <Button type="dashed" @click="handleSelect('coupon', 'couponData', 'couponId', index)" class="basic_select">选择优惠券</Button>
                    </coupon-select>
                    <lottery-select :data="item.lotteryData" type="radio" @del-tag="e => handleCloseTag('lotteryData', 'lotteryId', index)"  v-show="item.linkType === 'Lottery'">
                      <Button type="dashed" @click="handleSelect('lottery', 'lotteryData', 'lotteryId', index)" class="basic_select">选择抽奖活动</Button>
                    </lottery-select>
                    <brand-select :data="item.brandData" type="radio" class="brand_select" @del-tag="e => handleCloseTag('brandData', 'brandId', index)"  v-show="item.linkType === 'BRANDGOODS'">
                      <Button type="dashed" @click="handleSelect('brand', 'brandData', 'brandId', index)" class="basic_select">选择品牌</Button>
                    </brand-select>
                  </FormItem>
                </div>
                <div>
                  <Button icon="md-close" type="primary" shape="circle" @click="handleDel(index)"></Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
    </DPoptip>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import {AdModule} from '../../template/build-class';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import CatComp from'@/views/my-components/cat-comp';
import VcatComp from'@/views/my-components/vcat-comp';
import BrandSelect from '@/views/my-components/list-component/index-edit';
import GoodsSelect from '@/views/my-components/list-component/index-edit';
import PagesSelect from '@/views/my-components/list-component/index-edit';
import PinSelect from '@/views/my-components/list-component/index-edit';
import CouponSelect from '@/views/my-components/list-component/index-edit';
import LotterySelect from '@/views/my-components/list-component/index-edit';
import PresaleSelect from '@/views/my-components/list-component/index-edit';
import TimeLimitSelect from '@/views/my-components/list-component/index-edit';
import DPoptip from '../../../d-poptip/poptip/poptip';
import Utils from '@/libs/vue-utils';

export default {
  props: ['data', 'catData', 'vcatData'],
  components: {
    ImageEdit,
    CatComp,
    VcatComp,
    BrandSelect,
    GoodsSelect,
    PagesSelect,
    PinSelect,
    CouponSelect,
    LotterySelect,
    PresaleSelect,
    TimeLimitSelect,
    DPoptip
  },
  data () {
    return {
      originData: [],
      currentKey: '', //重置当前的key
      spinShow: false,
      uid: '',
      ele: null,
      currentIndex: 0
    }
  },
  computed: {
    contentClass () {
      let className;
      switch (this.originData.lineType) {
        case 1:
          className = 'one';
          break;
        case 2:
          className = 'two';
          break;
        case 3:
          className = 'three';
          break;
        case 4:
          className = 'four';
          break;
        case 5:
          className = 'five';
          break;
        default:
          break;
      }
      return className;
    },
    imgList () {
      return this.originData.adList.filter(item => !!item.pic);
    }
  },
  methods: {
    handleSelect (mode, name, key, index) {
      this.$selectContent({
        mode: mode,
        type: 'radio',
        data: this.originData.adList[index][name],
        getList: (data) => {
          this.originData.adList[index][name] = data;
          this.originData.adList[index][key] = data[0].id;
          this.currentKey = key;
        }
      })
    },
    handleCloseTag (name, key, index) {
      this.originData.adList[index][name] = [];
      this.originData.adList[index][key] = 0;
    },
    handleLinkUrlChange () {
      this.currentKey = 'linkUrl';
    },
    handleAdd() {
      let listData = AdModule.getAdList();
      this.originData.adList.push(listData);
    },
    handleDel(index) {
      this.originData.adList.splice(index, 1);
    },
    handleLinkChange (index) {
      // 保证最后只有一个修改
      if (!this.currentKey) return;
      this.originData.adList[index][this.currentKey] = '';
    },
    openImagesModal (name, url, index) {
      this.uid = Utils.createDomUid(6);
      this.$selectMaterial({
        uid: this.uid,
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.originData.adList[index].pic = item.src;
        }
      });
      this.$nextTick(() => {
        this.ele = document.querySelector(`.${this.uid}`);
      });
    },
    handleDelImg (index) {
      this.originData.adList[index].pic = '';
    },
    // 内容选择
    handleCatData(id, index) {
      this.originData.adList[index].catId = id;
      this.currentKey = 'catId';
    },
    handleVCatData(id, index) {
      this.originData.adList[index].vcatId = id;
      this.currentKey = 'vcatId';
    },
  },
  watch: {
    data: {
      handler(nV) {
        this.originData = nV;
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less">
.ad-module{
  .ivu-poptip, .ivu-poptip-rel{
    width: 100%;
  }
  .ivu-form-item{
    margin-bottom: 6px;
  }
  .content{
    .item{
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      padding-right: 5px;
      &:last-child{
        margin-right: 0;
      }
      .img{
        width: 100%;
        display: block;
        margin-bottom: 5px;
        object-fit: contain;
      }
    }
  }
  .edit{
    .ad_wrapper{
      display: flex;
      align-items: center;
      .image_wrapper{
        margin-right: 20px;
      }
    }
  }
  .one{
    .item_fixed{
      width: 100%;
    }
  }
  .two{
    .item_fixed{
      width: 50%;
    }
  }
  .three{
    .item_fixed{
      width: 33.33%;
    }
  }
  .four{
    .item_fixed{
      width: 25%;
    }
  }
  .five{
    .item_fixed{
      width: 20%;
    }
  }
}
</style>
