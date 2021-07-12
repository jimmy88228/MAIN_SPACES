<template>
  <Table
      :columns="couponColumns"
      :data="couponData"
      ref="coupon"
      class="table">
      <template slot-scope="{ row, index }" slot="simpleName">
        <Input v-model="row.simpleName" placeholder="请输入名称" class="basic_input basic_input_fixed" @on-change="(e) => handleData(e.target.value, index, 'simpleName')"/>
      </template>
      <template slot-scope="{ row, index }" slot="pic">
        <image-edit :img="row.pic" @selectImg="openImagesModal('pic', index)" @delImg="handleDelImg('pic', index)">
          <p class="strong_tips">尺寸最佳是110*170</p>
        </image-edit>
      </template>
      <template slot-scope="{ row, index }" slot="iconPic">
        <image-edit :img="row.iconPic" @selectImg="openImagesModal('iconPic', index)" @delImg="handleDelImg('iconPic', index)">
          <p class="strong_tips">尺寸最佳是68*68</p>
        </image-edit>
      </template>
      <template slot-scope="{ row, index }" slot="isMain">
        <i-switch v-model="row.isMain" true-value="1" false-value="0" @on-change="(val) => handleData(val, index, 'isMain')">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </template>
      <template slot-scope="{ row, index }" slot="handle">
        <span @click="handleDel(index)"><a :class="delClass">删除</a></span>
      </template>
  </Table>
</template>

<script>
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  props: ['data', 'id'],
  components: {
    ImageEdit
  },
  data () {
    return {
      couponColumns: [
        {
          title: '优惠券',
          key: 'type_name'
        },
        {
          title: '别名',
          key: 'simpleName',
          slot: 'simpleName'
        },
        {
          title: '图片',
          key: 'pic',
          slot: 'pic'
        },
        {
          title: 'Icon图',
          key: 'iconPic',
          slot: 'iconPic'
        },
        {
          title: '主劵',
          key: 'isMain',
          slot: 'isMain'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      couponData: []
    }
  },
  computed: {
    isEditStatus () {
      return Number(this.id) ? true : false
    },
    delClass () {
      return {
        'strong_tips': this.isEditStatus,
        'not-allowed': this.isEditStatus
      }
    }
  },
  methods: {
    openImagesModal (key, index) {
      this.$selectMaterial({
        type: 'image',
        selectedData: this.couponData[index][key],
        getList: (item) => {
          this.couponData[index][key] = item.src;
          this.$emit('get-data', this.couponData);
        }
      });
    },
    handleDelImg (key, index) {
      this.couponData[index][key] = '';
      this.$emit('get-data', this.couponData);
    },
    handleData (val, index, key) {
      this.couponData[index][key] = val;
      this.$emit('get-data', this.couponData);
    },
    handleDel (index) {
      this.couponData.splice(index, 1);
      this.$emit('get-data', this.couponData);
    }
  },
  watch: {
    data (nV) {
      this.couponData = JSON.parse(JSON.stringify(nV));
      this.couponData.forEach((item, index) => {
        this.$set(this.couponData[index], 'simpleName', item.simpleName || '');
        this.$set(this.couponData[index], 'pic', item.pic || '');
        this.$set(this.couponData[index], 'iconPic', item.iconPic || '');
        this.$set(this.couponData[index], 'isMain', item.isMain || '0');
      })
    }
  }
}
</script>

<style>

</style>
