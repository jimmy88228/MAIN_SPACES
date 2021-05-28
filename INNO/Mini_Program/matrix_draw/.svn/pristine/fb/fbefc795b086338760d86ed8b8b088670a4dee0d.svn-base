import BehaviorOptionItem from "../../behavior-option-item";
Component({
    behaviors: [BehaviorOptionItem],
    relations: {
        '../input-grid': {
            type: 'parent',
            linked(target) {
                this.linked(target);
            },
            unlinked(target) {
                this.unlinked(target);
            }
        }
    }
});