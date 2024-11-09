import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

const createSplideInstance = (selector: string) => {
    const splide = new Splide(selector, {
        perPage: 2,
        rewind: true,
        autoWidth: true,
        isNavigation: false,
        arrows: false,
        pagination: false,
    });

    splide.mount();
    return splide;
};

export default createSplideInstance;
