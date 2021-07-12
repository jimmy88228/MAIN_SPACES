<template>
  <div class="goods-distribute">
    <PageTopBase :is-save="isSave" @save="modalOk">
      <div class="content">
        <div class="tips">
          <Alert show-icon>
            什么是快速分配分类？
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">搜索商品后，勾选的商品保存后将分配到当前该分类<span style="color: #ed4014;">({{currentSortName}})</span>下</template>
          </Alert>
        </div>
          <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
          <Table
            ref="myTable"
            :height="specTableHeight"
            :columns="columns"
            :data="tableData"></Table>
      </div>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';

const COLUMNS = [
  {
    title: '商品名称',
    key: 'goods_name',
    align: 'left',
    render (h, params) {
      // 获取图片，加载错误则不显示
      const imgDomCol = document.getElementsByClassName('my-img');
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        },
        directives: [{
          name: 'viewer'
        }]
      }, [
        h('div', {
          style: {
            display: 'inline-block',
            height: '70px',
            width: '70px',
            border: '1px solid #eee',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '8px 5px 8px 0',
            overFlow: 'hidden'
          }
        }, [
          h('img', {
            style: {
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            },
            attrs: {
              alt: params.row.goods_name,
              title: '点击查看大图',
              src: params.row.goods_thumb2 || '@rs/images/default-img.jpg',
              class: 'my-img'
            },
            on: {
              load () {
                imgDomCol[params.index].style.display = 'block';
              },
              error () {
                if (!params.row.goods_thumb2) imgDomCol[params.index].style.display = 'none';
              }
            }
          })
        ]),
        h('span', {
          domProps: {
            innerHTML: params.row.goods_name || ''
          }
        })
      ])
    }
  },
  {
    title: '商品货号',
    key: 'goods_sn',
    align: 'left'
  },
  {
    title: '原分类',
    key: 'cat_name',
    align: 'left'
  }
];

export default {
  props: ['data'],
  components: {
    PageTopBase
  },
  data () {
    return {
      spinShow: false,
      specTableHeight: 500,
      tableData: [],
      columns: COLUMNS,
      currentSortName: '',
      currentSortId: 0,
      isSave: true,
      goodsData: []
    }
  },
  methods: {
    handleSelect () {
      this.$selectContent({
        mode: 'cloud-goods',
        type: 'checkbox',
        data: this.goodsData,
        getList: (data) => {
          this.goodsData = data;
          this.tableData = data;
        }
      })
    },
    modalOk () {
      if (this.tableData.length === 0) {
        this.$Message.error('请选择商品');
        return false;
      }
      this.$Modal.confirm({
        title: '提示',
        content: '确定分配到当前该分类吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;
          const params = this.type == 'cat' ? {
            cat_id: this.currentSortId,
            goods_ids: this.tableData.map(item => item.goods_id).join(',')
          } : {
            vcat_id: this.currentSortId,
            goods_ids: this.tableData.map(item => item.goods_id).join(',')
          };
          this.$ajax.post(this.type == 'cat' ? this.$api.ShopGoodsCatDistribution : this.$api.ShopGoodsVcatDistribution, params)
            .then((response) => {
              var res = response.data;
              if (res.code) {
                // 初始化数据
                this.$Message.success(res.message);

                // 把数据返回给父级
                this.$emit('on-success');
                this.spinShow = false;
                this.tableData = [];
              }
            });
        }
      });
    }
  },
  mounted () {
    const data = JSON.parse(this.data);
    this.type = data.type;
    this.currentSortName = data.title;
    this.currentSortId = data.id;
    // 特殊处理，不适应page-helper计算场景
    this.specTableHeight = document.body.clientHeight - 400;
  }
}
</script>

<style lang="less" scoped>
.goods-distribute{
  .content{
    .select_btn{
        margin-bottom: 10px;
    }
  }
}
</style>
