export declare enum ScheduleType {
    once = "once",
    interval = "interval"
}
export interface Schedule {
    period: number;
    next: number;
    runOnce: boolean;
    count: number;
    activationId?: number;
}
export interface ListenerInfo {
    callCount: number;
}
export declare type Listener = (info: ListenerInfo) => void;
