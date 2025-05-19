declare const toContentScriptEventName: string;
declare function injectScriptIntoTabJS({ src, name, params }: {
    src: any;
    name?: string | undefined;
    params?: {} | undefined;
}): void;
declare function runOnTwitch(): void;
declare function startTwitchChannelNameCapture(): Promise<void>;
