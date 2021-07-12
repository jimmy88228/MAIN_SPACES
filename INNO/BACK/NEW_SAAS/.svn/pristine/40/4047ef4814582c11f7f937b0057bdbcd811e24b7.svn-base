<template>
  <div class="product">
    <PageTopBase :isSave="true" @save="confirm">
      <Form ref="formValidate" :model="formItem"  :label-width="120">

        <FormItem label="大屏编号" prop="machine_no">
            <p>{{formItem.machine_no}}</p>
        </FormItem>

        <FormItem label="登录账号" prop="machine_account">
            <Input v-model="formItem.account" placeholder="请输入登录账号" class="basic_input" >
              <span slot="prepend">{{formItem.brand_name_en}}</span>
            </Input>
        </FormItem>

        <FormItem label="登录密码">
          <Input v-model="formItem.machine_pwd" placeholder="请输入登录密码" class="basic_input"></Input>
        </FormItem>

        <FormItem label="大屏机器号码">
            <p class="max_code">{{formItem.machine_code}}</p>
        </FormItem>

        <FormItem label="关联的店铺" prop="store_id">
            <store-select :data="formItem.get_store" type="radio" @del-tag="handleStoreTag">
              <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
            </store-select>
        </FormItem>

        <FormItem label="是否激活">
          <p class="max_code" v-if="formItem.is_activation==1">激活</p>
          <p class="max_code" v-else >未激活</p>
        </FormItem>

        <FormItem label="激活时间" v-show="formItem.isShow">
          <p class="max_code">{{formItem.activate_time}}</p>
        </FormItem>

        <FormItem label="有效期">
          <p class="max_code">{{formItem.expire_time}}</p>
        </FormItem>

      </Form>
    </PageTopBase>

  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    PageTopBase,
    ImageEdit,
    StoreSelect,

  },
  data () {
    return {
      formItem: {
        machine_no: '',
        machine_account: '',
        machine_pwd:'',
        machine_code: '',
        activate_time:'',
        expire_time:'',
        account:'',
        is_activation:'',
        get_store:[],
        machine_id:0,
        isShow:true,
        store_id:0,
        brand_name_en:'',
      },

      ruleValidate: {

      }
    }
  },
  methods: {

    loadData() {
      return this.$ajax.post(this.$api.devicesInfo, {
        machine_id:this.$route.params.id,
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.formItem=res.data;
          this.formItem.machine_pwd='';
          if(this.formItem.is_activation ==1){
            this.formItem.isShow=true;
          }else{
            this.formItem.isShow=false;
          }
          this.formItem.store_id=res.data.get_store.id;
          this.formItem.get_store=[res.data.get_store];
        }
      })
    },

    openCardModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.formItem.applet_qr_code = item.src;
        }
      });
    },

    handleStoreTag (data) {
      this.formItem.get_store = data;
    },

    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.formItem.get_store,
        getList: (data) => {
          this.formItem.get_store = data;
          this.formItem.store_id = data[0].id;
        }
      })
    },

    confirm () {
      let params=this.formItem;
      params.machine_account=params.brand_name_en+params.account;
      this.$ajax.post(this.$api.devicesEdit,params).then(response => {
        const res =response.data;
        if (res.code) {
            this.$Message.success('保存成功');
            this.$router.push({
                name: 'device-list'
            })
        }else{
          // this.$Message.error(res.message);
        }
        });
    },
  },
  mounted () {
       this.loadData();
  }
}
</script>

<style lang="less" scoped>
.product{

}
.max_code{
  font-size:12px;
}
.basic_input{
  max-width:250px;
}
</style>
