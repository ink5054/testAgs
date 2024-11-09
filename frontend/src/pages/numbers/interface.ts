export interface NumbersFilter {
    [key: string]: number[] | string | number;
}

export type filtersTypes =
    | 'list'
    | 'int'
    | 'string'


export interface NumberData {
    id: number;
    number: string;
    operator_id: number;
    category_id: number;
    region_id: number;
    tariff_cost: number;
}

export interface ResponseData {
    list: NumberData[];
}

export interface Region {
    readonly id: number;
    readonly name: string;
}