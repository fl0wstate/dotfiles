declare function getURLFromElement(element: any): any;
declare const hostname: string;
declare let totalSwaps: number;
declare const hideElements: any[];
declare const hiddenElements: any[];
declare const cssRules: any[];
declare const minDimension: 60;
declare const typeMap: Map<string, string>;
declare const imageSizesMap: Map<string, number>;
declare const deferred: Map<any, any>;
declare let urls: any;
declare function queryDOM(selectorText: any): HTMLCollectionOf<Element> | HTMLElement[] | NodeListOf<any>;
declare namespace imageSwap {
    function replaceSection(data: {
        el: Node;
        blocked?: boolean | undefined;
        size?: Object | undefined;
        dimension?: number | undefined;
        computedStyle?: CSSStyleDeclaration | undefined;
    }, callback: Function): void;
    function replaceSection(data: {
        el: Node;
        blocked?: boolean | undefined;
        size?: Object | undefined;
        dimension?: number | undefined;
        computedStyle?: CSSStyleDeclaration | undefined;
    }, callback: Function): void;
    function fit(pic: any, target: any): any;
    function fit(pic: any, target: any): any;
    function rotate(objectToRotate: any): void;
    function rotate(objectToRotate: any): void;
    function dim(data: any, prop: any): number | undefined;
    function dim(data: any, prop: any): number | undefined;
    function parentDim(data: any, prop: any): number | undefined;
    function parentDim(data: any, prop: any): number | undefined;
    function getSize(data: any): {
        x: number | undefined;
        y: number | undefined;
        position: any;
    };
    function getSize(data: any): {
        x: number | undefined;
        y: number | undefined;
        position: any;
    };
    function placementFor(data: any, callback: any): false | undefined;
    function placementFor(data: any, callback: any): false | undefined;
    function createNewPicContainer(placement: any): {
        container: HTMLDivElement;
        imageWrapper: HTMLDivElement;
        image: HTMLDivElement;
        overlay: HTMLDivElement;
        logo: HTMLImageElement;
        icons: HTMLDivElement;
        closeIcon: HTMLElement;
        settingsIcon: HTMLElement;
        seeIcon: HTMLElement;
    };
    function createNewPicContainer(placement: any): {
        container: HTMLDivElement;
        imageWrapper: HTMLDivElement;
        image: HTMLDivElement;
        overlay: HTMLDivElement;
        logo: HTMLImageElement;
        icons: HTMLDivElement;
        closeIcon: HTMLElement;
        settingsIcon: HTMLElement;
        seeIcon: HTMLElement;
    };
    function injectCSS(data: any, placement: any, containerID: any): void;
    function injectCSS(data: any, placement: any, containerID: any): void;
    function setupEventHandlers(placement: any, containerNodes: any): void;
    function setupEventHandlers(placement: any, containerNodes: any): void;
    function replace(elementData: any, callback: any): void;
    function replace(elementData: any, callback: any): void;
    function translate(key: any): string;
    function translate(key: any): string;
    function isInvalidSize(size: any): boolean;
    function isInvalidSize(size: any): boolean;
    function isNested(el: any, elements: any): boolean;
    function isNested(el: any, elements: any): boolean;
    function getStyle(elementData: any, property: any): any;
    function getStyle(elementData: any, property: any): any;
    function done(replaced: any): void;
    function done(replaced: any): void;
}
declare function checkElement(element: any): void;
