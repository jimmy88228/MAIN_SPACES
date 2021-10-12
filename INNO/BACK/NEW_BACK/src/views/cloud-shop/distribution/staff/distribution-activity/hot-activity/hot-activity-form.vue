<template>
  <PageTopBase class="hot-goods-form" isSave @save="confirm">
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="活动名称" prop="activity_title">
        <Input v-model="formItem.activity_title" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="活动描述" prop="activity_description">
        <Input
          type="textarea"
          class="basic_textarea basic_textarea"
          v-model="formItem.activity_description"
          placeholder="请输入活动描述"
          :rows="3"
          :maxlength="150"
          show-word-limit/>
      </FormItem>
      <FormItem label="活动状态" prop="is_enabled">
        <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="活动时间" prop="validTimeRange">
        <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
      </FormItem>
      <FormItem label="跳转类型" prop="related_type">
        <Select v-model="formItem.related_type" class="basic_select">
          <Option value="0">自定义页面</Option>
          <Option value="1">自定义跳转</Option>
        </Select>
      </FormItem>
      <FormItem label="选择页面" prop="pageData" v-show="formItem.related_type == 1">
        <page-select :data="formItem.pageData" type="radio" @del-tag="handlePageClose">
          <Button type="dashed" @click="handlePageSelected" class="basic_select">选择活动页</Button>
        </page-select>
        <p class="strong_tips"> 选择的页面不能为首页</p>
      </FormItem>
      <FormItem label="跳转地址" prop="related_url" v-show="formItem.related_type == 2">
        <Input v-model="formItem.related_url" placeholder="请输入跳转地址" class="basic_input"/>
      </FormItem>
      <FormItem label="二维码生成" prop="gen_barcode_style">
        <Select v-model="formItem.gen_barcode_style" class="basic_select">
          <Option value="0">首张生成二维码</Option>
          <Option value="1">所有图生成二维码</Option>
          <Option value="2">不生成二维码</Option>
        </Select>
      </FormItem>
      <FormItem label="排序号">
        <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
      </FormItem>
      <FormItem label="分类">
        <Select v-model="formItem.groupData" multiple class="basic_select">
          <Option v-for="item in tags" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="活动图片" prop="detail_data_img">
        <image-edit :img="formItem.detail_data_img" @selectImg="openImagesModal('detail_data_img', formItem.detail_data_img )" @delImg="handleDelImg('detail_data_img')">
          <p class="strong_tips">图片尺寸最佳是360*180，格式为 jpg 或 png，图片大小控制在200KB</p>
        </image-edit>
      </FormItem>
      <FormItem label="微信分享图片" prop="share_image">
        <image-edit :img="formItem.share_image" @selectImg="openImagesModal('share_image', formItem.share_image )" @delImg="handleDelImg('share_image')">
          <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
        </image-edit>
      </FormItem>
      <FormItem label="微信分享标题" prop="share_title">
        <Input v-model="formItem.share_title" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
    </Form>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import GoodsSelect from '@/views/my-components/list-component/index-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import PageSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  components: {
    PageTopBase,
    GoodsSelect,
    EditSort,
    ImageEdit,
    PageSelect
  },
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    }
    return {
      formItem: {
        activity_title: '',
        activity_description: '',
        is_enabled: '0',
        validTimeRange: [],
        from_time: '',
        to_time: '',
        gen_barcode_style: 0,
        sort: 0,
        detail_data_img: '',
        share_image: '',
        share_title: '',
        related_type: '1',
        pageData: [],
        related_id: 0,
        related_url: '',
        groupData: []
      },
      ruleValidate: {
        activity_title: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        detail_data_img: [{required: true, message: '活动图片不能为空', trigger: 'change'}]
      },
      sortVaild: false,
      tags: []
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.CloudDistributionActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.spinShow = false;
          let data = res.data.items;
          this.tags = res.data.tags;
          if (!data) return;
          let r = [];
          for (let k in data.selected_tags) {
            r.push(+data.selected_tags[k].id);
          }
          this.formItem = Object.assign(data, {
            validTimeRange: data.activity_time,
            pageData: [data.page_data],
            detail_data_img: data.imgList[0].img_url,
            share_image: data.imgShare[0].img_url,
            groupData: r
          });
          console.log(this.formItem)
        }
      });
    },
    handlePageSelected  () {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data: this.formItem.pageData,
        getList: (data) => {
          this.formItem.pageData = data;
          this.formItem.related_id = data[0].id;
        }
      })
    },
    handlePageClose (data) {
      this.formItem.pageData = data;
      this.formItem.related_id = 0;
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleTime (date) {
      this.formItem.validTimeRange = date;
      this.formItem.from_time = date[0];
      this.formItem.to_time = date[1];
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'detail_data_img') this.$refs.formValidate.validateField('detail_data_img');
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    confirm() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.spinShow = true;
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.id === 0 ? this.$api.CloudDistributionActivityAdd : this.$api.CloudDistributionActivityEdit), {
            ...this.formItem,
            id: this.id,
            detail_data: [this.formItem.detail_data_img],
            group: this.formItem.groupData.join()
          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
                this.spinShow = false;
                this.$router.go(-1);
	              } else {
		    				this.showLoading();
		    			}
		    		});
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.hot-goods-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
