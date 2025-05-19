export class SessionStorage {
    constructor(namespace: string);
    _namespace: string;
    _queue: Promise<void>;
    _getGlobalKey(key: string): string;
    delete(key: string): Promise<any>;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    transaction(fn: Function): Promise<any>;
}
