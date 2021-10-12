<script src="../../../my-components/list-component/template/config.js"></script>
<template>
  <div class="coupon_extend_info">
    <Form ref="formValidate" :model="formItem" :rules="ruleExtendValidate" :label-width="140" v-friendly-errors>
      <FormItem label="积分叠加使用" prop="isAllowPoint">
        <RadioGroup v-model="formItem.isAllowPoint">
          <Radio label="1" :disabled="isDisabledPointAndCardAndGive">是</Radio>
          <Radio label="0" :disabled="isDisabledPointAndCardAndGive">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="储值卡叠加使用" prop="isAllowPrepaidcard">
        <RadioGroup v-model="formItem.isAllowPrepaidcard">
          <Radio label="1" :disabled="isDisabledPointAndCardAndGive">是</Radio>
          <Radio label="0" :disabled="isDisabledPointAndCardAndGive">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="允许转赠" prop="giveType">
        <RadioGroup v-model="formItem.giveType">
          <Radio label="1" :disabled="isDisabledPointAndCardAndGive">是</Radio>
          <Radio label="0" :disabled="isDisabledPointAndCardAndGive">否</Radio>
        </RadioGroup>
        <p class="strong_tips">可赠送其他会员</p>
      </FormItem>
      <FormItem label="优惠券分享图片" prop="shareImage">
        <div :class="formItem.giveType == 0 ? 'share_disabled' : ''"></div>
        <image-edit :img="formItem.shareImage" @selectImg="openImagesModal('shareImage', formItem.shareImage )" @delImg="handleDelImg('shareImage')">
          <p class="strong_tips">图片尺寸最佳是500*500，格式为 jpg 或 png，图片大小控制在200KB</p>
        </image-edit>
      </FormItem>
      <FormItem label="优惠券分享标题" prop="shareTitle">
        <Input v-model="formItem.shareTitle" placeholder="请输入优惠券分享标题" class="basic_input basic_input_fixed" :disabled="formItem.giveType == 0" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="优惠券分享说明" prop="shareDesc">
        <Input
          type="textarea"
          class="basic_textarea basic_textarea"
          v-model="formItem.shareDesc"
          placeholder="请输入优惠券分享说明"
          :rows="3"
          :disabled="formItem.giveType == 0"
          :maxlength="150"
          show-word-limit/>
        <p class="strong_tips">可作为微信分享的标题</p>
      </FormItem>
      <FormItem label="启用自核销" prop="isWriteoffSelf" v-show="formShowList.isWriteoffSelf">
        <RadioGroup v-model="formItem.isWriteoffSelf">
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="领券次数限制" prop="receiveTime">
        <Input
            v-model="formItem.receiveTime"
            class="coupon_input"
            type="number"
            placeholder="请输入领券次数限制"
            number>
            <Select v-model="formItem.receiveTimeType" slot="prepend" class="coupon_input_select">
              <Option value="1">每人总共可领</Option>
              <Option value="2">每人每天可领</Option>
            </Select>
        </Input>
        <p class="strong_tips">这里的次数限制仅对扫码直接领取优惠券和领取分享的优惠券有效</p>
      </FormItem>

      <FormItem label="券类型" prop="platformTypeId">
        <Select v-model="formItem.platformTypeId" class="basic_select">
          <Option :value="0">无</Option>
          <Option v-for="item in this.bonusPlatformType" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="绑定群ID" prop="wxgroupSelect">
        <wechat-select :data="formItem.wxgroupSelect" type="checkbox" @del-tag="handleTag">
          <Button type="dashed" @click="handleSelect('group', 'wxgroupSelect')" class="basic_select">选择微信群</Button>
        </wechat-select>
        <p class="strong_tips">广告位一点领券限制领取渠道</p>
      </FormItem>

      <!--绑定企微群ID-->
      <FormItem label="绑定企微群ID" prop="settingValue">
        <RadioGroup v-model="formItem.settingValue" vertical>
          <Radio label="1" class="basic_radio">
            <span>全部群生效</span>
            <span class="strong_tips">会员存在企业微信群内都将允许领券</span>
          </Radio>
          <Radio label="2" class="basic_radio">
            <span>指定群生效</span>
          </Radio>
          <Radio label="3">
            <span>不限制</span>
            <span class="strong_tips">不限制会员领券渠道</span>
          </Radio>
        </RadioGroup>
      </FormItem>

      <!--企微等于2时-->
      <FormItem label="" prop="qwgroupSelect" v-if="formItem.settingValue == 2">
        <wechat-select :data="formItem.qwgroupSelect" type="checkbox" @del-tag="handleQwgroupSelect">
          <Button type="dashed" @click="handleSelect('groupWork', 'qwgroupSelect')" class="basic_select">选择指定群生效</Button>
        </wechat-select>
        <p class="strong_tips">指定群生效</p>
      </FormItem>
      <!--end 绑定企微群ID-->


      <FormItem label="打标签" prop="tagId">
        <wechat-select :data="formItem.tagId" type="checkbox" @del-tag="handleAllTag">
          <Button type="dashed" @click="handleSelect('tag', 'tagId')" class="basic_select">选择标签</Button>
        </wechat-select>
        <p class="strong_tips">此标签仅针对扫码领券的会员（需配合智慧营销使用）</p>
      </FormItem>
      <FormItem label="商品限制" prop="limitedType" v-if="formShowList.limitTypeList">
        <RadioGroup v-model="formItem.limitedType" vertical>
          <Radio :label="item.value" v-for="item in formShowList.limitTypeList" :key="item.value" class="limit_type" >
            <span>{{item.name}}</span>
          </Radio>
        </RadioGroup>
        <div class="cascader_wrapper" :style="currentStyle">
          <Button type="primary" class="btn" v-if="showCat" @click="handleShowCat" :disabled="formItem.limitedType != 1">标准分类</Button>
          <Button type="primary" class="btn" v-if="showVcat" @click="handleShowVcat" :disabled="formItem.limitedType != 2">自定义分类</Button>
        <brand-select :data="formItem.goodsBrandIds" type="checkbox" class="brand_select" @del-tag="handleBrandTag" v-if="showBrand">
          <Button type="dashed" @click="handleSelect('brand', 'goodsBrandIds')" class="basic_select" :disabled="formItem.limitedType != 3 || isEditStaus">选择品牌</Button>
        </brand-select>
        <Input
          v-if="showBinding"
          type="textarea"
          class="basic_textarea basic_textarea_fixed"
          v-model="formItem.bindingGoods"
          :rows="3"
           :disabled="formItem.limitedType != 4 "/>
           <FormItem  v-if="formItem.limitedType == 4">
							<Button  type="info" @click="handleImportGoodsSn('binding_goods')">导入绑定商品</Button>
		  	</FormItem>
        </div>
      </FormItem>
      <!-- 编辑状态并且是扫码支付优惠券的直接隐藏 -->
      <FormItem label="排除商品" prop="excludeGoods" v-if="!(formItem.sendType == 3)">
        <Input
          type="textarea"
          class="basic_textarea basic_textarea_fixed"
          v-model="formItem.excludeGoods"
          :rows="3"
          :disabled="formItem.limitedType == 4"/>
        <p class="strong_tips">填写商品货号，多条码用英文逗号分隔</p>
      </FormItem>
      <FormItem  v-if="!(formItem.sendType == 3) && (formItem.limitedType != 4)">
							<Button  type="info" @click="handleImportGoodsSn('exclude_goods')">导入排除商品</Button>
			</FormItem>
      <FormItem label="预生成优惠券数量" prop="createNum" :rules="createNumRule" v-if="formShowList.createNum">
        <Input
          v-model="formItem.createNum"
          class="coupon_number"
          type="number"
          number
          :disabled="isEditStaus"></Input>
      </FormItem>
      <FormItem label="优惠券编码" prop="typeCode" :rules="typeCodeRule" v-if="formShowList.createNum">
        <Input
          v-model="formItem.typeCode"
          class="coupon_code"
          type="text"
          :disabled="isEditStaus"></Input>
        <p class="strong_tips">4至8位字母数字组合，不与其他券重复</p>
      </FormItem>
      <FormItem label="优惠券绑定会员" prop="isBindingErpUser" v-if="formShowList.isBindingErpUser">
        <RadioGroup v-model="formItem.isBindingErpUser">
          <Radio label="1" :disabled="isEditStaus">是</Radio>
          <Radio label="0" :disabled="isEditStaus">否</Radio>
        </RadioGroup>
        <p class="strong_tips">POS判断券/人一致才可核销</p>
      </FormItem>
      <FormItem label="库存提醒" prop="lowStockNotice" v-if="formShowList.lowStockNotice">
        <RadioGroup v-model="formItem.lowStockNotice">
          <Radio label="1" :disabled="isEditStaus">是</Radio>
          <Radio label="0" :disabled="isEditStaus">否</Radio>
        </RadioGroup>
        <p class="strong_tips">当优惠券可用数量低于设定数值时，则推送模板消息提醒；</p>
      </FormItem>
      <FormItem label="绑定店铺" prop="storeSelect" v-if="formShowList.storeSelect" :rules="storeSelectRule">
        <!-- <store-select :data="formItem.storeSelect" type="checkbox" @del-tag="handleStoreTag"> -->
          <Button type="dashed" @click="handleSelect('store', 'storeSelect')" class="basic_select">选择所属店铺</Button>
        <!-- </store-select> -->
        <a v-if="formItem.storeSelect.length > 0" @click="checkData('store', 'storeSelect')">已选择{{formItem.storeSelect.length}}个店铺</a>
        <p class="strong_tips">不选择店铺，默认通用</p>
      </FormItem>
      <FormItem label="绑定付款方式" prop="paymentId" v-if="formShowList.payment">
        <Select v-model="formItem.paymentId" class="basic_select">
          <Option :value="0">无</Option>
          <Option v-for="item in payment" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="绑定折扣券类型" prop="discountTypeId" v-if="formShowList.discountType">
        <Select v-model="formItem.discountTypeId" class="basic_select">
          <Option :value="0">无</Option>
          <Option v-for="item in discountType" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否记入收入" prop="isLogIncome" v-if="formShowList.isLogIncome">
        <RadioGroup v-model="formItem.isLogIncome">
          <Radio label="1" :disabled="isEditStaus">是</Radio>
          <Radio label="0" :disabled="isEditStaus">否</Radio>
        </RadioGroup>
        <p class="strong_tips">财务结算时判断该优惠是否记入收入</p>
      </FormItem>
      <FormItem label="优惠券样式图">
        <div class="coupon_img_wrapper">
          <div class="before">
            <span class="title">使用前</span>
            <image-edit :img="formItem.copyImageMain" @selectImg="openImagesModal('copyImageMain', formItem.copyImageMain )" @delImg="handleDelImg('copyImageMain')"/>
          </div>
          <div class="after">
            <span class="title">使用后</span>
            <image-edit :img="formItem.copyImageExpire" @selectImg="openImagesModal('copyImageExpire', formItem.copyImageExpire )" @delImg="handleDelImg('copyImageExpire')"/>
          </div>
        </div>
        <p class="strong_tips">图片尺寸最佳是600*220，格式为 jpg 或 png，图片大小控制在200KB</p>
      </FormItem>
    </Form>
    <TreeShow ref="treeCatShow" @get-data="handleCatData"></TreeShow>
    <TreeShow ref="treeVcatShow" @get-data="handleVcatData"></TreeShow>

     <!--管理员编辑表单-->
      <BatchImport ref="batchImport" @on-success="onImportSuccess" :upLoadPayLoad="upLoadPayLoad"></BatchImport>
  </div>
