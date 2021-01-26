import ViewType, { GetTypeName } from "./view-type";
import Vue from "vue";

class LayoutManager extends Vue {
    constructor() {
        super({
            data() {
                return { editNode: null };
            },
            computed: {
                canEdit() {
                    return !!(this.editNode && this.editNode.type && ViewType[this.editNode.type]);
                }
            },
            methods: {
                setEditNode(node) {
                    this.editNode && this.editNode.setIsEdit(false);
                    this.editNode = node;
                    this.editNode && this.editNode.setIsEdit(true);
                },
                unEditNode(node) {
                    if (this.editNode === node) {
                        this.editNode = null;
                    }
                }
            }
        });
    }
}

export default class Node {
    constructor(data, isRoot = false) {
        this._data = data;
        this._isRoot = isRoot;
        this.isEdit = false;
        this.initChild();
    }
    get data() {
        return this._data;
    }
    get child() {
        return this._child || [];
    }
    get type() {
        return this._data.type || "";
    }
    get name() {
        return this._data.name || "";
    }
    get typeName() {
        return GetTypeName(this.type);
    }
    get isRoot() {
        return !!this._isRoot;
    }
    setIsEdit(isEdit) {
        this.isEdit = isEdit;
        return this;
    }
    get parent() {
        return this._parentGetter && this._parentGetter();
    }
    setParent(parent) {
        this._parentGetter = () => parent;
        return this;
    }
    get root() {
        let node = this;
        while (true) {
            let parent = node.parent;
            if (parent) {
                node = parent;
            } else {
                return node;
            }
        }
    }
    get layoutManager() {
        let root = this.root;
        if (root) {
            if (root._lmGetter) {
                return root._lmGetter();
            } else {
                let lm = new LayoutManager();
                root._lmGetter = () => lm;
                return lm;
            }
        }
        return null;
    }
    initChild() {
        let c = this.data.child;
        if (c) {
            this._child = c.map(e => {
                return new Node(e).setParent(this);
            });
        } else {
            this._child = null;
        }
    }

    addChild(node) {
        node.setParent(this);

        if (this._child) {
            this._child.push(node);
            this.data.child.push(node.data);
        } else {
            this._child = [node];
            this.data.child = [node.data];
        }
    }
    removeChild(node) {
        let index;
        if (this._child && (index = this._child.indexOf(node)) >= 0) {
            this._child.splice(index, 1);
        }
        if (this.data.child && (index = this.data.child.indexOf(node.data)) >= 0) {
            this.data.child.splice(index, 1);
        }
        node.unEdit();
    }
    removeFromParent() {
        this.parent && this.parent.removeChild(this);
    }

    toEdit() {
        this.layoutManager.setEditNode(this);
    }

    unEdit() {
        this.layoutManager.unEditNode(this);
    }
}
