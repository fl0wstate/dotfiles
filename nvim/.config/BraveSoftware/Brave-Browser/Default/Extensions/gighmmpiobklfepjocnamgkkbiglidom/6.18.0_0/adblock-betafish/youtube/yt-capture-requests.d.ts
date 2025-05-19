declare function parseChannelName(channelNameToParse: any): string;
declare function updateURLWrapped(channelName: any): void;
declare function postRequestCheck(response: any, toContentScriptEventName: any): void;
declare function wrapFetch(toContentScriptEventName: any): void;
declare function addContentScriptListeners(toContentScriptEventName: any, fromContentScriptEventName: any): void;
declare function addYtListeners(toContentScriptEventName: any): void;
declare function captureRequests({ toContentScriptEventName, fromContentScriptEventName }: {
    toContentScriptEventName: any;
    fromContentScriptEventName: any;
}): void;
declare function initWithParams(): void;
declare function start(): void;
