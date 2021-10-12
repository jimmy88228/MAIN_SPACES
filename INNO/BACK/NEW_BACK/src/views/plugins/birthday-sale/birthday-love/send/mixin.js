export default {
 data () {
   return {
     tableColumns: [
       {
         title: '用户头像',
         key: 'portrait_path',
         slot: 'portrait_path'
       },
       {
         title: '活动用户',
         key: 'card_num'
       },
       {
         title: '活动名称',
         key: 'activity_name'
       },
       {
         title: '参与时间',
         key: 'add_time',
         slot: 'add_time'
       },
       {
         title: '活动奖项',
         key: 'prize',
         render(h, p) {
           return h('div', p.row.prize.map(item => {
             return h('p', item)
           }))
         }
       }
     ]
   }
 }
}
