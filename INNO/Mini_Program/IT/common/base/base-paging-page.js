import BasePage from "./base-page";
import PagingHelper from "./base-paging-helper";
const PagingPage = function (pageOptions) {
    BasePage({
        ...PagingHelper,
        ...pageOptions
    });
}

Page.PagingPage = PagingPage;

export default PagingPage