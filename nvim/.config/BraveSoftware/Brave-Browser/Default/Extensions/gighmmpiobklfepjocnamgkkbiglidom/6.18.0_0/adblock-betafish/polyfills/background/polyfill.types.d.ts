export declare type EventEmitterCallback<T> = (arg: T) => void;
export interface FilterMetadata {
    created: number;
    origin: string;
}
export interface MessageSender {
    page: {
        id: number;
        url: URL;
    };
}
export interface TabRemovedEventData {
    tabId: number;
    value: any;
}
