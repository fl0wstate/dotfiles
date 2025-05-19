declare function initializeLocalDataCollection(): Promise<void>;
declare class LocalDataCollection {
    static start: () => Promise<unknown>;
    static end: () => Promise<unknown>;
    static clearCache: () => Promise<unknown>;
    static saveCacheData: () => Promise<unknown>;
}
