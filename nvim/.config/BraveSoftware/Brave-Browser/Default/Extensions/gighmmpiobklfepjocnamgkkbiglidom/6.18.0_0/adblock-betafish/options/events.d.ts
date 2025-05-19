declare function send(command: any, args: any): Promise<unknown>;
declare function send(command: any, args: any): Promise<unknown>;
declare function sendTypeMessage(type: any, args: any): Promise<unknown>;
declare function sendTypeMessage(type: any, args: any): Promise<unknown>;
declare class EventEmitter {
    listeners(name: string): Array<Function>;
    on(name: string, listener: Function): void;
    off(name: string, listener: Function): void;
    hasListeners(name?: string | undefined): boolean;
    emit(name: string, ...args?: any[] | undefined): void;
}
