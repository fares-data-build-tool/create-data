export interface PeriodProductType {
    uuid: string;
    productName: string;
    productPrice: string;
    productNameError: string;
    productPriceError: string;
}

export interface ServicesInfo {
    lineName: string;
    startDate: string;
    checked?: boolean;
}

export interface ServiceLists {
    selectedServices: ServicesInfo[];
    error: boolean;
}
