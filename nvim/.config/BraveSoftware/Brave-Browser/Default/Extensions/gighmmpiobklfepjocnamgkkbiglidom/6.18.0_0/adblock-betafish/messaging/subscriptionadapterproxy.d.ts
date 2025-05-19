declare class SubscriptionAdapter {
    static getIdFromURL: (url: any) => Promise<unknown>;
    static getAllSubscriptionsMinusText: () => Promise<unknown>;
    static isLanguageSpecific: (adblockId: any) => Promise<unknown>;
    static getSubscriptionsMinusText: () => Promise<unknown>;
}
