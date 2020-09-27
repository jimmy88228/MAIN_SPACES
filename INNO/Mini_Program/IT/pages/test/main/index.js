const app = getApp()
Page.BasePage({
    data: {
        questions: questions,
        specsData: specsData,
    },
    onShow() {
        this.setData({
            questions: questions,
            specsData: specsData
        });
    }
});

const questions = [{
    "id": 1,
    "name": "姓名",
    "type": "NAME",
    "must": true,
    "value": null
},
{
    "id": 2,
    "name": "电话",
    "type": "PHONE",
    "placeHolder": "电话",
    "must": true,
    "value": null
},
{
    "id": 3,
    "name": "证件",
    "type": "ID_CARD",
    "placeHolder": "填写身份证号",
    "must": true,
    "value": null
},
{
    "id": 4,
    "name": "XX",
    "options": [{ "name": "X1" }, { "name": "X2" }, { "name": "X3" }, { "name": "X4" }, { "name": "X5" }, { "name": "X6" }, { "name": "X7" }],
    "type": "GRID",
    "placeHolder": null,
    "must": true,
    "value": null
},
{
    "id": 5,
    "name": "XX",
    "options": [{ "name": "XXXXXXXXXXX1" }, { "name": "X2" }, { "name": "X3" }, { "name": "X4" }, { "name": "X5" }, { "name": "X6" }, { "name": "X7" }],
    "type": "GRID",
    "placeHolder": null,
    "must": true,
    "value": null
},
{
    "id": 6,
    "name": "门店",
    "options": [{ "name": "DOVER STREET MARKET BEIJING" }, { "name": "上海EXI.T" }, { "name": "北京EXI.T" }, { "name": "上海EXI.T" }, { "name": "北京EXI.T" }, { "name": "上海EXI.T" }, { "name": "北京EXI.T" }, { "name": "上海EXI.T" }, { "name": "北京EXI.T" }, { "name": "上海EXI.T" }, { "name": "北京EXI.T" }],
    "type": "LIST",
    "placeHolder": "购买门店",
    "must": true,
    "value": null
},
{
    "id": 7,
    "name": "数字",
    "type": "NUMBER",
    "placeHolder": "测试数字",
    "must": true,
    "value": null
},
{
    "id": 8,
    "name": "测试",
    "type": null,
    "placeHolder": "测试",
    "must": true,
    "value": null
}];

const specsData = {
    specs: [
        {
            id: 1,
            name: "款式",
            values: [{
                id: 1,
                value: "男款长版加绒",
            }, {
                id: 2,
                value: "女款",
            }, {
                id: 3,
                value: "儿童",
            }]
        },
        {
            id: 2,
            name: "颜色",
            values: [{
                id: 4,
                value: "黑色",
            }, {
                id: 5,
                value: "白色",
            }, {
                id: 6,
                value: "灰色",
            }]
        },
        {
            id: 3,
            name: "尺码",
            values: [{
                id: 7,
                value: "XS",
            }, {
                id: 8,
                value: "S",
            }, {
                id: 9,
                value: "M",
            }, {
                id: 10,
                value: "L",
            }, {
                id: 11,
                value: "XL",
            }, {
                id: 12,
                value: "XXL",
            }, {
                id: 13,
                value: "XXL",
            }, {
                id: 14,
                value: "XXL",
            }, {
                id: 15,
                value: "XXL",
            }, {
                id: 16,
                value: "XXL",
            }]
        }],
    products: [
        {
            id: 1,
            specIds: "1:1,2:5,3:7"
        },
        {
            id: 2,
            specIds: "1:3,2:4,3:8"
        },
        {
            id: 3,
            specIds: "1:2,2:6,3:9"
        },
        {
            id: 4,
            specIds: "1:3,2:5,3:10"
        },
        {
            id: 5,
            specIds: "1:1,2:4,3:11"
        },
        {
            id: 6,
            specIds: "1:3,2:4,3:7"
        },
        {
            id: 7,
            specIds: "1:1,2:4,3:9"
        },
        {
            id: 8,
            specIds: "1:3,2:6,3:11"
        },
    ]
}