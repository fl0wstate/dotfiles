declare function fixFanboyFilter(item: any, adblockId: any): {
    item: any;
    adblockId: any;
};
declare function isAcceptableAds(filterList: any): boolean | undefined;
declare function isAcceptableAdsPrivacy(filterList: any): boolean | undefined;
declare function replaceAnnoyances(subsList: any): any;
declare function cleanUpSubs(subs: any): any;
declare function addLabelAndId(entry: any, adblockIdKey: any): any;
declare function addFiltersToArray(sectionedList: any, subsArray: any): any;
declare function translateIDs(id: any): string;
declare function FilterListUtil(): void;
declare namespace FilterListUtil {
    function sortFilterListArrays(newFilters: any): void;
    function getFilterListType(filterList: any): "languageFilterList" | "adblockFilterList" | "otherFilterList" | "customFilterList";
    function prepareSubscriptions(subs: any, toHighlight: any): void;
    function checkUrlForExistingFilterList(url: any): any;
    function updateSubscriptionInfoAll(): void;
    function updateSubscriptionInfoForId(adblockId: any): void;
    function updateCheckbox(filterList: any, adblockId: any): void;
}
declare function SubscriptionUtil(): void;
declare namespace SubscriptionUtil {
    function validateOverSubscription(clicked: any): boolean;
    function validateUnderSubscription(clicked: any): boolean;
    function subscribe(adblockId: any, title: any): Promise<void>;
    function unsubscribe(adblockId: any): void;
    function updateCacheValue(adblockId: any): void;
}
declare function getDefaultFilterUI(filterList: any, checkboxID: any, filterListType: any): {
    checkbox: any;
    filter: any;
};
declare function getToggleFilterUI(filterList: any, checkboxID: any): {
    checkbox: any;
    filter: any;
};
declare function CheckboxForFilterList(filterList: any, filterListType: any, index: any, container: any): void;
declare class CheckboxForFilterList {
    constructor(filterList: any, filterListType: any, index: any, container: any);
    filterListUI: any;
    container: any;
    filterList: any;
    checkBox: any;
    bindActions(): void;
    createCheckbox(isChecked: any): void;
}
declare function LanguageSelectUtil(): void;
declare namespace LanguageSelectUtil {
    function insertOption(option: any, index: any): void;
    function init(): void;
    function triggerChange(filterList: any): void;
}
declare function OptionForFilterList(filterList: any, index: any): void;
declare class OptionForFilterList {
    constructor(filterList: any, index: any);
    optionTag: any;
    get(): any;
}
declare function SectionHandler(filterListSection: any, filterListType: any): void;
declare class SectionHandler {
    constructor(filterListSection: any, filterListType: any);
    cachedSubscriptions: any;
    $section: any;
    filterListType: any;
    organize(): void;
    initSection(): void;
}
declare function CustomFilterListUploadUtil(): void;
declare namespace CustomFilterListUploadUtil {
    function performUpload(url: any, subscribeTo: any, title: any): void;
    function updateExistingFilterList(existingFilterList: any): void;
    function bindControls(): void;
}
declare function onFilterChangeHandler(action: any, items: any): Promise<void>;
declare function initPremiumFiltersCTA(): Promise<void>;
declare const FANBOY_ANNOYANCE_URL: "https://fanboy.co.nz/fanboy-annoyance.txt";
declare namespace filterListSections {
    namespace adblockFilterList {
        const array: never[];
        const $container: any;
    }
    namespace languageFilterList {
        const array_1: never[];
        export { array_1 as array };
        const $container_1: any;
        export { $container_1 as $container };
    }
    namespace otherFilterList {
        const array_2: never[];
        export { array_2 as array };
        const $container_2: any;
        export { $container_2 as $container };
    }
    namespace customFilterList {
        const array_3: never[];
        export { array_3 as array };
        const $container_3: any;
        export { $container_3 as $container };
    }
}
declare function removeBottomLine(section: any): void;
declare function mv3SubscriptionText(sub: any): string;
