let ViewType = {
    Group: "Group",
    Img: "Img",
    Gallery: "Gallery",
    GalleryItem: "GalleryItem"
};
function createView(other = {}) {
    return {
        style: {
            height: 200
        },
        ...other
    };
}
export default ViewType;
export const CreateView = {
    [ViewType.Group]() {
        return createView({
            name: "",
            type: ViewType.Group,
            style: {},
            parameters: {}
        });
    },
    [ViewType.Img]() {
        return createView({
            type: ViewType.Img,
            parameters: {
                type: "Page"
            }
        });
    },
    [ViewType.Gallery]() {
        return createView({
            type: ViewType.Gallery,
            parameters: {}
        });
    },
    [ViewType.GalleryItem]() {
        return createView({
            type: ViewType.Img,
            parameters: {
                type: "Page"
            }
        });
    }
};

export const GetTypeName = type => {
    switch (type) {
        case ViewType.Group:
            return "容器";
        case ViewType.Gallery:
            return "轮播组件";
        case ViewType.Img:
            return "图片";
        default:
            return "未知";
    }
};
