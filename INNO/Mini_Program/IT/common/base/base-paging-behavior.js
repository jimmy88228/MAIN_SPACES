import PagingHelper from "./base-paging-helper";

const PagingBehavior = Behavior({
    methods: {
        ...PagingHelper
    }
});

Behavior.PagingBehavior = PagingBehavior;

export default PagingBehavior;
