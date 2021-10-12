<template>
  <PageTopBase isSave @save="confirm">
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="派发备注" prop="remark">
        <Input v-model="formItem.remark" placeholder="请输入派发备注" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="派发优惠券" prop="bouns_data">
        <Table :columns="tableColumns" :data="formItem.bouns_data" ref="myTable">
          <template slot-scope="{ row, index }" slot="total_qty">
            <InputNumber :min="0" v-model="row.total_qty" @on-change="e => handleChange(e, index)"></InputNumber>
          </template>
        </Table>
      </FormItem>
      <FormItem label="派券有效期" prop="validTimeRange">
        <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDateChange"></DatePicker>
      </FormItem>
      <FormItem label="派发对象" prop="staffData">
        <DistributionStaffSelect :data="formItem.staffData" type="checkbox" @del-tag="handleTagClose">
          <Button type="dashed" @click="handleUserSelected" class="basic_select">选择分销员</Button>
        </DistributionStaffSelect>
        <Button type="dashed" @click="handleImport">导入分销员</Button>
      </FormItem>
    </Form>
    <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import GroupSelect from '@/views/my-components/list-component/index-edit';
import StaffSelect from '@/views/my-components/list-component/index-edit';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import DistributionStaffSelect from '@/views/my-components/list-component/index-edit';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    EditSort,
    GroupSelect,
    StaffSelect,
    ImageEdit,
    DistributionStaffSelect,
    BatchImport
  },
  data () {
    return {
      formItem: {
        remark: '',
        bouns_data: [],
        from_date: '',
        to_date: '',
        staffData: []
      },
      ruleValidate: {
        remark: [{required: true, message: '派发备注不能为空', trigger: 'blur'}],
      },
      sortVaild: false,
      tableColumns: [
        {
          title: '优惠券名称',
          key: 'name'
        },
        {
          title: '派发数量',
          key: 'total_qty',
          slot: 'total_qty'
        }
      ]
    }
  },
  methods: {
    handleUserSelected () {
      this.$selectContent({
        mode: 'distributionStaff',
        type: 'checkbox',
        data: this.formItem.staffData,
        getList: (data) => {
          this.formItem.staffData = data;
        }
      });
    },
    handleTagClose (data) {
      this.formItem.staffData = data;
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.CloudDistributionCouponsActivitySendInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data;
          let items;
          if (items = data.items) {
            this.formItem.bouns_data = items.bouns_data.map(item => {
              item.coupon_id = item.id;
              item.total_qty = 0;
              return item;
            })
          }
        }
        this.spinShow = false;
      });
    },
    handleDateChange ([from_date, to_date]) {
      this.formItem.from_date = from_date;
      this.formItem.to_date = to_date;
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleChange (val, index) {
      this.formItem.bouns_data[index].total_qty = val;
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
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleImport () {
      this.$refs.batchImport.openModal({
        upload: true,
        download: true
      }, this.$api.CloudDistributionCouponsActivityImport, this.$api.CloudDistributionCouponsActivityDown);
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post(this.$api.cloudDistributionCouponsActivitySend, {
            act_id: this.id,
            ...this.formItem,
            task_user_id: this.formItem.staffData.map(item => item.user_id).join()
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
    },
    onImportSuccess (data) {
      let ids = this.formItem.staffData.map(item => item.user_id);
      data.items.forEach(item => {
        if (!ids.includes(item.user_id)) {
          this.formItem.staffData.push(item);
        }
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.time_range{
  width: 340px
}
</style>
