declare function parseChannelName(channelNameToParse: any): string;
declare function updateURLWrapped(channelName: any): void;
declare function sendMessageToCS(toContentScriptEventName: any, channelName: any): void;
declare function preProcessCheck(input: any, params: any, toContentScriptEventName: any): void;
declare function postRequestCheck(response: any, toContentScriptEventName: any): void;
declare function wrapFetch({ toContentScriptEventName }: {
    toContentScriptEventName: any;
}): void;
declare function initWithParams(): void;
declare function start(): void;
