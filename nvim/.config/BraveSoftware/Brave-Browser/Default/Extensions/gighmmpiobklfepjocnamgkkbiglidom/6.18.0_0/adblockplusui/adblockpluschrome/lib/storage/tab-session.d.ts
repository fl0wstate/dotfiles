export class TabSessionStorage extends EventEmitter {
    constructor(namespace: string);
    _namespace: string;
    _queue: Promise<void>;
    delete(tabId: number): Promise<any>;
    emit(name: string, tabId: number): Promise<void>;
    get(tabId: number): Promise<any>;
    has(tabId: number): Promise<boolean>;
    set(tabId: number, value: any): Promise<any>;
    transaction(fn: Function): Promise<any>;
}
import { EventEmitter } from "../events.js";
