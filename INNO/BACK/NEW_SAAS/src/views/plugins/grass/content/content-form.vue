<template>
  <PageTopBase isSave @save="confirm">
    <Form ref="formValidate" :model="formItem" :label-width="140">
      <FormItem label="图片" prop="cover_path">
        <image-edit :img="formItem.cover_path" v-if="formItem.cover_path"></image-edit>
      </FormItem>
      <FormItem label="主题" prop="theme">
        {{formItem.pub_title}}
      </FormItem>
      <FormItem label="内容" prop="content">
        {{formItem.pub_content}}
      </FormItem>
      <FormItem label="分类" prop="fen">
        <Select v-model="formItem.cat_id" class="basic_select" multiple>
          <Option v-for="(item) in catList" :value="item.id" :key="item.id">{{ item.category_name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="标签" prop="tag">
        <Select v-model="formItem.label_id" class="basic_select" multiple>
          <Option v-for="(item) in labelList" :value="item.id" :key="item.id">{{ item.label_name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="关联商品" prop="goodsData">
        <goods-select :data="formItem.goodsData" type="checkbox" @del-tag="handleTag">
          <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        </goods-select>
      </FormItem>
      <FormItem label="发布人" prop="rebuild">
        {{formItem.real_name}}
      </FormItem>
      <FormItem label="发布时间" prop="rebuild">
        {{formItem.create_time}}
      </FormItem>
      <FormItem label="审核时间" prop="rebuild">
        {{formItem.lastmodify}}
      </FormItem>
      <FormItem label="审核状态" prop="rebuild">
        {{formItem.status_str}}
      </FormItem>
    </Form>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import GoodsSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit,
    GoodsSelect
  },
  data () {
    return {
      formItem: {
        cat_id: [],
        label_id: [],
        goodsData: [],
        cover_path: "",
        create_time: "",
        lastmodify: "",
        pub_content: "",
        pub_title: "",
        real_name: "",
        status_str: "",
      },
      catList: [],
      labelList: []
    }
  },
  methods: {
    getCatList () {
      return this.$ajax.post(this.$api.communityGetCatList)
    },
    lableList () {
      return this.$ajax.post(this.$api.communityGetLableList)
    },
    loadExtra () {
      return this.$ajax.all([this.getCatList(), this.lableList()])
      .then(this.$ajax.spread((catresponse, labelresponse) => {
        const catres = catresponse.data;
        const labelres = labelresponse.data;
        this.catList = catres.data.items;
        this.labelList = labelres.data.items;
        console.log(this.catList, this.labelList)
      }));
    },
    handleSelect () {
      this.$selectContent({
        mode: 'goods',
        type: 'checkbox',
        data: this.formItem.goodsData,
        getList: (data) => {
          this.formItem.goodsData = data;
        }
      })
    },
    handleTag (data) {
      this.formItem.goodsData = data;
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.communityContentInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          this.formItem = {
            ...data,
            cat_id: data.cat_name,
            label_id: data.label_name,
            goodsData: data.goods_data
          };
          this.spinShow = false;
        }
      });
    },
    confirm() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.spinShow = true;
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post(this.$api.communityContentEdit, {
            ...this.formItem,
            cat_ids: this.formItem.cat_id.join(),
            label_ids: this.formItem.label_id.join(),
            goods_ids: this.formItem.goodsData.map(item => item.id).join()
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
  created () {
    this.loadData()
    this.loadExtra();
  }
}
</script>

<style>

</style>
