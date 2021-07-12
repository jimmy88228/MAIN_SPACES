<template>
    <Modal
      class="user-edit-form"
      v-model="modalShow"
      :title="modalTitle"
      :width="modalWidth"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="handleConfirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="90" inline label-colon>
        <FormItem label="生日" prop="birthday">
          <DatePicker type="date" placeholder="请选择生日" class="basic_picker" v-model="formItem.birthday" :disabled="!handle.edit_birthday"></DatePicker>
        </FormItem>
        <FormItem label="所属店铺" prop="from_store">
          <store-select :data="storeData" type="radio" @del-tag="handleStoreClose">
            <Button type="dashed" @click="handleStoreSelected" class="basic_select">选择所属店铺</Button>
          </store-select>
        </FormItem>
        <FormItem label="所属店员">
          <staff-select :data="staffData" type="radio" @del-tag="handleStaffClose">
            <Button type="dashed" @click="handleStaffSelected" class="basic_select">选择所属店员</Button>
          </staff-select>
        </FormItem>
      </Form>
    </Modal>
</template>

<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';
import StaffSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: {
    userData: {
      type: Object,
      required: true
    },
    handle: {
      type: Object,
      required: true
    }
  },
  components: {
    StoreSelect,
    StaffSelect
  },
  data () {
    return {
      modalShow: false,
      modalWidth: 400,
      modalTitle: '客户资料',
      modalLoading: true,
      ruleValidate: {
        birthday: [{ required: true, message: '生日不能为空', trigger: 'change', type: 'date' }],
        from_store: [{ required: true, message: '所属店铺不能为空', type: 'number', trigger: 'change', validator (rule, value, callback) {
          if (value > 0) {
            callback()
          } else {
            callback(new Error('所属店铺不能为空'));
          }
        }}]
      },
      formItem: {
        birthday: '',
        from_store: 0,
        from_staff_id: 0
      },
      staffList: [],
      storeData: [],
      staffData: []
    }
  },
  methods: {
    openModal () {
      this.modalShow = true;
    },
    handleConfirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.editBirthday().then(() => {
            this.editStore().then(response => {
              const res = response.data;
              if (res.code) {
                this.modalShow = false;
                this.modalLoading = false;

                this.$Message.success('编辑成功');
                this.$emit('load-data');
                setTimeout(() => {
                  this.modalLoading = true;
                }, 50);
              } else {
                this.modalShow = true;
                this.modalLoading = false;

                setTimeout(() => {
                  this.modalLoading = true;
                }, 50);
                this.$Message.error(res.message);
              }
            });
          })
        } else {
          this.modalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
            this.modalLoading = true;
          }, 50);
        }
      })
    },
    editBirthday () {
      return this.$ajax.post(this.$api.userEditOther, {
        user_id: this.userData.user_id,
        change_type: 1, // 修改会员生日
        birthday: this.formItem.birthday
      }).then(response => {
    			const res = response.data;
    			if (!res.code) {
          this.$Message.error(res.message);
        }
      });
    },
    editStore () {
      return this.$ajax.post(this.$api.userEditOther, {
        user_id: this.userData.user_id,
        change_type: 2, // 修改会员所属店铺与店员
        store_id: this.formItem.from_store,
        staff_id: this.formItem.from_staff_id
      });
    },
    handleStoreSelected (selected) {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.formItem.from_store = data[0].id;
          this.$refs.formValidate.validateField('from_store');
        }
      });
    },
    handleStoreClose (data) {
      this.storeData = data;
      this.formItem.from_store = 0;
      this.$refs.formValidate.validateField('from_store');
    },
    handleStaffSelected (selected) {
      this.$selectContent({
        mode: 'staff',
        type: 'radio',
        data: this.staffData,
        getList: (data) => {
          this.staffData = data;
          this.formItem.from_staff_id = data[0].id;
        }
      });
    },
    handleStaffClose (data) {
      this.staffData = data;
      this.formItem.from_staff_id = 0;
    }
  },
  watch: {
    userData (newData) {
      this.formItem = {
        birthday: newData.birthday,
        from_store: Number(newData.from_store_message.id),
        from_staff_id: newData.from_staff_message.staff_id
      };
      this.storeData = newData.from_store_message.id ? [newData.from_store_message] : [];
      this.staffData = newData.from_staff_message.staff_id ? [{
        id: newData.from_staff_message.staff_id,
        name: newData.from_staff_message.staff_name,
        code: newData.from_staff_message.staff_code
      }] : [];
    }
  }
}
</script>

<style lang="less">
.user-edit-form{
  .ivu-form{
    text-align: left;
    .basic_picker, .basic_select{
      width: 200px;
    }
  }
}
</style>
