   export const $preloader: JQuery = $('.preloader');
   export function show(){
        this.$preloader.removeClass('preloader--visibility');
    }
   export function hide(){
        this.$preloader.addClass('preloader--visibility');
    }
