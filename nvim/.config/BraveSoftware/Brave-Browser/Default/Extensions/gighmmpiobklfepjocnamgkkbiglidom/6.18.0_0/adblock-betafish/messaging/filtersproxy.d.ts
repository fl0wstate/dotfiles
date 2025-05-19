declare function initializeFiltersProxy(): Promise<void>;
declare class FiltersProxy {
    static add: (text: any, origin: any) => Promise<unknown>;
    static remove: (filters: any) => Promise<unknown>;
    static validate: (text: any) => Promise<unknown>;
    static normalize: (text: any) => Promise<unknown>;
    static getUserFilters: () => Promise<unknown>;
    static onAdded: ListenerSupport;
    static onChanged: ListenerSupport;
    static onRemoved: ListenerSupport;
}
