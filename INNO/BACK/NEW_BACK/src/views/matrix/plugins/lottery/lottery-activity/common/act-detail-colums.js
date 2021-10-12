export const actDetailColums = [
	{
	  title: '中奖别名',
	  key: 'prizeName',
	  className: 'padd',
	  width: 200,
	  align: 'center',
	  slot: 'prizeName',
	  renderHeader: (h, params) => {
	    return h('span', [
	        h('Tooltip', {
	            props: {
	                content: "抽中奖品显示的名称",
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
	                    innerHTML: "中奖别名"
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
	  title: '概率',
		minWidth:150,
	  key: 'prizeRate',
	  className: 'padd',
	  slot: 'prizeRate',
	  renderHeader: (h, params) => {
	    return h('span', [
	        h('Tooltip', {
	            props: {
	                content: "支持最大2位小数，概率总和需要需等于100%",
	                trigger: 'hover',
	                size: 'small',
	                transfer: true,
	                "max-width": 200,
	                placement:'top-end',
	               
	            },
	            attr: {
	              transfer: true
	            }
	        }, [
	            h('span', {
	                domProps: {
	                    innerHTML: "概率"
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
	  title: '每日中奖数',
		minWidth:140,
	  key: 'prizeLimitValue1',
	  className: 'padd',
	  slot: 'prizeLimitValue',
		
	  renderHeader: (h, params) => {
	    return h('span', [
	        h('Tooltip', {
	            props: {
	                content: "该奖项每日可抽取的数量，不可大于奖品总数",
	                trigger: 'hover',
	                size: 'small',
	                transfer: true,
	                "max-width": 200,
	                placement:'top-end',
	               
	            },
	            attr: {
	              transfer: true
	            }
	        }, [
	            h('span', {
	                domProps: {
	                    innerHTML: "每日中奖数"
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
	  title: '区间中奖数',
		minWidth:140,
	  key: 'prizeLimitValue2',
	  className: 'padd',
	  slot: 'prizeLimitValue',
		
	  renderHeader: (h, params) => {
	    return h('span', [
	        h('Tooltip', {
	            props: {
	                content: "该奖项可抽奖的区间次数；（如填100，即表示抽100次只有1次中奖）",
	                trigger: 'hover',
	                size: 'small',
	                transfer: true,
	                "max-width": 200,
	                placement:'top-end',
	               
	            },
	            attr: {
	              transfer: true
	            }
	        }, [
	            h('span', {
	                domProps: {
	                    innerHTML: "区间中奖数"
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
	  title: '奖品总数',
		minWidth:100,
	  key: 'prizeTotals',
	  className: 'padd',
	  slot: 'prizeTotals'
	},
	{
	  title: '进入奖池数',
		minWidth:120,
	  key: 'joinPoolNumber',
	  className: 'padd',
	  slot: 'joinPoolNumber',
	  renderHeader: (h, params) => {
	    return h('span', [
	        h('Tooltip', {
	            props: {
	                content: "本次活动抽奖次数需达到指定数值才有机会抽取该奖品",
	                trigger: 'hover',
	                size: 'small',
	                transfer: true,
	                "max-width": 200,
	                placement:'top-end',
	               
	            },
	            attr: {
	              transfer: true
	            }
	        }, [
	            h('span', {
	                domProps: {
	                    innerHTML: "进入奖池数"
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
	  title: '排序',
		minWidth:100,
	  key: 'sort',
	  className: 'padd',
	  slot: 'sort'
	},
	{
	  title: '图片',
		minWidth:120,
	  key: 'prizeImg',
	  className: 'padd',
	  slot: 'prizeImg',
	  renderHeader: (h, params) => {
	    return h('span', [
	        h('Tooltip', {
	            props: {
	                content: "JPG/PNG格式，格式50*50px",
	                trigger: 'hover',
	                size: 'small',
	                transfer: true,
	                "max-width": 200,
	                placement:'top-end',
	               
	            },
	            attr: {
	              transfer: true
	            }
	        }, [
	            h('span', {
	                domProps: {
	                    innerHTML: "图片"
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
]

export const setActColums = function(page, info){
	let _columns = [];
	let initColumns = page.initColumns ? page.initColumns : (page.columns || []);
	for(let i = 0; i < initColumns.length; i++){
		let key = initColumns[i].key;
		if(key == "prizeLimitValue1" && info.prizeLimit == 2){
			continue;
		} else if(key == "prizeLimitValue2" && info.prizeLimit == 1){
			continue;
		}
		_columns.push(initColumns[i])
	}
	if(!page.initColumns) page.initColumns = initColumns;
	page.columns = _columns;
}