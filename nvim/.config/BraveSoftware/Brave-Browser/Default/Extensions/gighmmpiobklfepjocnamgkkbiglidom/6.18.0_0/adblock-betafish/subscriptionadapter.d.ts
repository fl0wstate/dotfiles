export default SubscriptionAdapter;
declare namespace SubscriptionAdapter {
    export { getSubscriptionInfoFromURL };
    export { getUrlFromId };
    export { unsubscribe };
    export { subscribe };
    export { getSubscriptionsMinusText };
    export { getSubscriptionsChecksum };
    export { getAllSubscriptionsMinusText };
    export { getDCSubscriptionsMinusText };
    export { getIdFromURL };
    export { isLegacyDistractionControlById };
    export { legacyDistractionControlIDs };
    export { isLanguageSpecific };
    export { getV2URLFromID };
    export { getV2URLFromURL };
}
declare function getSubscriptionInfoFromURL(searchURL: any): ewe.Recommendation | null;
declare function getUrlFromId(searchID: any): string;
declare function unsubscribe(options: any): Promise<void>;
declare function subscribe(options: any): void;
declare function getSubscriptionsMinusText(): Promise<{}>;
declare function getSubscriptionsChecksum(): Promise<string>;
declare function getAllSubscriptionsMinusText(): Promise<{}>;
declare function getDCSubscriptionsMinusText(): Promise<{}>;
declare function getIdFromURL(searchURL: any): any;
declare function isLegacyDistractionControlById(id: any): boolean;
declare const legacyDistractionControlIDs: {
    "distraction-control-video": string;
    "distraction-control-survey": string;
    "distraction-control-newsletter": string;
    "distraction-control-push": string;
};
declare function isLanguageSpecific(searchID: any): any;
declare function getV2URLFromID(searchID: any): string | null;
declare function getV2URLFromURL(searchURL: any): any;
import * as ewe from "@eyeo/webext-ad-filtering-solution";
