import img8 from "@rs/images/marketing/node-type-img8.png";
import img1 from "@rs/images/marketing/node-example-img-type1.png";
import img2 from "@rs/images/marketing/node-example-img-type2.png";
import img3 from "@rs/images/marketing/node-example-img-type3.png";
import img13 from "@rs/images/marketing/node-example-img-type13.png";
import img4 from "@rs/images/marketing/node-example-img-type4.png";
import img5 from "@rs/images/marketing/node-example-img-type5.png";
import img6 from "@rs/images/marketing/node-example-img-type6.png";
import img11 from "@rs/images/marketing/node-example-img-type11.png";
import img12 from "@rs/images/marketing/node-example-img-type12.png";
import img9 from "@rs/images/marketing/node-example-img-type9.png";
import img14 from "@rs/images/marketing/node-example-img-type14.png";

import img from "@rs/images/marketing/node-type-img.png";

export default{
    data(){
        return{
            labelList:{
                0: {
                    type: 0,
                    name: "开始",
                    img: img8
                },
                1: {
                    type: 1,
                    name: "会员筛选",
                    img: img1
                },
                2: {
                    type: 2,
                    name: "延时",
                    img: img2
                },
                3: {
                    type: 3,
                    name: "优惠券",
                    img: img3
                },
                13: {
                    type: 13,
                    name: "红包",
                    img: img13
                },
                4: {
                    type: 4,
                    name: "增加标签",
                    img: img4
                },
                5: {
                    type: 5,
                    name: "移除标签",
                    img: img5
                },
                6: {
                    type: 6,
                    name: "发消息",
                    img: img6
                },
                11: {
                    type: 11,
                    name: "发短信",
                    img: img11
                },
                12: {
                    type: 12,
                    name: "发客服消息",
                    img: img12
                },
								14: {
								    type: 14,
								    name: "发企业消息",
								    img: img14
								},
                8: {
                    type: 8,
                    name: "结束",
                    img: img9
                },
				default: {
					type: "",
					name: "",
					img: img
				}
            },
        }
    },
}