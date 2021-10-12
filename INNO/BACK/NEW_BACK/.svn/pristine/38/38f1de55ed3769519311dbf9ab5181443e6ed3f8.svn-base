<template>
    <div>
      <BatchImport ref="batchImport" :data="typeParams">
        <template v-slot:header v-if="is_new_distribution=='Y'">
              <label>分销等级</label>
              <Select v-model="rank_id" class="basic_select select_fixed" @on-change="handleRankChange">
                <Option v-for="item in rankList" :value="item.id" :key="item.id">{{ item.rank_name }}</Option>
              </Select>
            </template>
            <template v-slot:footer>
                <span class="sign">备注： 0.3表示提成比例为30%，提成比例设置不能大于1，小于0，只对分销有效；重置提成为0时请用文本格式加2位小数，如0.00</span>
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
  data () {
    return {
      rankList: [],
      rank_id: 0,
      typeParams: {
        rank_id: 0
      },
      is_new_distribution: 'N'
    }
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.distributionAllRank, {
        isInit: 1,
        searchq: '',
        page: 1,
        pageSize: 100
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.rankList = res.data && res.data.item;
          this.is_new_distribution = res.data && res.data.is_new_distribution;
        }
      });
    },
    handleRankChange () {
      this.typeParams.rank_id = this.rank_id;
    }
  },
  mounted () {
    this.loadData();
    // 批量修改库存
    this.$refs.batchImport.openModal(this.$api.ShopGoodsBatchPercentage, this.$api.ShopGoodsBatchPercentageTpl);
  }
}
</script>
