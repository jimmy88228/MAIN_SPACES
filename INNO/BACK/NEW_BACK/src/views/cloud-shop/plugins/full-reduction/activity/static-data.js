export default {
  data () {
    return {
      week: [{
          value: 1,
          label: '周一'
        },
        {
          value: 2,
          label: '周二'
        },
        {
          value: 3,
          label: '周三'
        },
        {
          value: 4,
          label: '周四'
        },
        {
          value: 5,
          label: '周五'
        },
        {
          value: 6,
          label: '周六'
        },
        {
          value: 7,
          label: '周日'
        }
      ],
      couponColumn: [{
        title: '优惠券名称',
        key: 'name'
      },
      {
        title: '数量',
        key: 'nums',
        slot: 'nums'
      },
      {
        title: '操作',
        key: 'handle',
        slot: 'handle'
      }
      ],
      giftColumn: [{
          title: '赠品名称',
          key: 'name'
        },
        {
          title: '数量',
          key: 'nums',
          slot: 'nums'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      day: []
    }
  },
  methods: {
    generateDay() {
      let result = [];
      for (let i = 1; i <= 31; i++) {
        result.push({
          value: i,
          label: `${i}日`
        });
      }
      this.day = result;
    }
  },
  mounted () {
    this.generateDay();
  }
}
