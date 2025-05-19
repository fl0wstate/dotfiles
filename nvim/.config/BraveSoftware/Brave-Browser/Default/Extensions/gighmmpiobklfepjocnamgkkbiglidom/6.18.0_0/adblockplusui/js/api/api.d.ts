import { addDisconnectListener, addMessageListener, removeDisconnectListener } from "./api.port";
import type { AppGetWhat, AppOpenWhat, DisplayMethod, ListenFilters, ExtensionInfo, PrefsGetWhat, QueryParams, SubscriptionOptions } from "./api.types";
export declare const app: {
    get: <T = string>(what: AppGetWhat) => Promise<T>;
    getInfo: () => Promise<ExtensionInfo>;
    listen: (filter: ListenFilters) => void;
    open: (what: AppOpenWhat) => Promise<string>;
};
export declare const ctalinks: {
    get: (link: string, queryParams?: QueryParams) => Promise<string>;
};
export declare const doclinks: {
    get: (link: string) => Promise<string>;
};
export declare const filters: {
    get: () => Promise<string>;
    listen: (filter: ListenFilters) => void;
};
export declare const notifications: {
    get: (displayMethod: DisplayMethod) => Promise<string>;
    seen: () => Promise<string>;
};
export declare const prefs: {
    get: (key: PrefsGetWhat) => Promise<string>;
    listen: (filter: ListenFilters) => void;
};
export declare const premium: {
    activate: (userId: string) => Promise<string>;
    get: () => Promise<string>;
    listen: (filter: ListenFilters) => void;
};
export declare const requests: {
    listen: (filter: ListenFilters, tabId: string) => void;
};
export declare const stats: {
    getBlockedPerPage: (tab: string) => Promise<string>;
    getBlockedTotal: () => Promise<string>;
    listen: (filter: ListenFilters) => void;
};
export declare const subscriptions: {
    get: (options: SubscriptionOptions) => Promise<string>;
    getInitIssues: () => Promise<string>;
    listen: (filter: ListenFilters) => void;
};
declare const api: {
    addDisconnectListener: typeof addDisconnectListener;
    addListener: typeof addMessageListener;
    app: {
        get: <T = string>(what: AppGetWhat) => Promise<T>;
        getInfo: () => Promise<ExtensionInfo>;
        listen: (filter: ListenFilters) => void;
        open: (what: AppOpenWhat) => Promise<string>;
    };
    ctalinks: {
        get: (link: string, queryParams?: QueryParams) => Promise<string>;
    };
    doclinks: {
        get: (link: string) => Promise<string>;
    };
    filters: {
        get: () => Promise<string>;
        listen: (filter: ListenFilters) => void;
    };
    notifications: {
        get: (displayMethod: DisplayMethod) => Promise<string>;
        seen: () => Promise<string>;
    };
    prefs: {
        get: (key: PrefsGetWhat) => Promise<string>;
        listen: (filter: ListenFilters) => void;
    };
    premium: {
        activate: (userId: string) => Promise<string>;
        get: () => Promise<string>;
        listen: (filter: ListenFilters) => void;
    };
    requests: {
        listen: (filter: ListenFilters, tabId: string) => void;
    };
    removeDisconnectListener: typeof removeDisconnectListener;
    subscriptions: {
        get: (options: SubscriptionOptions) => Promise<string>;
        getInitIssues: () => Promise<string>;
        listen: (filter: ListenFilters) => void;
    };
    stats: {
        getBlockedPerPage: (tab: string) => Promise<string>;
        getBlockedTotal: () => Promise<string>;
        listen: (filter: ListenFilters) => void;
    };
};
export default api;
