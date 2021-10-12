<template>
  <div>
    <PageTopBase isSave @save="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="类型" prop="limited_type">
          <RadioGroup v-model="formItem.c_type">
            <Radio label="1">单人</Radio>
            <Radio label="2">多人</Radio>
          </RadioGroup>
        </FormItem>
        <!-- <FormItem  prop="bounsData" >
            <coupon-select :data="formItem.bounsData" type="checkbox" @del-tag="handleCouponClose">
              <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择使用人员</Button>
            </coupon-select>
          </FormItem> -->
          <FormItem label="使用人员" prop="workerSelected">
						<Tag closable v-for="(item,index) in formItem.workerSelected" :key="index" size="large" @on-close="workerClose(index)">{{item.id}}</Tag>
						<Button icon="md-add" type="dashed" @click="onSelectWorker">选择使用人员</Button>
            <Tooltip content="一次最多100人，当选择多人时只会生成一张二维码，客户扫此二维码，会随机选择一名人员给筛选。" max-width="500px" white-space="normal"  trigger='hover' size='small'
	                 placement="top-end">
              <Icon type="ios-help-circle-outline" />
          </Tooltip>
					</FormItem>
        <FormItem label="添加设置" prop="auto_pass">
          <i-switch v-model="formItem.auto_pass" size="large" true-value="1" false-value="0">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
          <br>
          <span>
             开启客户添加时无需经过确认自动成为好友
          </span>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formItem.remark" maxlength="150" show-word-limit type="textarea" placeholder="给二维码备注，便于后续管理查找" class="basic_input" style="width: 300px"></Input>
        </FormItem>

        <!--选择工作人员-->
		<qwWorkerSelect ref="qw-worker-select" :canSelectAll="true" @on-ok="onSelectOk"></qwWorkerSelect>
        
       
      </Form>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
// import CouponSelect from '@/views/my-components/list-component/index-edit';
import qwWorkerSelect from '@/views/my-components/qw-worker-select/qw-worker-select';


export default {
  props: ['id'],
  components: {
    PageTopBase,
    EditSort,
    qwWorkerSelect
  },
  data () {
    return {
      formItem: {
        c_type: '1',
        auto_pass: '0',
        workerSelected: [],
        remark:''
      },
      selectCoupon: [],
      ruleValidate: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        // dateRange: [{required: true, trigger: 'change', type: 'array', validator: this.checkValidRange}],
        workerSelected: [{required: true, message: '人员不能为空', trigger: 'change', type: 'array', min: 1}]
      },
      spinShow: false,
      sortVaild: false,
      id:0
    }
  },
  methods: {
    checkValidRange (rule, value, callback) {
      if (!value[0] && !value[1]) {
        callback(new Error('时间范围不能为空'));
      } else {
        callback();
      }
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleChange (val) {
      this.formItem.dateRange = val;
    },
    // 清除选中的客服人员
			workerClose(index) {
				this.$delete(this.formItem.workerSelected, index);
			},
			// 打开客服选择器
			onSelectWorker() {
        console.log(this.formItem.c_type)
				this.$refs['qw-worker-select'].openModal(this.formItem.workerSelected, 'checkbox', this.formItem.c_type);
			},
			// 选客服的组件的 回调
			onSelectOk(items) {
        console.log(items)
				if (items.length > 0) {
					this.$set(this.formItem, 'workerSelected', items);
				}
        console.log(this.formItem)
			},
    // handleCouponSelected () {
    //   this.$selectContent({
    //     mode: 'coupon',
    //     type: 'checkbox',
    //     data: this.formItem.bounsData,
    //     getList: (data) => {
    //       this.formItem.bounsData = data;
    //       this.$refs.formValidate.validateField('bounsData');
    //     }
    //   });
    // },
    // handleCouponClose (data) {
    //   this.formItem.bounsData = data;
    //   this.$refs.formValidate.validateField('bounsData');
    // },
    // handleNumber (val, index, key) {
    //   this.selectCoupon[index][key] = val;
    // },
    // handleDel (row) {
    //   const selectIndex = this.selectCoupon.findIndex(item => item.type_id === row.type_id);
    //   const selectCouponIndex = this.formItem.couponData.findIndex(item => item.type_id === row.type_id);
    //   this.selectCoupon.splice(selectIndex, 1);
    //   this.formItem.couponData.splice(selectCouponIndex, 1);
    // },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {

          // ajax 保存数据，头像是通过字符串的形式上传的
          this.spinShow = true;
          this.$ajax.post((this.$api.qwContactSave), {
              id: this.id,
              c_type: this.formItem.c_type,
              auto_pass: this.formItem.auto_pass,
              remark: this.formItem.remark,
              worker_ids: this.formItem.workerSelected.map(item => item.id)
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
                // 保存成功
                this.$Message.success(res.message);
                this.$router.go(-1);
              }
              this.spinShow = false;
		    		});
        }
      });
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.qwContactInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data;
          if (data = res.data) {
            this.formItem = {
              c_type: data.c_type,
              auto_pass: data.auto_pass,
              remark: data.remark,
              // dateRange: [data.stime, data.etime],
              workerSelected: data.worker_data
            };
            // this.selectCoupon = data.get_goods_receive_bonus_detail.map(item => {
            //   return {
            //     type_id: Number(item.bonus_type_id),
            //     type_name: item.bouns_list.name,
            //     sort: Number(item.sort),
            //     coupon_number: Number(item.limit_number),
            //     limit_number: Number(item.limit_number_pre_person),
            //   }
            // });
            // Object.defineProperty(this, 'originData', {
            //   value: JSON.parse(JSON.stringify(this.selectCoupon))
            // });
          }
        }
        this.spinShow = false;
      });
    },
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>
