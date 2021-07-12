<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="直播间信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="直播商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="kan-activity-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
          <FormItem label="直播间信息">
            <p>{{formItem.basicData.name}}</p>
            <p>房间 {{formItem.basicData.room_id}}</p>
            <p>开播 {{formItem.basicData.start_time}}</p>
            <p>结束 {{formItem.basicData.end_time}}</p>
            <p>主播 {{formItem.basicData.author_name}}</p>
          </FormItem>
          <FormItem label="海报图">
            <img :src="formItem.basicData.share_img" style="display: block; width: 80px; cursor: pointer" v-viewer/>
          </FormItem>
          <FormItem label="直播广场列表封面图" prop="cover_img">
            <image-edit :img="formItem.cover_img" @selectImg="openImagesModal('cover_img', formItem.cover_img )" @delImg="handleDelImg('cover_img')">
              <p class="strong_tips">图片尺寸最佳是800*640，格式为 jpg 或 png，图片大小控制在1M</p>
            </image-edit>
          </FormItem>
          <FormItem label="直播描述" prop="description">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.description"
              placeholder="请输入直播描述"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="是否直播列表显示" prop="is_enable">
            <i-switch v-model="formItem.is_enable" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="bargin-activity-select-wrapper">
        <Table :columns="tableColumns" :data="tableData" ref="myTable">
        </Table>
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
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit
  },
  data () {
    return {
      formItem: {
        cover_img: '',
        description: '',
        is_enable: '0',
        basicData: {
          author_name: '',
          share_img: '',
          name: '',
          room_id: '',
          start_time: '',
          end_time: '',
        }
      },
      ruleValidate: {

      },
      tableColumns: [
        {
          title: '基本信息',
          key: ''
        },
        {
          title: '价格',
          key: ''
        },
        {
          title: '操作',
          key: ''
        },
      ],
      tableData: [],
      currentStep: 0,
      showBaisc: true,
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.liveBroadcastSquareInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let {
            author_name,
            share_img,
            name,
            room_id,
            start_time,
            end_time,
          } = res.data && res.data.items;
          this.formItem = Object.assign(res.data.items, {
            basicData: {
              author_name,
              share_img,
              name,
              room_id,
              start_time,
              end_time,
            }
          });
        }
      });
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'cover_img') this.$refs.formValidate.validateField('cover_img');
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
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
    confirm () {

    }
  },
  created () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.bargin-activity-select-wrapper{
  text-align: center;
}
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
