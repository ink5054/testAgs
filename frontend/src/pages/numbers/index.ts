import { Device } from "@app/Device";
import { View } from "@app/js/compat/View";
import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';
import { StringUtils } from '@shared/util/StringUtils';
import { NumbersFilter, filtersTypes, ResponseData, NumberData, Region } from '@pages/numbers/interface';
import { regionStorage } from "@app/storage";
// fixme нужно в отдельном файле
// fixme нужно использовать форматтер ide (ctrl + alt + L)
export class PhoneNumbers {
    private $numbersList: JQuery<HTMLElement> = $('.numbers__content-list');
    private $numbersFilters: JQuery<HTMLElement> = $('.numbers__filters');
    private $numbersLoadMore: JQuery<HTMLElement> = $('.numbers__load-more > button');
    private $numbersForm: JQuery<HTMLElement> = $('.numbers__filters-form');
    private $numbersCount: JQuery<HTMLElement> = $('.numbers__count span');
    private $filtersCount: JQuery<HTMLElement> = $('.numbers__filters-btn .circle');
    private $overlay: JQuery<HTMLElement> = $('.numbers__overlay');
    private numbersLoadMoreBtn: JQuery<HTMLElement> = $('.numbers__load-more');


    private numberCounter: number = 0;
    private page: number = 1;
    private filter: NumbersFilter = {};

    constructor() {
        this.initListeners();
        // fixme 2: избегаем излишнего использования асинхронных функций

        // fixme overlay должен быть в отдельном классе
        $(document).on('touchend click', '#overlay-show', () => {
            this.$overlay.fadeIn(1000);
        });
        $(document).on('touchend click', '#overlay-hide', () => {
            this.$overlay.fadeOut(1000);
        });

        // fixme чтобы избегать "спагетти" кода, правильнее было бы вынести в отдельный метод
        new Splide('.splide', {
            perPage: 2,
            rewind: true,
            autoWidth: true,
            isNavigation: false,
            arrows: false,
            pagination: false,
        }).mount();
    }

    private initListeners():void {
        this.numbersLoadMoreBtn.on('click', 'button', ():void => {
            this.page += this.page;

            // fixme this.render().then
            this.renderNumbers().then();
        })
        this.$numbersFilters.on('click', '#numbers-search',  ():void => {
            this.numberCounter = 0;
            this.$numbersList.empty();
            this.renderNumbers().then();
        });

        this.$numbersFilters.on('change', '#numbers-free-search', (e: JQuery.ChangeEvent):void => this.getFieldValue("free_search", $(e.currentTarget), "string"));
        this.$numbersFilters.on('click', '#numbers-categories button', (e: JQuery.ClickEvent):void => this.getBtnValue('categories', $(e.currentTarget), 'list'));
        this.$numbersFilters.on('click', '#numbers-operators button', (e: JQuery.ClickEvent):void => this.getBtnValue('operators', $(e.currentTarget), 'list'));
        this.$numbersFilters.on('change', '#numbers-regions', (e: JQuery.ChangeEvent):void => this.getFieldValue("region", $(e.currentTarget), "int"));
        this.$numbersFilters.on('change', '#numbers-min_price', (e: JQuery.ChangeEvent):void => this.getFieldValue("min_price", $(e.currentTarget), "int"));
        this.$numbersFilters.on('change', '#numbers-max_price', (e: JQuery.ChangeEvent):void => this.getFieldValue("max_price", $(e.currentTarget), "int"));

        const findElementForm = (selector: string): JQuery<HTMLElement> => this.$numbersForm.find(selector);

        this.$numbersFilters.on('click', '#numbers-clear', ():void => {
            findElementForm('input').val('');
            findElementForm('select').val('0');
            findElementForm('button').removeClass('numbers__btn--active');

            this.filter = {};
            this.updateFilterCount();
        });
    }

    private setFilter(name: string, value: number | string, type: filtersTypes, state?: boolean): void {

        if (type === 'list') {
            if (!this.filter[name]) {
                this.filter[name] = [];
            }
            if (state) {
                (this.filter[name] as number[]).push(value as number);
            } else {
                this.filter[name] = (this.filter[name] as number[]).filter((v: number): boolean => v !== value);
            }
            if (!(this.filter[name] as number[]).length) {
                delete this.filter[name];
            }
        } else {
            this.filter[name] = value;
            if (!this.filter[name]) {
                delete this.filter[name];
            }
        }
        this.updateFilterCount();
    }

    private getFieldValue(name: string, item: JQuery<HTMLElement>, type: filtersTypes): void {
        let value: string | number;

        if (type === 'int') {
            value = StringUtils.replaceNonNumbers(item.val() as string);
            value = value === '0' ? "" : Number(value);
        } else {
            value = String(item.val());
        }


        this.setFilter(name, value, type);

    }

    private getBtnValue(name: string, item: JQuery<HTMLElement>, type: filtersTypes): void {
        item.toggleClass('numbers__btn--active');

        let value: number = item.find('span').data('id');
        let state: boolean = item.hasClass('numbers__btn--active');

        this.setFilter(name, value, type, state);
    }

    private btnNumbersLoadState(count: number): void {
        this.$numbersLoadMore.toggleClass('hidden', count < 10);
    }

    private updateFilterCount(): void {
        this.$filtersCount.text(Object.keys(this.filter).length);
    }


    getNumbers() {
        return $.ajax({
            method: "POST",
            url: "/numbers/page/" + this.page,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(this.filter),
            async: false
        })
    }


    async renderNumbers() {
        this.$numbersLoadMore.addClass('hidden');
        View.showPreloader();
        try {
            const data: ResponseData = await this.getNumbers();
            console.log(data);
            const count: number = data.list.length;
            this.btnNumbersLoadState(count);
            this.numberCounter += count;
            this.$numbersCount.text(this.numberCounter);

            $.each(data.list, (_: number, {number, operator_id, region_id, tariff_cost}: NumberData) => {
                console.log(window.regions)

                const region: Region = regionStorage(region_id);

                this.$numbersList.append(`
                             <div class="number-item">
                                <div class="number-item__data flex-row">
                                     <div class="operator-icon number-item__icon" data-id="${operator_id}"></div>
                                     <div>
                                         <div class="number-item__block flex-row">
                                             <div class="number-item__number">${number}</div>
                                             <div class="number-item__expand" data-icon="chevron"></div>
                                             <div class="label number-item__city">${region}</div>
                                         </div>
                                         <div class="number-item__tariff">Тарифы от ${tariff_cost}</div>
                                     </div>
                                 </div>
                             </div>
                            `);
            });

            View.hidePreloader();

            this.$numbersLoadMore.removeClass('hidden');
            if (Device.isMobile()) this.$overlay.fadeOut();
        } catch (e) {
            alert(JSON.stringify(e));
        }
    }
}