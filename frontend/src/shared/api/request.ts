import {requestData} from "@shared/api/types/Request.interface";

export function request(method: string, page: number, data: requestData){
    return $.ajax({
        method: method,
        url: `/numbers/page/${page}`,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        async: true
    });
}