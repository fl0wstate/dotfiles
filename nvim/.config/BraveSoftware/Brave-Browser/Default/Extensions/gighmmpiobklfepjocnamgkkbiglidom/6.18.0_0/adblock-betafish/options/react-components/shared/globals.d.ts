export const globalAbpPrefPropertyNames: {};
export const globalDataCollectionV2: typeof DataCollectionV2;
export const globalInfo: {};
export const globalMABPayment: {
    initialize(page: any): {
        id: string;
        linkId: string;
        url: any;
    };
    freeUserLogic(payInfo: any): void;
    paidUserLogic(payInfo: any): void;
    displaySyncCTAs: (settingChanged: any) => void;
    userClosedSyncCTA: () => void;
    userClickedSyncCTA: () => void;
    userClickedPremiumCTA: () => void;
};
export const globalPrefs: {};
export const globalPrefsNotifier: EventEmitter;
export const globalSend: typeof send;
export const globalSettings: {};
export const globalSettingsNotifier: EventEmitter;
export const globalSubscriptionAdapter: typeof SubscriptionAdapter;
export const globalSubscriptionsProxy: typeof SubscriptionsProxy;
