import ViewType, { CreateView } from "../helper/view-type.js";
import Node from "../helper/node.js";
import Vue from "vue";

export default {
    props: ["node"],
    computed: {
        viewType() {
            return ViewType;
        },
        nodeData() {
            return this.node.data;
        },
        child() {
            return this.node.child;
        },
        type() {
            return this.node.type;
        },
        typeName() {
            return this.node.typeName;
        },
        style: {
            get() {
                return this.nodeData.style || {};
            },
            set(val) {
                if (!this.nodeData.style) {
                    Vue.set(this.nodeData, "style", {});
                }
                this.vueDataMerge(this.nodeData.style, val);
            }
        },
        params: {
            get() {
                return this.nodeData.parameters || {};
            },
            set(val) {
                if (!this.nodeData.parameters) {
                    Vue.set(this.nodeData, "parameters", {});
                }
                this.vueDataMerge(this.nodeData.parameters, val);
            }
        }
    },
    methods: {
        addChild(type, select) {
            let cv = CreateView[type];
            let view = cv && cv();
            if (view) {
                let node = new Node(view, true);
                this.node.addChild(node);
                select && node.toEdit();
            }
        }
    }
};
