export default{
    data(){
        return{}
    },
		methods:{
			dragStart(e, dragItem) {
				this.dragItem = dragItem;
				this.isDraging = true
			},
			dragEnd(e, dragItem) {
				this.isDraging = false;
				if (this.dragItem) {
					setTimeout(() => {
						this.dragItem = null;
					}, 500)
				}
			},
			labelEnter(detail) {
				if (this.isDraging) return;
				let dragItem = JSON.parse(JSON.stringify(this.dragItem));
				if (dragItem) {
					this.dragItem = null;
					if (detail.level == "0" || detail.level == "0_0") return; //不允许修改开始 和 首次会员筛选
					let eidtItem = this.getLevel(detail.level);
					eidtItem.tagType = dragItem.type;
					eidtItem.screen_name = dragItem.name;
					// this.$set(eidtItem, 'tagType', dragItem.type);
					// this.$set(eidtItem, 'screen_name', dragItem.name);
				}
			},
			labelOut() {},
			createBranch(detail) { // 添加
				let eidtItem = this.getLevel(detail.level);
				let id = eidtItem.id;
				let len = this.loopBody.getElementsByClassName("label-item").length;
				eidtItem.children.push({
					tagType: "",
					id: len,
					parent_id: id,
					type: detail.type || ""
				})
				this.setNode();
			},
			removeBranch(detail) { // 删除
				this.getLevel(detail.level, "remove");
				this.setNode();
			},
			setNode() {
				let level = "";
				this.loopBody = this.loopBody || document.getElementById("loopBody");
				this.lineView = this.lineView || document.getElementById("line_view");
				this.$nextTick(() => {
					let nodeClient = this.loopBody.getBoundingClientRect();
					this.nTop = nodeClient.top || 0;
					this.nLeft = nodeClient.left || 0;
					let tagsData = this.tagsData || [];
					this.loopNode(tagsData, level, null, "");
				})
			},
			loopNode(data, level, pClient, html) {
				if (!(level + "")) this.lineViewHtml = "";
				for (let i = 0; i < data.length; i++) {
					let _level = level + "" ? level + '_' + i : i;
					let name = "label" + _level;
					let type = data[i].type;
					let label = this.loopBody.getElementsByClassName(name)[0];
					let client = label && label.getBoundingClientRect() || {};
					let top = client.top - (this.nTop || 0) + (client.height / 2);
					let left = client.left - (this.nLeft || 0) + (client.width / 2);
					if (pClient) {
						let _html = this.getSvgHtml(pClient.top, pClient.left, top, left, client.width, client.height,
							type);
						html += _html
						this.lineViewHtml += _html;
					}
					if (data[i].children && data[i].children.length > 0) {
						this.loopNode(data[i].children, _level, {
							top,
							left
						}, html);
					} else if (i == 0 && this.lineView) {
					}
				}
			},
			getSvgHtml(A_t, A_l, B_t, B_l, w, h, type) {
				let line_c = type == 'no' ? "#F85D67" : "#000";
				let svg_w = 90,
					svg_h = 6,
					html = "";
				if (A_t > B_t) { //上分支
					svg_w = B_l - A_l;
					svg_h = Math.abs(A_t - B_t);
					html = '<svg width="' + svg_w + 'px" height="' + svg_h + 'px" style="position:absolute;top:' + B_t +
						'px;left:' + A_l + 'px;" version="1.1" xmlns="http://www.w3.org/2000/svg">\
			                          <path d="M0 ' + svg_h + ' L0 0 L' + svg_w + ' 0" fill="none" stroke="' + line_c + '" stroke-width="3" />\
			                      </svg><div class="indent ' + type + '_indent" style="top:' + B_t + 'px;left:' + (A_l +
						30) + 'px" ></div>'
				} else if (A_t == B_t) { //中分支
					if (A_l != B_l) {
						svg_w = Math.abs(B_l - A_l);
					}
					html = '<svg width="' + svg_w + 'px" height="' + svg_h + 'px" style="position:absolute;top:' + A_t +
						'px;left:' + A_l + 'px;" version="1.1" xmlns="http://www.w3.org/2000/svg">\
			                          <path d="M0 0 L' + (B_l - A_l) + ' 0" fill="none" stroke="' + line_c + '" stroke-width="3"/>\
			                      </svg><div class="indent ' + type + '_indent" style="top:' + B_t + 'px;left:' + (A_l +
						30) + 'px" ></div>'
				} else { //下分支
					svg_w = B_l - A_l;
					svg_h = Math.abs(B_t - A_t);
					html = '<svg width="' + svg_w + 'px" height="' + svg_h + 'px" style="position:absolute;top:' + A_t +
						'px;left:' + A_l + 'px;" version="1.1" xmlns="http://www.w3.org/2000/svg">\
			                          <path d="M0 0 L0 ' + svg_h + ' L' + svg_w + ' ' + svg_h + '" fill="none" stroke="' +
						line_c + '" stroke-width="3"/>\
			                      </svg><div class="indent ' + type + '_indent" style="top:' + B_t + 'px;left:' + (A_l +
						30) + 'px" ></div>'
				}
				return html;
			},
			getLevel(level, type) {
				let tagsData = this.tagsData || [];
				let data = tagsData,
					removeIndex = null;
				if (level) {
					let levelArr = level.split("_");
					for (let i = 0; i < levelArr.length; i++) {
						if (type == "remove" && i == (levelArr.length - 1)) {
							removeIndex = levelArr[i] + "";
							break;
						}
						data = data[levelArr[i]] || data.children[levelArr[i]];
					}
					if (type == "remove" && removeIndex) {
						data.children.splice(removeIndex, 1);
					}
					if (!data.children) data.children = []
					return data;
				}
				return tagsData[0];
			}
		}
}