export let port: Port;
declare class Port {
    _eventEmitter: EventEmitter;
    _onMessage(message: any, sender: any): Promise<any>;
    on(name: string, callback: any): void;
    off(name: string, callback: any): void;
    disconnect(): void;
}
import { EventEmitter } from "../events.js";
export {};
