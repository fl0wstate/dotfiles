declare function initializeLicense(): Promise<void>;
declare function initializeChannels(): Promise<void>;
declare function initializePremiumPort(): Promise<void>;
declare const licenseNotifier: EventEmitter;
declare let License: any;
declare let localLicense: {};
declare const channelsNotifier: EventEmitter;
declare class channels {
    static getIdByName: (name: any) => any;
    static getGuide: () => any;
    static isAnyEnabled: () => any;
    static isCustomChannelEnabled: () => any;
    static initializeListeners: () => any;
    static disableAllChannels: () => any;
    static setEnabled: (channelId: any, enabled: any) => any;
}
declare class customChannel {
    static isMaximumAllowedImages: () => any;
    static getListings: () => any;
    static addCustomImage: (imageInfo: any) => any;
    static removeListingByURL: (url: any) => any;
}
declare class SyncService {
    static enableSync: (initialGet: any) => any;
    static disableSync: (removeName: any) => any;
    static getLastGetStatusCode: () => any;
    static getLastPostStatusCode: () => any;
    static resetAllErrors: () => any;
    static processUserSyncRequest: () => any;
    static getAllExtensionNames: () => any;
    static getCurrentExtensionName: () => any;
    static removeExtensionName: (dataDeviceName: any, dataExtensionGUID: any) => any;
    static setCurrentExtensionName: (name: any) => any;
    static syncNotifier: EventEmitter;
}
