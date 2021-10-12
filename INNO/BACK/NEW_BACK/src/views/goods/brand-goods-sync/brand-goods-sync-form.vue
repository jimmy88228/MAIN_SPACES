<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
          <Step title="选择写入商品的分类" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
          <Step title="完善同步商品的信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="time-limit-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
          <FormItem label="任务名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="目标分类" prop="cat_id">
						<Cascader class="basic_cascader" :data="sortCatList" v-model="currentSort" placeholder="请选择目标分类" filterable
						 change-on-select transfer :clearable="isClear" ref="catRef" :render-format="renderSort" @on-change="selectSortCat"></Cascader>
             <span style="color:red">*如果商品在商品库中已经存在，系统将不会进行覆盖！</span>
					</FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="group-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        <!-- <p class="strong_tips">一个活动最多只能添加十款商品</p> -->
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

const defaultItem = {
		value: '0',
		label: '顶级分类',
		children: []
	};

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
    const checkPeriod = (rule,value,callback) => {console.log(value)
        if(this.formItem.cat_id == ''){
            callback( new Error('请选择目标分类'));
        }else{
            callback();
        }
    };
    return {
      formItem: {
        name: '',
        goodsSelect: [],
        cat_id: '',
        good_ids: []
      },
      ruleValidate: {
        name: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
        cat_id: [{required: true, validator:checkPeriod, trigger: 'change'}]
      },
      sortVaild: false,
      spinShow: false,
      currentStep: 0,
      showBaisc: true,
      isValidTable: false,
      freezeData: [],
      sortCatList: [],
			sortVcatList: [],
      currentSort: [],
			currentVcatSort: [],
      isClear: false,
    }
  },
  methods: {
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
        mode: 'brand-goods',
        type: 'checkbox',
        listKey: 'goods_id',
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
          this.formItem.goodsSelect = [...hasItem, ...newItem];
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
      // this.$emit('validate-table');
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          // selections.forEach(item=>{
          //       this.selectedBonus[item.type_id] = {type_id:item.type_id,type_name:item.type_name,create_number:item.create_number,stock:item.stock,send_type:item.send_type};
          //   })
          this.formItem.goodsSelect.forEach(item => {
              this.formItem.good_ids.push(item.goods_id);
          });
          return this.$ajax.post(this.$api.brandGoodsSyncAddTask, {
            name: this.formItem.name,
            cat_id: this.formItem.cat_id,
            good_ids: this.formItem.good_ids
            // goods_data: this.formItem.goodsSelect.filter(item => {
            //   // item.is_enabled = item.isEnable;
            //   // item.is_mainpush = item.isMain;
            //   // item.sort = item.sort;
            //   return true;
            // }),
            // goods_data_status: JSON.stringify(this.freezeData) !== JSON.stringify(this.formItem.goodsSelect) ? 2 : 0
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
    },
    loadExtraData() {
				this.$ajax.all(
					[
						this.$ajax.post(this.$api.catTree),
						this.$ajax.post(this.$api.vcatTree)
					]
				).then(
					this.$ajax.spread((catData, vcatData) => {
						let catRes = catData.data;
						if (catRes.code) {
              this.sortCatList = this.handleSortList(catRes.data);
					    this.sortCatList.unshift(defaultItem);
						}
						let vcatRes = vcatData.data;
						if (vcatRes.code) {
              this.sortVcatList = this.handleSortList(vcatRes.data);
					    this.sortVcatList.unshift(defaultItem);
						}
					})
				);
			},
      selectSortCat(value, selectedData) {
				this.formItem.cat_id = selectedData[selectedData.length - 1].value;
			},
      selectSortVcat(value, selectedData) {
        this.formItem.vcat_id = selectedData[selectedData.length - 1].value;
      },
      renderSort(labels) {
          return labels.slice(labels.length - 1).join('/');
      },
      handleSortList(context) {
        const format = context.map(item => {
          return {
            value: item.cat_id || item.vcat_id,
            label: item.cat_name || item.vcat_name,
            parent_id: item.parent_id,
            children: item.children.length ? this.handleSortList(item.children) : []
          }
        });
        return format;
      },
  },
  mounted () {
    if (this.id) this.loadData().then(() => {
      this.loadProductData();
    });
    this.loadExtraData();
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
