declare function initializeSubscriptionsProxy(): Promise<void>;
declare class SubscriptionsProxy {
    static add: (url: any, properties?: {}) => Promise<unknown>;
    static getSubscriptions: () => Promise<unknown>;
    static sync: (url: any) => Promise<unknown>;
    static remove: (url: any) => Promise<unknown>;
    static has: (url: any) => Promise<unknown>;
    static onAdded: ListenerSupport;
    static onChanged: ListenerSupport;
    static onRemoved: ListenerSupport;
}
