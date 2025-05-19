export class EventEmitter {
    _listeners: Map<any, any>;
    on(name: string, listener: Function): void;
    off(name: string, listener: Function): void;
    listeners(name: string): Array<Function>;
    hasListeners(name?: string | undefined): boolean;
    emit(name: string, ...args?: any[] | undefined): void;
}
