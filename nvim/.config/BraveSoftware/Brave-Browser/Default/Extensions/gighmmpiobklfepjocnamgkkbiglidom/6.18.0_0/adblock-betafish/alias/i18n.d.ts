declare function assignAction(elements: any, action: any): void;
declare function getRemainingLinks(parent: any): Generator<any, void, unknown>;
declare function setElementLinks(idOrElement: any, ...actions: any[]): void;
declare function stripTagsUnsafe(text: any): any;
declare function setElementText(element: any, stringName: any, args: any, children?: any[]): void;
declare function loadI18nStrings(): void;
declare function initI18n(): void;
declare const i18nAttributes: string[];
