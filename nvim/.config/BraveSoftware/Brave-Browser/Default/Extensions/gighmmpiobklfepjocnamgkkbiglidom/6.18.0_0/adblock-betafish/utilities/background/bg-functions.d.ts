export function extend(primaryArg: any, ...args: any[]): any;
export function log(): void;
export function logging(enabled: any): void;
export function determineUserLanguage(): string;
export function parseUri(url: any): {};
export namespace parseUri {
    function parseSearch(searchQuery: any): {};
    function secondLevelDomainOnly(domain: any, keepDot: any): any;
}
export function sessionStorageGet(key: any): any;
export function sessionStorageSet(key: any, value: any): void;
export function storageGet(key: any): any;
export function storageSet(key: any, value: any): void;
export function chromeStorageSetHelper(key: any, value: any, callback: any): void;
export function chromeStorageGetHelper(storageKey: any): Promise<any>;
export function chromeStorageDeleteHelper(key: any): Promise<void>;
export function migrateData(key: any, parseData: any): Promise<any>;
export function reloadOptionsPageTabs(): void;
export function isEmptyObject(obj: any): boolean;
export function createFilterMetaData(origin: any): {
    created: number;
};
