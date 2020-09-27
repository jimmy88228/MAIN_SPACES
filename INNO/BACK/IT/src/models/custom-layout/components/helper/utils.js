import Node from "./node";
import StringHelper from "@/helper/utils/string-util";
import ViewType from "./view-type";
export default {
    createRootNode() {
        return new Node({}, true);
    },
    JsonToNode(json) {
        let node;
        try {
            let obj = JSON.parse(json);
            obj && (node = new Node({ child: obj }, true));
        } catch (err) {}
        return node || new Node({}, true);
    },
    nodeToJson(node) {
        return JSON.stringify(node.data.child || []);
    },
    check(node, cb) {
        if (!node.isRoot && !StringHelper.trim(node.name)) {
            node.toEdit();
            let msg = "组件名不可为空";
            cb && cb(msg);
            return false;
        } else if ((node.isRoot || node.type === ViewType.Group) && node.child) {
            for (let i in node.child) {
                if (!this.check(node.child[i], cb)) {
                    return false;
                }
            }
        }
        return true;
    }
};
