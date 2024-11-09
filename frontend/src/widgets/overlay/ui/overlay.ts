const $overlay: JQuery = $('.overlay');

const showOverlay = () => {
    $overlay.fadeIn(1000);
};

const hideOverlay = () => {
    $overlay.fadeOut(1000);
};

export { showOverlay, hideOverlay };