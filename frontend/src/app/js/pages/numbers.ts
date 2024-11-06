// fixme не нужно
"use strict";

import { Device } from "@app/js/compat/Device";
import { View } from "@app/js/compat/View";
import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

// fixme нужно в отдельном файле
interface NumbersFilter {
    // fixme any крайне не рекомендуется использовать, так как теряется смысл использования typescript
    [key: string]: any
}

type filtersTypes =
    | 'list'
    | 'int'
    | 'string'

// fixme нужно использовать форматтер ide (ctrl + alt + L)
/*export */class PhoneNumbers {
    // fixme Нет модификаторов доступа
    //private $numbersList: JQuery = $('.numbers__content-list');
    $numbersList = $('.numbers__content-list');
    // fixme слово download используется не в правильном контексте (download - загрузка, скачка, обычно подразумевается загрузка файлов)
    $numbersDownload = $('.numbers__download-btn > button');
    $numbersForm = $('.numbers__filters-form');
    $numbersCount = $('.numbers__count span');
    $filtersCount = $('.numbers__filters-btn .circle');
    $overlay = $('.numbers__overlay');

    numberCounter: number = 0;
    page: number = 1;

    private filter: NumbersFilter = {};

    /*
        fixme "спагетти" код в конструкторе, его необходимо разделить на логические части
         (например initListeners - инициализирует все слушатели)
     */
    constructor(){
        // fixme 1: слушатели на документ нужно использовать в исключительных случаях, слушатель нужен на родительский контейнер
        // fixme 2: избегаем излишнего использования асинхронных функций
        $(document).on('click', '.numbers__download-btn > button', async() => {
            this.page += this.page;

            // fixme this.render().then
            await this.render();
        })
        $(document).on('click', '#numbers-search',  async() =>{
            this.numberCounter = 0;
            this.$numbersList.empty();
            await this.render();
        });

        // fixme делегирование событий
        $(document).on('change', '#numbers-free-search',  e => this.setFilter("free_search", $(e.currentTarget), "string"));
        $(document).on('click', '#numbers-categories button',  (e) => this.setFilter('categories', $(e.currentTarget), 'list'));
        $(document).on('click', '#numbers-operators button',  (e) => this.setFilter('operators', $(e.currentTarget), 'list'));
        $(document).on('change', '#numbers-regions',  e => this.setFilter("region", $(e.currentTarget),  "int"));
        $(document).on('change', '#numbers-min_price',  e => this.setFilter("min_price", $(e.currentTarget), "int"));
        $(document).on('change', '#numbers-max_price',  e => this.setFilter("max_price", $(e.currentTarget), "int"));

        $(document).on('click', '#numbers-clear',  () =>{
            // fixme искать каждый раз инпуты неправильно, нужно было вынести в глобальную переменную за пределами эвента
            this.$numbersForm.find('input').val('');
            this.$numbersForm.find('select').val('0');
            // fixme модификатор цвета использовать правильно, но тут нужен модификатор active
            this.$numbersForm.find('button').removeClass('numbers__active--violet');
            this.filter = {};
            this.countFilters();
        });
            // fixme overlay должен быть в отдельном классе
            $(document).on('touchend click', '#overlay-show',  () =>{
                this.$overlay.fadeIn(1000);
            });
            $(document).on('touchend click', '#overlay-hide',  () =>{
                this.$overlay.fadeOut(1000);
            });

            // fixme чтобы избегать "спагетти" кода, правильнее было бы вынести в отдельный метод
        new Splide('.splide', {
            perPage: 2,
            rewind : true,
            autoWidth: true,
            isNavigation: false,
            arrows : false,
            pagination: false,
        }).mount();
    }

    private setFilter(name: string, item: JQuery<HTMLElement>, type: filtersTypes|null = null) {


        let value;
        if (type === 'list') {
            item.toggleClass('numbers__active--violet');

            let value = item.find('span').data('id');

            if (!this.filter[name])
                this.filter[name] = [];

            // fixme скобки ставим везде, даже если условие в 1 строку
            if (item.hasClass('numbers__active--violet'))
                this.filter[name].push(value);
            else
                this.filter[name] = this.filter[name].filter((v: number) => v !== value);

            if (!this.filter[name].length)
                delete this.filter[name];

            this.countFilters();
            return;
        } else if (type === 'int') {
            // fixme подобные преобразования должны быть в отдельных классах (Utils), пример: StringUtils.replaceNonNumbers
            value = String(item.val()).replace(/\D/g, '');
            value = value === '0' ? "" : Number(value);
        } else
            value = String(item.val());

        this.filter[name] = value;

        if (!value)
            delete this.filter[name];

        this.countFilters();
    }
    private btnDownloadState(count: number):void{
        // fixme Вместо добавления или удаления класса вручную, можно использовать toggleClass, чтобы управлять видимостью элемента в зависимости от условия
        // fixme тернарные операторы используются когда необходимо вернуть значение, а не просто ради условия в 1 строку
        // this.$numbersDownload.toggleClass('hidden', count < 10);
        count < 10 ? this.$numbersDownload.addClass('hidden') : this.$numbersDownload.removeClass('hidden');
    }
    // fixme нужны корректные и понятные названия методов (например: updateActiveFiltersAmount)
    private countFilters():void{
        this.$filtersCount.text(Object.keys(this.filter).length);
    }

    // fixme нужно корректное название методу, например: getNumbers
    load() {
        // fixme jquery возвращает promise, если прописать async: false
        // return $.ajax({
        //     method: "POST",
        //     url: "/numbers/page/" + this.page,
        //     dataType: "json",
        //     contentType: "application/json; charset=utf-8",
        //     data: JSON.stringify(this.filter),
        //     async: false
        // })

        return new Promise((success, error) => $.ajax({
            method: "POST",
            url: "/numbers/page/" + this.page,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(this.filter),
            success,
            error
        }))
    }

    // fixme корректное название метода
    async render(){
        this.$numbersDownload.addClass('hidden');
        View.showPreloader();
        try {
            // fixme метод load должен возвращать корректный результат с типом в ответе, а не any
            let data: any = await this.load();
            const count = data.list.length;
            this.btnDownloadState(count);
            this.numberCounter += count;
            this.$numbersCount.text(this.numberCounter);

            $.each(data.list, (_, {number, operator_id, region_id, tariff_cost}) => {

                // fixme работа с получением данных из window должна быть в классе storage, например RegionStorage
                let region = (window as any).regions.find((i: { id:number, name: string })  => i.id === region_id);
                // fixme выровнять html верстку
                this.$numbersList.append(`
                             <div class="number-item">
                                <div class="number-item__data flex-row">
                                     <div class="operator-icon number-item__icon" data-id="${operator_id}"></div>
                                     <div>
                                         <div class="number-item__block flex-row">
                                             <div class="number-item__number">${number}</div>
                                             <div class="number-item__expand" data-icon="chevron"></div>
                                             <div class="label number-item__city">${region.name}</div>
                                         </div>
                                         <div class="number-item__tariff">Тарифы от ${tariff_cost}</div>
                                     </div>
                                 </div>
                             </div>
                            `);
            });

            View.hidePreloader();
            // fixme название класса hidden
            this.$numbersDownload.removeClass('hide');
            if(Device.isMobile()) this.$overlay.fadeOut();
        } catch (e) {
            alert(JSON.stringify(e));
        }
    }
}

// fixme в main.ts
$(document).ready(async () => {
    const phoneNumbers: PhoneNumbers = new PhoneNumbers();
    await phoneNumbers.render();
});