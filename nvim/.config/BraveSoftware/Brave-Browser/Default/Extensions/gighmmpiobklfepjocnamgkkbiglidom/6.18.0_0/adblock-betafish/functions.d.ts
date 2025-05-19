declare function debounced(delay: any, fn: any): (...args: any[]) => void;
declare function extend(primaryArg: any, ...args: any[]): any;
declare const VERBOSE_DEBUG: false;
declare const THIRTY_MINUTES_IN_MILLISECONDS: 1800000;
declare function logging(enabled: any): void;
declare function onReady(callback: any): void;
declare function translate(messageName: any, substitutions: any): string;
declare function splitMessageWithReplacementText(rawMessageText: any, messageID: any): {
    anchorPrefixText: any;
    anchorText: any;
    anchorPostfixText: any;
} | {
    error: string;
};
declare function processReplacementChildren($el: any, replacementText: any, messageId: any): void;
declare function processReplacementChildrenInContent($el: any): void;
declare function determineUserLanguage(): string;
declare function setLangAndDirAttributes(el: any): void;
declare function isLangRTL(language: any): any;
declare function localizePage(): void;
declare const parseUriRegEx: RegExp;
declare function parseUri(url: any): {};
declare namespace parseUri {
    function parseSearch(searchQuery: any): {};
    function secondLevelDomainOnly(domain: any, keepDot: any): any;
}
declare const sessionStorageMap: Map<any, any>;
declare function sessionStorageGet(key: any): any;
declare function sessionStorageSet(key: any, value: any): void;
declare function storageGet(key: any): any;
declare function storageSet(key: any, value: any): void;
declare function chromeStorageSetHelper(key: any, value: any, callback: any): void;
declare function chromeStorageGetHelper(storageKey: any): Promise<any>;
declare function chromeStorageDeleteHelper(key: any): Promise<void>;
declare function selected(selector: any, handler: any): (event: any) => void;
declare function selectedOff(selector: any, clickHandler: any, keydownHandler: any): void;
declare function selectedOnce(element: any, handler: any): void;
declare function i18nJoin(...args: any[]): string;
declare function isEmptyObject(obj: any): boolean;
declare function setStorageCookie(name: any, value: any, millisecondsUntilExpire: any): void;
declare function getStorageCookie(name: any): any;
declare let customImageSwapMimeType: string;
declare const firefoxMatch: RegExpMatchArray | null;
declare function base64toBlob(base64Data: any): Blob;
declare function ellipsis(valueToTruncate: any, maxSize: any): any;
declare let port: any;
declare function connectUIPort(callback: any): void;
