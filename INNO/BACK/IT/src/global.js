document.body.addEventListener(
    "ondrop",
    event => {
        event.preventDefault();
        event.stopPropagation();
    },
    false
);
