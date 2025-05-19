import type Browser from "webextension-polyfill";
export declare type AppGetWhat = "acceptableAdsUrl" | "acceptableAdsPrivacyUrl" | "addonName" | "addonVersion" | "application" | "applicationVersion" | "ctalink" | "doclink" | "features" | "localeInfo" | "os" | "platform" | "platformVersion" | "recommendations" | "senderId";
export declare type AppOpenWhat = "options";
interface AppReference {
    what: string;
}
export declare type DisplayMethod = "critical" | "information" | "newtab" | "normal" | "relentless";
interface GetBlockedPerPageOptions {
    tab: string;
}
interface GetCtaLink {
    link: string;
    queryParams?: QueryParams;
    what: "ctalink";
}
interface GetDocLink {
    link: string;
    what: "doclink";
}
interface GetNotificationOptions {
    displayMethod: DisplayMethod;
}
interface GetPrefsOptions {
    key: string;
}
export declare type ListenFilters = string[];
export declare type ListenProps = {
    filter: string[];
    tabId: string;
    type: "requests";
} | {
    filter: string[];
    type: "app" | "filters" | "prefs" | "premium" | "stats" | "subscriptions";
};
export declare type ListenTypes = "app" | "filters" | "prefs" | "premium" | "requests" | "stats" | "subscriptions";
export interface MessageProps {
    [key: string]: any;
    type: string;
}
export interface PlatformToStore {
    chromium: "chrome";
    edgehtml: "edge";
    gecko: "firefox";
}
export declare type Platform = keyof PlatformToStore;
export interface ExtensionInfo {
    application: string;
    platform: Platform;
    store: Store;
}
export declare type Port = Browser.Runtime.Port | null;
export declare type PortEventListener = (options?: MessageProps) => void;
export declare type PrefsGetWhat = "currentVersion" | "documentation_link" | "blocked_total" | "show_statsinicon" | "shouldShowBlockElementMenu" | "ui_warn_tracking" | "show_devtools_panel" | "suppress_first_run_page" | "additional_subscriptions" | "last_updates_page_displayed" | "elemhide_debug" | "remote_first_run_page_url" | "recommend_language_subscriptions" | "premium_manage_page_url" | "premium_upgrade_page_url";
export interface PremiumActivateOptions {
    userId: string;
}
export interface QueryParams {
    source?: string;
}
export declare type SendArgs = AppReference | GetBlockedPerPageOptions | GetCtaLink | GetDocLink | GetNotificationOptions | GetPrefsOptions | PremiumActivateOptions | SubscriptionOptions;
export declare type SendType = "app.get" | "app.open" | "filters.get" | "notifications.get" | "notifications.seen" | "prefs.get" | "premium.activate" | "premium.get" | "stats.getBlockedPerPage" | "stats.getBlockedTotal" | "subscriptions.get" | "subscriptions.getInitIssues";
export declare type Store = PlatformToStore[Platform] | "edge" | "opera";
export interface SubscriptionOptions {
    disabledFilters?: boolean;
    ignoreDisabled?: boolean;
}
export {};
