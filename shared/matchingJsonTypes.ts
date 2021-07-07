export interface SalesOfferPackage {
    id?: string;
    name: string;
    description: string;
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
    price?: string;
}
