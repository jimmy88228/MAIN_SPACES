<template>
  <PageTopBase isSave @save="confirm">
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="活动名称" prop="act_name">
        <Input v-model="formItem.act_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="活动排序">
        <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
      </FormItem>
      <FormItem label="是否开启">
        <i-switch v-model="formItem.is_enabled" size="large" true-value="1" false-value="0">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="绑定优惠券" prop="coupons">
        <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
        <Table :columns="tableColumns" :data="formItem.coupons" ref="myTable">
          <template slot-scope="{ row, index }" slot="sort">
            <InputNumber :min="0" :max="9999" v-model="row.sort" @on-change="e => handleChange(e, index)"></InputNumber>
          </template>
          <template slot-scope="{ row, index }" slot="handle">
            <span @click="delItem(index)"><a>删除</a></span>
          </template>
        </Table>
      </FormItem>
      <FormItem label="绑定群ID" prop="coupons">
        <group-select :data="formItem.groupData" type="checkbox" @del-tag="handleGroupClose">
          <Button type="dashed" @click="handleGroupSelected" class="basic_select">选择微信群</Button>
        </group-select>
        <p class="strong_tips">用户需在指定微信群方可领取优惠券</p>
      </FormItem>
      <FormItem label="领券页展示图" prop="act_image">
        <image-edit :img="formItem.act_image" @selectImg="openImagesModal('act_image', formItem.act_image )" @delImg="handleDelImg('act_image')">
          <p class="strong_tips">图片尺寸最佳是750*616，格式为 jpg 或 png，图片大小控制在200KB</p>
        </image-edit>
      </FormItem>
      <FormItem label="领券自定义页" prop="pageData">
        <group-select :data="formItem.pageData" type="checkbox" @del-tag="handlePageClose">
          <Button type="dashed" @click="handlePageSelected" class="basic_select">选择自定义页</Button>
        </group-select>
      </FormItem>
      <FormItem label="微信分享标题" prop="shared_title">
        <Input v-model="formItem.shared_title" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="微信分享图片" prop="shared_image">
        <image-edit :img="formItem.shared_image" @selectImg="openImagesModal('shared_image', formItem.shared_image )" @delImg="handleDelImg('shared_image')">
          <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
        </image-edit>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import GroupSelect from '@/views/my-components/list-component/index-edit';
import PageSelect from '@/views/my-components/list-component/index-edit';
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    EditSort,
    GroupSelect,
    PageSelect,
    ImageEdit
  },
  data () {
    return {
      formItem: {
        id: 0,
        act_name: '',
        sort: 0,
        is_enabled: '0',
        coupons: [],
        groupData: [],
        act_image: '',
        pageData: [],
        shared_title: '',
        shared_image: ''
      },
      ruleValidate: {
        act_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
      },
      sortVaild: false,
      tableColumns: [
        {
          title: '优惠券名称',
          key: 'name'
        },
        {
          title: '排序',
          key: 'sort',
          slot: 'sort'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.distributionCouponsActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data;
          let items;
          if (items = data.items) {
            this.formItem = Object.assign({}, items, {
              coupons: items.bouns_data.map(item => {
                item.sort = +item.sort;
                return item;
              }),
              sort: +items.sort,
              groupData: items.ChannelLimit_data,
              pageData: [items.page_data],
            });
          }
        }
        this.spinShow = false;
      });
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.coupons,
        getList: (data) => {
          let cloneData = JSON.parse(JSON.stringify(data));
          let ids = this.formItem.coupons.map(item => item.id);
          let result = cloneData.filter(item => !ids.includes(item.id));
          result.forEach(item => {
            item.sort = 0;
            this.formItem.coupons.push(item);
          });
        }
      })
    },
    handleChange (val, index) {
      this.formItem.coupons[index].sort = val;
    },
    delItem (index) {
      this.formItem.coupons.splice(index, 1);
    },
    handleGroupSelected () {
      this.$selectContent({
        mode: 'group',
        type: 'checkbox',
        data: this.formItem.groupData,
        getList: (data) => {
          this.formItem.groupData = data;
        }
      })
    },
    handleGroupClose (data) {
      this.formItem.groupData = data;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
        }
      });
    },
    handlePageSelected () {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data: this.formItem.pageData,
        getList: (data) => {
          this.formItem.pageData = data;
        }
      })
    },
    handlePageClose (data) {
      this.formItem.pageData = data;
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.distributionCouponsActivityAdd : this.$api.distributionCouponsActivityEdit), {
            ...this.formItem,
            bouns_data: this.formItem.coupons.map(item => ({
              coupon_id: item.id,
              sort: item.sort
            })),
            channelLimit_ids: this.formItem.groupData.map(item => item.id).join(),
            page_id: this.formItem.pageData.map(item => item.id).join()
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
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
    if (this.id) this.loadData();
  }
}
</script>

<style>

</style>
