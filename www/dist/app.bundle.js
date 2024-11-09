"use strict";(self.webpackChunkwebpack=self.webpackChunkwebpack||[]).push([[524],{466:()=>{},108:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Device=void 0,t.Device=class{static isMobile(){return navigator.userAgent.includes("Mobile")||window.innerWidth<500}}},916:function(e,t,i){var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(r,s){function o(e){try{u(n.next(e))}catch(e){s(e)}}function a(e){try{u(n.throw(e))}catch(e){s(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(o,a)}u((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=i(290);$(document).ready((()=>n(void 0,void 0,void 0,(function*(){const e=new r.PhoneNumbers;yield e.renderNumbers()}))))},52:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.View=void 0,t.View=class{static showPreloader(){$(".loader").removeClass("loader--visibility")}static hidePreloader(){$(".loader").addClass("loader--visibility")}}},933:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.regionStorage=void 0,t.regionStorage=function(e){return window.regions.find((t=>t.id===e))}},290:function(e,t,i){var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(r,s){function o(e){try{u(n.next(e))}catch(e){s(e)}}function a(e){try{u(n.throw(e))}catch(e){s(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(o,a)}u((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.PhoneNumbers=void 0;const r=i(108),s=i(52),o=i(23);i(729);const a=i(971),u=i(933);t.PhoneNumbers=class{constructor(){this.$numbersList=$(".numbers__content-list"),this.$numbersFilters=$(".numbers__filters"),this.$numbersLoadMore=$(".numbers__load-more > button"),this.$numbersForm=$(".numbers__filters-form"),this.$numbersCount=$(".numbers__count span"),this.$filtersCount=$(".numbers__filters-btn .circle"),this.$overlay=$(".numbers__overlay"),this.numbersLoadMoreBtn=$(".numbers__load-more"),this.numberCounter=0,this.page=1,this.filter={},this.initListeners(),$(document).on("touchend click","#overlay-show",(()=>{this.$overlay.fadeIn(1e3)})),$(document).on("touchend click","#overlay-hide",(()=>{this.$overlay.fadeOut(1e3)})),new o.Splide(".splide",{perPage:2,rewind:!0,autoWidth:!0,isNavigation:!1,arrows:!1,pagination:!1}).mount()}initListeners(){this.numbersLoadMoreBtn.on("click","button",(()=>{this.page+=this.page,this.renderNumbers().then()})),this.$numbersFilters.on("click","#numbers-search",(()=>{this.numberCounter=0,this.$numbersList.empty(),this.renderNumbers().then()})),this.$numbersFilters.on("change","#numbers-free-search",(e=>this.getFieldValue("free_search",$(e.currentTarget),"string"))),this.$numbersFilters.on("click","#numbers-categories button",(e=>this.getBtnValue("categories",$(e.currentTarget),"list"))),this.$numbersFilters.on("click","#numbers-operators button",(e=>this.getBtnValue("operators",$(e.currentTarget),"list"))),this.$numbersFilters.on("change","#numbers-regions",(e=>this.getFieldValue("region",$(e.currentTarget),"int"))),this.$numbersFilters.on("change","#numbers-min_price",(e=>this.getFieldValue("min_price",$(e.currentTarget),"int"))),this.$numbersFilters.on("change","#numbers-max_price",(e=>this.getFieldValue("max_price",$(e.currentTarget),"int")));const e=e=>this.$numbersForm.find(e);this.$numbersFilters.on("click","#numbers-clear",(()=>{e("input").val(""),e("select").val("0"),e("button").removeClass("numbers__btn--active"),this.filter={},this.updateFilterCount()}))}setFilter(e,t,i,n){"list"===i?(this.filter[e]||(this.filter[e]=[]),n?this.filter[e].push(t):this.filter[e]=this.filter[e].filter((e=>e!==t)),this.filter[e].length||delete this.filter[e]):(this.filter[e]=t,this.filter[e]||delete this.filter[e]),this.updateFilterCount()}getFieldValue(e,t,i){let n;"int"===i?(n=a.StringUtils.replaceNonNumbers(t.val()),n="0"===n?"":Number(n)):n=String(t.val()),this.setFilter(e,n,i)}getBtnValue(e,t,i){t.toggleClass("numbers__btn--active");let n=t.find("span").data("id"),r=t.hasClass("numbers__btn--active");this.setFilter(e,n,i,r)}btnNumbersLoadState(e){this.$numbersLoadMore.toggleClass("hidden",e<10)}updateFilterCount(){this.$filtersCount.text(Object.keys(this.filter).length)}getNumbers(){return $.ajax({method:"POST",url:"/numbers/page/"+this.page,dataType:"json",contentType:"application/json; charset=utf-8",data:JSON.stringify(this.filter),async:!1})}renderNumbers(){return n(this,void 0,void 0,(function*(){this.$numbersLoadMore.addClass("hidden"),s.View.showPreloader();try{const e=yield this.getNumbers();console.log(e);const t=e.list.length;this.btnNumbersLoadState(t),this.numberCounter+=t,this.$numbersCount.text(this.numberCounter),$.each(e.list,((e,{number:t,operator_id:i,region_id:n,tariff_cost:r})=>{console.log(window.regions);const s=(0,u.regionStorage)(n);this.$numbersList.append(`\n                             <div class="number-item">\n                                <div class="number-item__data flex-row">\n                                     <div class="operator-icon number-item__icon" data-id="${i}"></div>\n                                     <div>\n                                         <div class="number-item__block flex-row">\n                                             <div class="number-item__number">${t}</div>\n                                             <div class="number-item__expand" data-icon="chevron"></div>\n                                             <div class="label number-item__city">${s}</div>\n                                         </div>\n                                         <div class="number-item__tariff">Тарифы от ${r}</div>\n                                     </div>\n                                 </div>\n                             </div>\n                            `)})),s.View.hidePreloader(),this.$numbersLoadMore.removeClass("hidden"),r.Device.isMobile()&&this.$overlay.fadeOut()}catch(e){alert(JSON.stringify(e))}}))}}},971:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.StringUtils=void 0,t.StringUtils=class{static replaceNonNumbers(e){return e.replace(/\D/g,"")}}}},e=>{var t=t=>e(e.s=t);e.O(0,[83],(()=>(t(916),t(466)))),e.O()}]);