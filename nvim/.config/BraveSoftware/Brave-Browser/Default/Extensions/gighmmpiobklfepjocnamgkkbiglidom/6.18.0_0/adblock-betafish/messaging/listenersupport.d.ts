declare class ListenerSupport {
    listeners: any[];
    addListener(listener: Function): void;
    removeListener(listener: Function): void;
    emit(...args?: any[] | undefined): void;
}
