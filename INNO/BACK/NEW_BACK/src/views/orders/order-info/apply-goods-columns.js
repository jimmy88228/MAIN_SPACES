export default {
  data () {
    return {
      applyColumns: [
        {
          'type':'selection',
           'width':60,
           'align':'center'
        },
        {
          'title':'缩略图',
           'key':'goods_thumb',
           'width':100,
           'slot':'goods_thumb'
        },
        {
          'title':'商品名称',
           'key':'goods_name',
           
           'align':'center',
          //  'slot':'goods_name'
        },
        {
          'title':'属性',
           'key' :'specs_name',
           'align':'center',
          //  'slot':'specs_name'
        },
        {
          'title':'购买数量',
           'key':'goods_num',
           'width':100,
           'align':'center',
          //  'slot':'goods_num'
        },
        {
          'title':'申请数量',
           'key':'return_num',
           'align':'center',
           'slot':'return_num'
        },
        {
          'title':'申请类型',
           'key':'return_type',
           'align':'center',
           'slot':'return_type'
        },
        {
          'title':'退货原因',
           'key':'reason',
           'align':'center',
           'slot':'reason'
        },
        {
          'title':'具体原因',
           'key':'return_remark',
           'align':'center',
           'slot':'return_remark'
        }
      ],
      applyData: []
    }
  }
}