declare function getDefaultPFFilterUI(entry: any, isActiveLicense: any): Promise<any>;
declare const premiumFiltersUIitems: ({
    id: string;
    title: string;
    description: string;
    disclaimer: string;
    urlToOpen: string;
    imageURL: string;
    topLineClass: string;
} | {
    id: string;
    title: string;
    description: string;
    disclaimer: string;
    imageURL: string;
    topLineClass: string;
    urlToOpen?: undefined;
})[];
declare function preparePFItems(isActiveLicense: any): Promise<void>;
declare function updateCheckbox(item: any, isChecked: any): void;
declare function onPremiumSubAdded(items: any): void;
declare function onPremiumSubRemoved(items: any): void;
