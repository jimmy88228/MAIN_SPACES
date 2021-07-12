<template>
  <build-template :selected="selected" :include-m="includeM" ref="dataTemplate">
    <template v-slot:module="{ data }">
      <div v-if="data.type === 1">
        <!-- 广告模块 -->
        <ad-module-comp :data="data" :cat-data="catData" :vcat-data="vcatData"></ad-module-comp>
      </div>
      <div v-if="data.type === 2">
        <!-- 轮播图模块 -->
        <banner-module-comp :data="data" :cat-data="catData" :vcat-data="vcatData"></banner-module-comp>
      </div>
    </template>
  </build-template>
</template>

<script>
import BuildTemplate from '../template';
import AdModuleComp from '../plugins/ad-module';
import BannerModuleComp from '../plugins/banner-module'

export default {
  props: ['selected'],
  components: {
    BuildTemplate,
    AdModuleComp,
    BannerModuleComp
  },
  data () {
    return {
      catData: [],
      vcatData: [],
      includeM: ['adModule', 'bannerModule'] //使用广告位及轮播图
    }
  },
  methods: {
    loadData () {
      this.loadCatData();
      this.loadVcatData();
    },
    loadCatData () {
      this.spinShow = true;
      this.$ajax.post(this.$api.catTree)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.catData = res.data;
        }
        this.spinShow = false;
      });
    },
    loadVcatData () {
      this.spinShow = true;
      this.$ajax.post(this.$api.vcatTree)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.vcatData = res.data;
        }
        this.spinShow = false;
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style>

</style>
