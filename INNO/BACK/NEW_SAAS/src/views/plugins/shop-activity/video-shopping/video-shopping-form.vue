<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
          <Step title="填写活动设置信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
          <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="time-limit-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
          <FormItem label="活动名称" prop="active_name">
            <Input v-model="formItem.active_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="标题" prop="title">
            <Input v-model="formItem.title" placeholder="请输入标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动排序">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="视频封面" prop="cover_picture">
            <image-edit :img="formItem.cover_picture" @selectImg="openImagesModal('cover_picture', formItem.cover_picture )" @delImg="handleDelImg('cover_picture')">
              <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是750*1334，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="视频海报" prop="poster_picture">
            <image-edit :img="formItem.poster_picture" @selectImg="openImagesModal('poster_picture', formItem.poster_picture )" @delImg="handleDelImg('poster_picture')">
              <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是750*1100，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="商品视频" prop="video_path" class="video_form">
            <div v-if="formItem.video_path" class="video_wrapper">
              <video :src="formItem.video_path" controls="controls" width="320" height="180">
                您的浏览器不支持 video 标签。
              </video>
              <Icon type="ios-close-circle-outline" class="close" title="删除" @click="delVideo"/>
            </div>
            <template v-if="!formItem.video_path">
              <div class="image-box" @click="selectMaterial('video_path', formItem.video_path, 'video')">
                <Icon type="md-add" size="35"></Icon>
              </div>
            </template>
            <div class="strong_tips">视频大小不能超过100M,建议使用mp4格式</div>
          </FormItem>
          <FormItem label="是否开启" prop="is_enabled">
            <i-switch v-model="formItem.is_enabled" size="large" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="在关联商品详情显示" prop="show_in_goods">
            <i-switch v-model="formItem.show_in_goods" size="large" true-value="1" false-value="0">
              <span slot="open">显示</span>
              <span slot="close">不显</span>
            </i-switch>
          </FormItem>
          <FormItem label="分享标题" prop="share_title">
            <Input v-model="formItem.share_title" placeholder="请输入分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="分享图片" prop="share_picture">
            <image-edit :img="formItem.share_picture" @selectImg="openImagesModal('share_picture', formItem.share_picture )" @delImg="handleDelImg('share_picture')">
              <p class="strong_tips">图片尺寸最佳是500*400，格式为 jpg 或 png，图片大小控制在1MB</p>
            </image-edit>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="group-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        <p class="strong_tips">一个活动最多只能添加十款商品</p>
        <goodsSelect
          :id="id"
          :data="formItem.goodsSelect"
          @get-data="getGoodsData"
          @on-validate-table="handleValidateTable"
          v-show="formItem.goodsSelect && formItem.goodsSelect.length"/>
      </div>
    </transition-group>
    <template v-slot:footer>
      <Divider />
      <div style="text-align: center;">
        <Button type="default" @click="goBack">取消</Button>
        <Button type="primary" @click="confirm" v-show="currentStep === 1">保存</Button>
        <Button type="success" @click="next" v-show="currentStep === 0">下一步</Button>
        <Button type="success" @click="foward" v-show="currentStep === 1">上一步</Button>
      </div>
    </template>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import Control from '@/libs/page-control';
import goodsSelect from './goods-select';

