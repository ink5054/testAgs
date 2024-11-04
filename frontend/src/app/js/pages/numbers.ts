"use strict";

import { Device } from "@app/js/compat/Device";
import { View } from "@app/js/compat/View";
import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

interface NumbersFilter {
    [key: string]: any
}

class PhoneNumbers {
    $numbersList = $('.numbers__content-list');
    $numbersDownload = $('.numbers__download-btn > button');
    $numbersForm = $('.numbers__filters-form');
    $numbersCount = $('.numbers__count span');
    $filtersCount = $('.numbers__filters-btn .circle');
    $numbersContainerLeft = $('.numbers__container-left');

    $overlay: JQuery<HTMLElement> = null;
    numberCounter: number = 0;
    page: number = 1;

    private filter: NumbersFilter = {};
    constructor(){
        $(document).on('click', '.numbers__download-btn > button', async() => {
            this.page += this.page;
            await this.render();
        })
        $(document).on('click', '#numbers-search',  async() =>{
            this.numberCounter = 0;
            this.$numbersList.empty();
            await this.render();
        });

        $(document).on('change', '#numbers-free-search',  e => this.setFilter("free_search", $(e.currentTarget), "string"));
        $(document).on('click', '#numbers-categories button',  (e) => this.setFilter('categories', $(e.currentTarget), 'list'));
        $(document).on('click', '#numbers-operators button',  (e) => this.setFilter('operators', $(e.currentTarget), 'list'));
        $(document).on('change', '#numbers-regions',  e => this.setFilter("region", $(e.currentTarget),  "int"));
        $(document).on('change', '#numbers-min_price',  e => this.setFilter("min_price", $(e.currentTarget), "int"));
        $(document).on('change', '#numbers-max_price',  e => this.setFilter("max_price", $(e.currentTarget), "int"));

        $(document).on('click', '#numbers-clear',  () =>{
            this.$numbersForm.find('input').val('');
            this.$numbersForm.find('select').val('0');
            this.$numbersForm.find('button').removeClass('numbers__active--violet');
            this.filter = {};
            this.countFilters();
        });

        if(Device.isMobile()){
            this.$numbersContainerLeft.addClass('overlay');
            this.$overlay = $('.overlay');

            $(document).on('touchend click', '#overlay-show',  () =>{
                this.$overlay.fadeIn(1000);
            });
            $(document).on('touchend click', '#overlay-hide',  () =>{
                this.$overlay.fadeOut(1000);
            });
        }
        new Splide('.splide', {
            perPage: 2,
            rewind : true,
            autoWidth: true,
            isNavigation: false,
            arrows : false,
            pagination: false,
        }).mount();
    }
    private setFilter(name: string, item: JQuery<HTMLElement>, type: string|null = null) {

        let value;
        if (type === 'list') {
            item.toggleClass('numbers__active--violet');

            let value = item.find('span').data('id');

            if (!this.filter[name])
                this.filter[name] = [];

            if (item.hasClass('numbers__active--violet'))
                this.filter[name].push(value);
            else
                this.filter[name] = this.filter[name].filter((v: number) => v !== value);

            if (!this.filter[name].length)
                delete this.filter[name];

            this.countFilters();
            return;
        } else if (type === 'int') {
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
        count < 10 ? this.$numbersDownload.addClass('hidden') : this.$numbersDownload.removeClass('hidden');
    }
    private countFilters():void{
        this.$filtersCount.text(Object.keys(this.filter).length);
    }
    load() {
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
    async render(){
        this.$numbersDownload.addClass('hidden');
        View.showPreloader();
        try {
            let data: any = await this.load();
            const count = data.list.length;
            this.btnDownloadState(count);
            this.numberCounter += count;
            this.$numbersCount.text(this.numberCounter);

            $.each(data.list, (_, {number, operator_id, region_id, tariff_cost}) => {

                let region = (window as any).regions.find((i: { id:number, name: string })  => i.id === region_id);
                this.$numbersList.append(`<div class="number-item">
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
                             </div>`);
            });

            View.hidePreloader();
            this.$numbersDownload.removeClass('hide');
            if(Device.isMobile()) this.$overlay.fadeOut();
        } catch (e) {
            alert(JSON.stringify(e));
        }
    }
}

$(document).ready(async () => {
    const phoneNumbers: PhoneNumbers = new PhoneNumbers();
    await phoneNumbers.render();
});