</template>

<script>
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import WechatSelect from '@/views/my-components/list-component/index-edit';
import StoreSelect from '@/views/my-components/list-component/index-edit';
import BrandSelect from '@/views/my-components/list-component/index-edit';
import ValidFieldMixin from './valid-field-mixin';
import TreeShow from './tree-show';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  name: 'CouponExtendInfo',
  mixins: [ValidFieldMixin],
  props: {
    formShowList: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    editData: {
      type: Object,
      required: true
    }
  },
  computed: {
    showCat() {
      return this.formShowList.limitTypeList && this.formShowList.limitTypeList.some(item => item.value == 1);
    },
    showVcat() {
      return this.formShowList.limitTypeList && this.formShowList.limitTypeList.some(item => item.value == 2);
    },
    showBrand() {
      return this.formShowList.limitTypeList && this.formShowList.limitTypeList.some(item => item.value == 3);
    },
    showBinding() {
      return this.formShowList.limitTypeList && this.formShowList.limitTypeList.some(item => item.value == 4);
    },
    isEditStaus() {
      return this.$route.query.isEdit && Number(this.$route.query.isEdit) ? true : false;
    },
    isCopyStaus() {
      return this.$route.query.isCopy && Number(this.$route.query.isCopy) ? true : false;
    },
    // 是否能够编辑积分叠加使用和储值卡叠加使用和转赠
    //微商城优惠券/扫码支付优惠券 可编辑
    //ERP券/通用券 不可编辑
    isDisabledPointAndCardAndGive() {
      return this.isEditStaus && (Number(this.formItem.sendType) === 4 || Number(this.formItem.sendType) === 5);
    }
  },
  components: {
    ImageEdit,
    WechatSelect,
    StoreSelect,
    BrandSelect,
    TreeShow,
    BatchImport
  },
  data () {
    return {
      formItem: {
        sendType: 0,
        isAllowPoint: '1',
        isAllowPrepaidcard: '1',
        giveType: '0',
        shareImage: '',
        shareTitle: '',
        shareDesc: '',
        receiveTimeType: '1',
        //绑定企微群ID
        settingValue: '1',
        receiveTime: 0,
        wxgroupSelect: [],
        qwgroupSelect: [],//绑定企微群ID
        tagId: [],
        limitedType: '0',
        cat: 0,
        vcat: 0,
        goodsBrandIds: [],
        excludeGoods: '',
        bindingGoods: '',
        isWriteoffSelf: '0',
        createNum: '',
        typeCode: '',
        isBindingErpUser: '1',
        lowStockNotice: '0',
        storeSelect: [],
        paymentId: 0,
        platformTypeId: 0,
        discountTypeId: 0,
        isLogIncome: '0',
        copyImageMain: '',
        copyImageExpire: ''
      },
      sortVcatList: [],
      currentVcatSort: [],
      payment: [],
      discountType: [],
      currentStyle: {},
      catTreeData: [],
      vcatTreeData: [],
      originCat: [],
      originVcat: [],
      bonusPlatformType: [],
      upLoadPayLoad: {},
    }
  },
  methods: {
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.formItem[name] = item.src;
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleSelect (mode, name) { //'group', 'wxgroupSelect'
      
      this.$selectContent({
        mode: mode,
        type: 'checkbox',
        data: this.formItem[name],
        getList: (data) => {
          this.formItem[name] = data;
          if (mode === 'group') {
            this.$refs.formValidate.validateField('wxgroupSelect');
          } else if (mode === 'tag') {
            this.$refs.formValidate.validateField('tagId');
          } else if (mode === 'store') {
            this.$refs.formValidate.validateField('storeSelect');
          }
        }
      })
    },
    checkData(type, name){
      let _props = {};
      if(type === 'store') {
        _props = {
          title: "店铺",
            columns: [
              {
              title: "店铺名称",
              key: "name"
              },
              // {
              // title: "店铺代码",
              // key: "code"
              // },
            ]
        }
        console.log(this.formItem[name]);
      }
      this.$UIModule({
          mode: "data-view",
          props: _props,
          options: {
            viewData: this.formItem[name]
          }
        })
    },
     handleQwgroupSelect (data) {
      this.formItem.qwgroupSelect = data;
    },
    handleTag (data) {
      this.formItem.wxgroupSelect = data;
    },
    handleAllTag (data) {
      this.formItem.tagId = data;
    },
    handleStoreTag (data) {
      this.formItem.storeSelect = data;
    },
    handleBrandTag (data) {
      this.formItem.goodsBrandIds = data;
    },
    checkExtendInfo() {
      return this.$refs.formValidate.validate(valid => {
        return valid;
      });
    },
    // 初始化为Tree组件所需的数据结构
    handleFormatTree (data, selected = []) {
      return data.map(item => {
        if (item.children.length) {
          item.children = this.handleFormatTree(item.children, selected) || [];
        }
        let idVal = item.cat_id || item.vcat_id || item.value;
        return {
          title: item.cat_name || item.vcat_name || item.title,
          value: idVal,
          expand: true,
          checked: selected.includes(idVal),
          children: item.children
        }
      });
    },
    handleCatData (data) {
      this.formItem.cat = data;
      console.log(data)
    },
    handleVcatData (data) {
      this.formItem.vcat = data;
      console.log(data)
    },
    handleShowCat () {
      this.$refs.treeCatShow.setData(this.catTreeData, '标准分类', this.isEditStaus).show();
    },
    handleShowVcat () {
      this.$refs.treeVcatShow.setData(this.vcatTreeData, '自定义分类', this.isEditStaus).show();
    },
    handleImportGoodsSn (type) {
        this.upLoadPayLoad = {
          type: type
        }
        this.uploadUrl = this.$api.couponsImportGoodsSn;
        console.log(this.uploadUrl)
        this.$refs.batchImport.openModal({upload:true,download:true}, this.uploadUrl, this.$api.couponsDownGoodsSnTemplate);
      },
    onImportSuccess (data) {
         if (data.type == 'exclude_goods') {
           this.formItem.excludeGoods = data.data_str
         } else {
            this.formItem.bindingGoods = data.data_str
         }
      },
  },
  watch: {
    data(nV) {
      if (nV && Object.keys(nV).length > 0) {
        const { discount_type, payment, vcat, category, goods_brand,bonus_platform_type } = nV;
        this.originCat = category;
        this.originVcat = vcat;
        this.bonusPlatformType = bonus_platform_type;
        if (!this.isEditStaus) {
          this.catTreeData = this.handleFormatTree(category);
          this.vcatTreeData = this.handleFormatTree(vcat);
        }
        this.payment = payment;
        this.discountType = discount_type;
      }
    },
    editData(nV) { console.log('nV：', nV);
      if (nV && Object.keys(nV).length > 0) {
        const {
          send_type,
          is_allow_point,
          is_allow_prepaidcard,
          give_type,
          share_image,
          share_title,
          share_desc,
          receive_time_type,
          receive_time,
          wxgroup_select,
          setting_value,
          qwgroup_select,
          tag_id_message,
          limited_type,
          binding_cat,
          binding_vcat,
          brand_list,
          binding_goods,
          exclude_goods,
          is_writeoff_self,
          create_number,
          type_code,
          is_binding_erp_user,
          low_stock_notice,
          store_list,
          payment_id,
          discount_type_id,
          is_log_income,
          platform_type_id,
          image_main,
          image_expire
        } = nV;
        const catRs = binding_cat && binding_cat.map(Number) || [];
        const vcatRs = binding_vcat && binding_vcat.map(Number) || [];
        this.catTreeData = this.handleFormatTree(this.originCat, catRs);
        this.vcatTreeData = this.handleFormatTree(this.originVcat, vcatRs);
        this.formItem = {
          sendType: send_type,
          isAllowPoint: is_allow_point,
          isAllowPrepaidcard: is_allow_prepaidcard,
          giveType: give_type,
          shareImage: share_image,
          shareTitle: share_title,
          shareDesc: share_desc,
          receiveTimeType: receive_time_type,
          receiveTime: Number(receive_time),
          wxgroupSelect: wxgroup_select,
          qwgroupSelect: qwgroup_select,
          settingValue: setting_value,
          tagId: tag_id_message,
          limitedType: limited_type,
          cat: binding_cat,
          vcat: binding_vcat,
          goodsBrandIds: brand_list,
          excludeGoods: exclude_goods,
          bindingGoods: binding_goods,
          isWriteoffSelf: is_writeoff_self,
          createNum: Number(create_number),
          typeCode: type_code,
          isBindingErpUser: is_binding_erp_user,
          lowStockNotice: low_stock_notice,
          storeSelect: store_list,
          paymentId: Number(payment_id),
          discountTypeId: Number(discount_type_id),
          isLogIncome: is_log_income,
          platformTypeId: Number(platform_type_id),
          copyImageMain: image_main,
          copyImageExpire: image_expire
        };
      }
    },
    formShowList(nV) {
      //商品限制类型
      if (nV.limitTypeList && nV.limitTypeList.length === 1 && nV.limitTypeList[0].value === 4) {
        // ERP+实物券
        this.formItem.limitedType = 4;
        this.currentStyle = {
          marginTop: 0
        };
      } else {
        this.currentStyle = {
          marginTop: '52px'
        };
      }
    }
  }
}
</script>

<style lang="less">
.coupon_extend_info{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .basic_textarea_fixed{
    width: 200px;
  }
  .share_disabled{
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 80px;
    background-color: rgba(243,243,243,.6);
    border-radius: 5px;
    border: 1px solid #eee;
    cursor: not-allowed;
    z-index: 1;
  }
  .coupon_input{
    width:300px;
    .coupon_input_select{
      width: 140px;
    }
  }
  .coupon_number{
    width: 100px;
  }
  .coupon_code{
    width: 140px;
  }
  .cascader_wrapper{
    display: inline-block;
    vertical-align: top;
    .btn{
      display: block;
      margin-bottom: 24px;
    }
  }
  .limit_type, .brand_select, .basic_cascader:not(:last-child){
    margin-bottom: 24px;
  }
  .coupon_img_wrapper{
    display: flex;
    align-items: flex-start;
    .title{
      display: inline-block;
      width: 80px;
      text-align: center;
    }
    .before{
      margin-right: 20px;
    }
  }
}
</style>