export default {
  props: ['id'],
  provide () {
    return {
      formInstance: this
    }
  },
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    goodsSelect
  },
  mixins: [Control],
  data () {
    return {
      formItem: {
        active_name: '',
        title: '',
        sort: 0,
        cover_picture: '',
        poster_picture: '',
        video_path: '',
        is_enabled: '0',
        show_in_goods: '0',
        share_picture: '',
        share_title: '',
        goodsSelect: []
      },
      ruleValidate: {
        active_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        video_path: [{required: true, message: '商品视频不能为空', trigger: 'blur'}]
      },
      sortVaild: false,
      spinShow: false,
      currentStep: 0,
      showBaisc: true,
      isValidTable: false,
      freezeData: []
    }
  },
  methods: {
		initStep(){
			let params = this.$route.params || {};
			if(params.step){ this.currentStep = params.step; this.showBaisc = false; }
		},
    next () {
      return this.$refs.formValidate.validate().then(valid => {
        if (valid) {
          this.currentStep = 1;
          this.showBaisc = false;
        }
      })
    },
    foward () {
      this.currentStep = 0;
      this.showBaisc = true;
    },
    handleStep (step) {
      step === 0 ? this.foward() : this.next();
    },
    goBack () {
      this.$router.go(-1);
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.videoShoppingInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              goodsSelect: [],
              sort: Number(data.sort)
            });
          }
        }
        this.spinShow = false;
      });
    },
    loadProductData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.bindingVideoGoodsList, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem.goodsSelect = data.filter(item => {
              item.isEnable = Number(item.is_enabled);
              item.isMain = Number(item.is_mainpush);
              item.sort = Number(item.sort);
              return true;
            });
            this.freezeData = JSON.parse(JSON.stringify(this.formItem.goodsSelect));
          }
        }
        this.spinShow = false;
      });
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          this.$refs.formValidate.validateField(name);
        }
      });
    },
    selectMaterial (name, url, type) {
      let that = this;
      this.$selectMaterial({
        type: type,
        selectedData: url,
        getList (item) {
          that.$set(that.formItem, name, item.src);
          that.$refs.formValidate.validateField('video_path');
        }
      });
    },
    delVideo () {
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定删除该视频吗？',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          this.formItem.video_path = '';
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleSelect () {
      this.$selectContent({
        mode: 'goods',
        type: 'checkbox',
        data: this.formItem.goodsSelect,
        getList: (data) => {
          let hasItem = [];
          let newItem = [];
          let findItem;
          data.forEach(item => {
            if (findItem = this.formItem.goodsSelect.find(c => c.goods_id === item.goods_id)) {
              hasItem.push(findItem);
            } else {
              newItem.push(item);
            }
          });
          this.formItem.goodsSelect = [...hasItem, ...newItem].slice(0, 10);
        }
      })
    },
    getGoodsData (data) {
      this.formItem.goodsSelect = data;
    },
    handleClearData (id) {
      let index = this.formItem.goodsSelect.findIndex(item => item.goods_id === id);
      this.formItem.goodsSelect.splice(index, 1);
    },
    handleValidateTable (bool) {
      this.isValidTable = bool;
    },
    confirm () {
      // 开始table数据校验，事件是固定的
      this.$emit('validate-table');
      this.$refs.formValidate.validate(valid => {
        if (valid && this.sortVaild && this.isValidTable) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.videoShoppingEdit : this.$api.videoShoppingAdd, {
            id: this.id,
            active_name: this.formItem.active_name,
            title: this.formItem.title,
            cover_picture: this.formItem.cover_picture,
            poster_picture: this.formItem.poster_picture,
            sort: this.formItem.sort,
            video_path: this.formItem.video_path,
            is_enabled: this.formItem.is_enabled,
            show_in_goods: this.formItem.show_in_goods,
            share_picture: this.formItem.share_picture,  //微信分享图片
            share_title: this.formItem.share_title,  //微信分享标题
            goods_data: this.formItem.goodsSelect.filter(item => {
              item.is_enabled = item.isEnable;
              item.is_mainpush = item.isMain;
              item.sort = item.sort;
              return true;
            }),
            goods_data_status: JSON.stringify(this.freezeData) !== JSON.stringify(this.formItem.goodsSelect) ? 2 : 0
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.isGlobalLeaveTip = false;
              this.$router.go(-1);
            }
            this.spinShow = false;
          });
        }
      })
    }
  },
  mounted () {
		this.initStep();
    if (this.id) this.loadData().then(() => {
      this.loadProductData();
    });
  }
}
</script>

<style lang="less">
.time-limit-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.group-activity-select-wrapper{
  text-align: center;
}
</style>
