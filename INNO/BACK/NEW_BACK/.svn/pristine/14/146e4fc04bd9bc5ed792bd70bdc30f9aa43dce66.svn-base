<template>
  <div>
    <Modal
      class="weixin-group"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="80">
          <FormItem label="群ID" prop="group_id">
            {{formItem.group_id}}
          </FormItem>
          <FormItem label="群名称" prop="group_name">
            <Input v-model="formItem.group_name" placeholder="请输入群名称"></Input>
          </FormItem>
          <FormItem label="群编码" prop="group_code">
            <Input v-model="formItem.group_code" placeholder="请输入群编码"></Input>
          </FormItem>
          <FormItem label="群管理员" prop="group_manager">
            <Input v-model="formItem.group_manager" placeholder="请输入群管理员"></Input>
          </FormItem>
          <FormItem label="所属店铺" prop="store_id">
            <store-select :data="storeData" type="radio" @del-tag="handleStoreClose">
              <Button type="dashed" @click="handleStoreSelected" class="basic_select">选择所属店铺</Button>
            </store-select>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  mixins: [Dialog],
  components: {
    StoreSelect
  },
  data () {
    return {
      formItem: {
        id: 0,
        group_id: 'xxxxxxxxx',
        group_name: '',
        group_code: '',
        group_manager: '',
        store_id: 0
      },
      // 表单数据规则
      ruleValidate: {
        group_name: [{ required: true, message: '群名称不能为空', trigger: 'blur' }],
        group_code: [{ required: true, message: '群编码不能为空', trigger: 'blur' }],
        group_manager: [{ required: true, message: '群管理员不能为空', trigger: 'blur' }],
        store_id: [{ required: true, message: '所属店铺不能为空', type: 'number', trigger: 'change', validator (rule, value, callback) {
          if (value > 0) {
            callback()
          } else {
            callback(new Error('所属店铺不能为空'));
          }
        }}]
      },
      storeData: []
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
       if (valid) {
         this.$ajax.post(this.$api.weiXinGroupEdit, this.formItem)
          .then((response) => {
            var res = response.data;

            if (res.code) {
              // 保存成功
              this.$Message.success(res.message);
              this.modalShow = false;

              // 把数据返回给父级
              this.$emit('on-success');
              } else {
              this.showLoading();
            }
          });
       }
      });
    },
    // 打开模态框
    setData (row) {
      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.modalTitle = '编辑微信群';
      this.formItem.id = row.id;
      this.formItem.group_id = row.group_id;
      this.formItem.group_name = row.group_name;
      this.formItem.group_code = row.group_code;
      this.formItem.group_manager = row.group_manager;
      this.formItem.store_id = row.store_id;
      this.storeData = [row.get_store];
      return this;
    },
    returnImageUrl (obj) {
      this.$set(this.formItem, obj.name, obj.val);
    },
    // 调起图片选择器
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.formItem.logo = item.src;
        }
      });
    },
    handleStoreSelected (selected) {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.formItem.store_id = data[0].id;
          this.$refs.formValidate.validateField('store_id');
        }
      });
    },
    handleStoreClose (data) {
      this.storeData = data;
      this.formItem.store_id = 0;
      this.$refs.formValidate.validateField('store_id');
    },
  }
}
</script>
