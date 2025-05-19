declare const toContentScriptEventName: string;
declare const fromContentScriptEventName: string;
declare let gChannelName: string;
declare let gNextVideoId: string;
declare function updateURLWithYouTubeChannelName(sendResponse: any): void;
declare function onMessage(request: any, sender: any, sendResponse: any): void;
declare function injectScriptIntoTabJS({ src, name, params }: {
    src: any;
    name?: string | undefined;
    params?: {} | undefined;
}): void;
declare function runOnYT(): void;
declare function addScript(): Promise<void>;
declare function init(): Promise<void>;
