<template>
    <div class="product_price">
        <BatchImport ref="batchImport" :data="typeParams" :can-upload="typeUpload">
            <template v-slot:header>
              <label>上传类型</label>
              <Select v-model="uploadType" class="basic_select select_fixed" @on-change="handleTypeChange">
                <Option :value="Number(1)">追加</Option>
                <Option :value="Number(2)">修改</Option>
              </Select>
            </template>
        </BatchImport>
    </div>
</template>

<script>
import BatchImport from './batch-import';

export default {
  components: {
    BatchImport
  },
  props: {
    importid: {
      type:Number,
    },
  },
  data () {
    return {
      uploadType:1,
      typeParams: {
        id:0,
        upload_type: 1
      }
    }
  },
  computed: {
    typeUpload () {
      return this.typeParams.upload_type !== 1;
    }
  },
  methods: {
    handleTypeChange () {
      this.typeParams.upload_type = this.uploadType;
    }
  },
  mounted () {
    this.$refs.batchImport.openModal(this.$api.SeckillActivityGoodsTypeUpload, this.$api.seckillActivityGoodsDownload);
  },
  watch:{
    importid:{//深度监听，可监听到对象、数组的变化
         handler(nv){
           this.typeParams.id=Number(nv);
         },
         immediate:true //true 深度监听
     }
  }
}
</script>
