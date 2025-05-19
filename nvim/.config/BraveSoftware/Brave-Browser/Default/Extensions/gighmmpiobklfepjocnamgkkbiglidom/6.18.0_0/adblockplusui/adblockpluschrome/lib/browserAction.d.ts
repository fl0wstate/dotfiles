export function setBadge(tabId: number, badge: {
    color: string;
    number: string;
}): void;
export function setIconImageData(tabId: number, imageData: object): void;
export function setIconPath(tabId: number, path: string): void;
export function toggleBadge(tabId: number, shouldHide: boolean): Promise<void>;
