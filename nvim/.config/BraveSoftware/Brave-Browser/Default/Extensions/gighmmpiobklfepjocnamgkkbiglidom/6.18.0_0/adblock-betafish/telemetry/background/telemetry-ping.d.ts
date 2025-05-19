export const telemetryNotifier: EventEmitter;
export default Telemetry;
import { EventEmitter } from "../../../adblockplusui/adblockpluschrome/lib/events";
declare class Telemetry extends TelemetryBase {
    scheduleNextPing(): Promise<any>;
    shouldRetrySendPingData(pingData: any, resolve: any, reject: any, retryCount?: number): void;
    retrySendPingData(pingData: any, resolve: any, reject: any, retryCount?: number): Promise<void>;
    sendPingData(pingData: any): Promise<any>;
    pingNow(): Promise<{
        b: any;
        extid: string;
        aa: string;
        crctotal: number;
        crcsnippet: number;
        crcelemhideemulation: number;
        crcelemhideexception: number;
        crcelemhide: number;
        crcallowing: number;
        crcblocking: number;
        crccomment: number;
        crcinvalid: number;
        dc: string;
        isPinned: string;
        dhp: string;
    }>;
}
import TelemetryBase from "./telemetry-base";
