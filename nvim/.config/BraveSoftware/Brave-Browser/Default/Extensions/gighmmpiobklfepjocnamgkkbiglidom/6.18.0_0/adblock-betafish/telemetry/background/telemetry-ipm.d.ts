export default IPMTelemetry;
declare class IPMTelemetry extends TelemetryBase {
    static processResponse(response: any): Promise<void>;
    scheduleNextPing(): Promise<any>;
    sendPingData(pingData: any): Promise<void>;
    pingNow(): Promise<any>;
}
import TelemetryBase from "./telemetry-base";
