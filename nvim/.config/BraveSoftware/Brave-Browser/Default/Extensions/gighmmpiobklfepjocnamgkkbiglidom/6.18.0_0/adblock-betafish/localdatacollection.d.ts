export default LocalDataCollection;
declare namespace LocalDataCollection {
    export { EXT_STATS_KEY };
    export function start(): Promise<any>;
    export function end(): Promise<any>;
    export { clearCache };
    export function getCache(): {
        domains: {};
    };
    export { saveCacheData };
    export { easyPrivacyURL };
    export function exportRawStats(): Promise<unknown>;
    export function getRawStatsSize(): Promise<number>;
    export function importFilterStats(filterStatsArray: any): Promise<any>;
}
declare function clearCache(): void;
declare function saveCacheData(): Promise<any>;
declare const easyPrivacyURL: "https://easylist-downloads.adblockplus.org/easyprivacy.txt" | "https://easylist-downloads.adblockplus.org/v3/full/easyprivacy.txt";
