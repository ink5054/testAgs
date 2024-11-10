import {Device} from "@app/Device";
import * as Preloader from "@widgets/preloader";
import createSplideInstance from '@widgets/splide';
import {StringUtils} from '@shared/util/StringUtils';
import {NumbersFilter, filtersTypes, ResponseData, NumberData, Region} from '@pages/numbers/types/Numbers.interface';
import {regionStorage} from "@app/storage";
import {showOverlay, hideOverlay} from '@widgets/overlay';
import {request} from "@shared/api/request";

// нужно использовать форматтер ide (ctrl + alt + L)
export class PhoneNumbers {
    private $numbersContent: JQuery<HTMLElement> = $('.numbers__content');
    private $numbersList: JQuery<HTMLElement> = $('.numbers__content-list');
    private $numbersFilters: JQuery<HTMLElement> = $('.numbers__filters');
    private $numbersLoadMoreBtn: JQuery<HTMLElement> = $('.numbers__load-more');
    private $numbersForm: JQuery<HTMLElement> = $('.numbers__filters-form');
    private $numbersCount: JQuery<HTMLElement> = $('.numbers__count span');
    private $filtersCount: JQuery<HTMLElement> = $('.numbers__filters-btn .circle');
    private $overlay: JQuery<HTMLElement> = $('.numbers__overlay');

    private numberCounter: number = 0;
    private page: number = 1;
    private filter: NumbersFilter = {};

    constructor() {
        this.initListeners();
        createSplideInstance('.splide');
        if (!Device.isMobile()) this.$overlay.removeClass('overlay');
    }

    private initListeners(): void {
        this.$numbersLoadMoreBtn.on('click', 'button', (): void => {
            this.page += this.page;
            this.renderNumbers();
        })
        this.$numbersFilters.on('click', '#numbers-search', (): void => {
            this.numberCounter = 0;
            this.$numbersList.empty();
            this.renderNumbers();
        });

        this.$numbersFilters.on('change', '#numbers-free-search', (e: JQuery.ChangeEvent): void => this.getFieldValue("free_search", $(e.currentTarget), "string"));
        this.$numbersFilters.on('click', '#numbers-categories button', (e: JQuery.ClickEvent): void => this.getBtnValue('categories', $(e.currentTarget), 'list'));
        this.$numbersFilters.on('click', '#numbers-operators button', (e: JQuery.ClickEvent): void => this.getBtnValue('operators', $(e.currentTarget), 'list'));
        this.$numbersFilters.on('change', '#numbers-regions', (e: JQuery.ChangeEvent): void => this.getFieldValue("region", $(e.currentTarget), "int"));
        this.$numbersFilters.on('change', '#numbers-min_price', (e: JQuery.ChangeEvent): void => this.getFieldValue("min_price", $(e.currentTarget), "int"));
        this.$numbersFilters.on('change', '#numbers-max_price', (e: JQuery.ChangeEvent): void => this.getFieldValue("max_price", $(e.currentTarget), "int"));

        const findElementForm = (selector: string): JQuery<HTMLElement> => this.$numbersForm.find(selector);


        this.$numbersFilters.on('click', '#numbers-clear', (): void => {
            findElementForm('input').val('');
            findElementForm('select').val('0');
            findElementForm('button').removeClass('numbers__btn--active');

            this.filter = {};
            this.updateFilterCount();
        });

        this.$numbersContent.on('touchend click', '.numbers-overlay--show', showOverlay);
        this.$numbersFilters.on('touchend click', '.numbers-overlay--hide', hideOverlay);
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
        console.log(count);
        this.$numbersLoadMoreBtn.toggleClass('hidden', count < 10);
    }

    private updateFilterCount(): void {
        this.$filtersCount.text(Object.keys(this.filter).length);
    }

    private getNumbers() {
        return request("POST", this.page, this.filter);
    }

    renderNumbers():void {
        this.$numbersLoadMoreBtn.addClass('hidden');
        Preloader.show();

        this.getNumbers().then((response: ResponseData):void => {
            const data: ResponseData = response;

            const count: number = data.list.length;
            this.btnNumbersLoadState(count);
            this.numberCounter += count;
            this.$numbersCount.text(this.numberCounter);

            $.each(data.list, (_: number, {number, operator_id, region_id, tariff_cost}: NumberData) => {


                const region: Region = regionStorage(region_id);

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
        })
            .catch((error: any):void => {
                console.error('Error:', error);
            })
            .always(():void => {
                Preloader.hide();
                if (Device.isMobile()) hideOverlay();
            });
    }
}