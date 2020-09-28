import BehaviorOption from "../behavior-option";
Component({
    behaviors: [BehaviorOption],
    relations: {
        './input-grid-item/input-grid-item': {
            type: 'child',
            unlinked(target) {
                this.unlinked(target)
            }
        }
    },
    properties: {
        canCancel: {
            type: Boolean,
            value: true
        },
        name: String
    },
    methods: {
        getNodes() {
            return this.getRelationNodes("./input-grid-item/input-grid-item");
        },
        showError() {
            wx.MyAnims.error(this, ".input-grid-item-box");
        }
    }
});