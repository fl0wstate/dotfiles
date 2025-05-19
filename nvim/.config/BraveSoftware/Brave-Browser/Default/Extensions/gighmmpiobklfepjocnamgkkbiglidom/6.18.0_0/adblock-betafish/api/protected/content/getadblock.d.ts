declare function onMessage(request: any, sender: any, sendResponse: any): void;
declare function receiveMessage(event: any): Promise<void>;
declare function unsubscribeAcceptableAds(event: any): Promise<void>;
declare function handleOpenSettingsPageClick(event: any): void;
declare function getStartedWithMyAdBlock(event: any): Promise<void>;
declare const gabHostnames: string[];
declare const gabHostnamesWithProtocal: string[];
