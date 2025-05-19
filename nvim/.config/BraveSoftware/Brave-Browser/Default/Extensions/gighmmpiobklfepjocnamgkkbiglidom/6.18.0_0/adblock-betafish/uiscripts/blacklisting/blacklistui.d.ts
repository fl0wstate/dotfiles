declare function selectorFromElm(el: any): string;
declare function BlacklistUi(clickedItem: any, advancedUser: any, isActiveLicense: any, showBlacklistCTA: any, $base: any, addCustomFilterRandomName: any): void;
declare class BlacklistUi {
    constructor(clickedItem: any, advancedUser: any, isActiveLicense: any, showBlacklistCTA: any, $base: any, addCustomFilterRandomName: any);
    cancelled: boolean;
    currentStep: number;
    callbacks: {
        cancel: never[];
        block: never[];
    };
    clickedItem: any;
    isActiveLicense: any;
    advancedUser: any;
    showBlacklistCTA: any;
    $dialog: any;
    clickWatcher: any;
    addCustomFilterRandomName: any;
    reset(): void;
    cancel(callback: any): void;
    block(callback: any): void;
    fire(eventName: any, arg: any): void;
    onClose(): void;
    CloseBtnClickHandler(): void;
    handleChange(): void;
    last: any;
    blockListViaCSS(selectors: any): void;
    show(showBackButton: any): void;
    chain: ElementChain | undefined;
    buildPage1(showBackButton: any): void;
    buildPage2(): void;
    buildPage3(): void;
    redrawPage1(): void;
    makeFilter(): string;
    redrawPage2(): void;
    preview(selector: any): void;
}
declare namespace BlacklistUi {
    function ellipsis(valueToTruncate: any, maxSize: any): any;
}
