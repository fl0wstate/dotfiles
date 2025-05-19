declare function initializeMABPayment(): void;
declare let userClosedSyncCTA: any;
declare let userSawSyncCTA: any;
declare let pageReloadedOnSettingChange: any;
declare namespace MABPayment {
    function initialize(page: any): {
        id: string;
        linkId: string;
        url: any;
    };
    function initialize(page: any): {
        id: string;
        linkId: string;
        url: any;
    };
    function freeUserLogic(payInfo: any): void;
    function freeUserLogic(payInfo: any): void;
    function paidUserLogic(payInfo: any): void;
    function paidUserLogic(payInfo: any): void;
    function displaySyncCTAs(settingChanged: any): void;
    function userClosedSyncCTA(): void;
    function userClickedSyncCTA(): void;
    function userClickedPremiumCTA(): void;
}
