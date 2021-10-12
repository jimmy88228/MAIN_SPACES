export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
              {
                  title: "日期",
                  key: "op_date",
                  minWidth: 120,
                  align: "left"
              },
              {
                  title: "接待量",
                  key: "reception_count",
                  minWidth: 110,
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "每日接待会员次数，多次咨询的会员多次计算",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "接待量"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "咨询人数",
                  minWidth: 100,
                  key: "consult_user",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "每日接待的会员数量，多次咨询的会员去重计算",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "咨询人数"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "首次响应时长",
                  minWidth: 100,
                  key: "first_resp_time",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "每日接待首条咨询和首条回复间隔平均时长（受咨询时间段影响）",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "首次响应时长"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "平均响应时长",
                  minWidth: 120,
                  key: "average_resp_time",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "一次会话的咨询和回复的平均间隔时长（受咨询时间段影响）",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "平均响应时长"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "客服回复率",
                  minWidth: 120,
                  key: "resp_rate",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "客服回复条数/会员咨询条数的占比",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "客服回复率"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              }
        ],
          columns2: [
              {
                  type: 'index',
                  width: 60,
                  align: 'center'
              },
              {
                  title: "日期",
                  key: "op_date",
                  minWidth: 120,
                  align: "left"
              },
              {
                  title: "转化率",
                  minWidth: 110,
                  key: "order_convert_rate",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "咨询时间段之后下单的数量；下单人数/咨询人数的占比",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "转化率"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "销售业绩",
                  minWidth: 100,
                  key: "order_amount",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "符合转化率的订单销售总额，实付金额",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "销售业绩"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "客单价",
                  minWidth: 110,
                  key: "average_order_amount",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "符合转化率的订单销售金额/订单数",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "客单价"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              },
              {
                  title: "客件数",
                  minWidth: 110,
                  key: "average_goods_number",
                  // sortable: true,
                  align: "right",
                  renderHeader: (h, params) => {
                      return h('span', [
                          h('Tooltip', {
                              props: {
                                  content: "符合转化率的订单销售件数/订单数",
                                  trigger: 'hover',
                                  size: 'small',
                                  transfer: true,
                                  "max-width": 200,
                                  placement: 'top-end'
                              },
                              attr: {
                                  transfer: true
                              }
                          }, [
                              h('span', {
                                  domProps: {
                                      innerHTML: "客件数"
                                  },
                              }),
                              h('icon', {
                                  props: {
                                      type: "ios-help-circle-outline"
                                  }
                              })

                          ])
                      ])
                  }
              }
          ]
      }
    }
  }
  